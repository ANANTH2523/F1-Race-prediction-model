// Smart local prediction engine — no API key required.
// Uses circuit data, real standings weights, and 2026 driver/team mapping.
import type { PredictionData, LapHistory, CommentaryEntry } from './types';
import { F1_2026_DRIVERS, F1_WDC_STANDINGS, F1_2026_TEAMS, CIRCUIT_DATA, DRIVER_TEAM_MAP } from './constants';

// ---------------------------------------------------------------------------
// Seeded RNG (mulberry32)
// ---------------------------------------------------------------------------
function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6D2B79F5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashString(str: string): number {
  let h = 0xdeadbeef;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 2246822519);
    h ^= Math.imul(h >>> 13, h | 7277);
  }
  return (h ^ (h >>> 16)) >>> 0;
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------
const BASE_SKILL: Record<string, number> = {
  'Max Verstappen':        0.960,
  'Lando Norris':          0.950,
  'Charles Leclerc':       0.910,
  'Oscar Piastri':         0.900,
  'George Russell':        0.870,
  'Carlos Sainz':          0.855,
  'Lewis Hamilton':        0.845,
  'Fernando Alonso':       0.810,
  'Pierre Gasly':          0.730,
  'Liam Lawson':           0.720,
  'Nico Hulkenberg':       0.715,
  'Alexander Albon':       0.700,
  'Oliver Bearman':        0.680,
  'Esteban Ocon':          0.670,
  'Lance Stroll':          0.650,
  'Andrea Kimi Antonelli': 0.640,
  'Isack Hadjar':          0.625,
  'Franco Colapinto':      0.610,
  'Gabriel Bortoleto':     0.600,
  'Arvid Lindblad':        0.575,
  'Sergio Perez':          0.565,
  'Valtteri Bottas':       0.545,
};

function standingBoost(driver: string): number {
  const entry = F1_WDC_STANDINGS.find(e => e.driver === driver);
  if (!entry) return 0;
  const rank = entry.rank;
  if (rank === 1) return 0.08;
  if (rank <= 3) return 0.05;
  if (rank <= 6) return 0.02;
  if (rank <= 10) return 0.01;
  return 0;
}

function getCircuit(race: string) {
  const r = race.toLowerCase();
  return (
    CIRCUIT_DATA.find(c => r.includes(c.key)) ??
    CIRCUIT_DATA.find(c => c.key === 'bahrain') ??   // sensible default
    CIRCUIT_DATA[0]
  );
}

function teamBoostFor(team: string, boostMap: Record<string, number>): number {
  for (const [key, val] of Object.entries(boostMap)) {
    if (team.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return 0;
}

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = (totalSeconds % 60).toFixed(3).padStart(6, '0');
  return `${mins}:${secs}`;
}

function circuitBaseSeconds(circuit: any, rng: () => number): number {
  const parts = circuit.lapRecord.split(':');
  const base = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  return base - 0.8 + rng() * 0.3;
}

function pitstopTime(rng: () => number): string {
  return `${(2.2 + rng() * 0.9).toFixed(3)}s`;
}

function recentForm(driver: string, race: string): string {
  const rng = seededRng(hashString(driver + race + 'form'));
  const skill = BASE_SKILL[driver] ?? 0.55;
  const results: string[] = [];
  for (let i = 0; i < 3; i++) {
    const jitter = (rng() - 0.5) * 0.4;
    const pos = Math.max(1, Math.min(20, Math.round((1 - skill - jitter) * 18 + 1)));
    results.push(`P${pos}`);
  }
  return results.join(', ');
}

// ---------------------------------------------------------------------------
// Driver Traits & Simulation
// ---------------------------------------------------------------------------
const DRIVER_TRAITS: Record<string, { aggression: number; reliability: number; experience: number; consistency: number }> = {
  'Max Verstappen':        { aggression: 0.95, reliability: 0.98, experience: 0.95, consistency: 0.98 },
  'Lando Norris':          { aggression: 0.88, reliability: 0.96, experience: 0.80, consistency: 0.92 },
  'Charles Leclerc':       { aggression: 0.92, reliability: 0.92, experience: 0.88, consistency: 0.85 },
  'Oscar Piastri':         { aggression: 0.75, reliability: 0.97, experience: 0.70, consistency: 0.94 },
  'George Russell':        { aggression: 0.85, reliability: 0.94, experience: 0.85, consistency: 0.80 },
  'Carlos Sainz':          { aggression: 0.70, reliability: 0.95, experience: 0.92, consistency: 0.90 },
  'Lewis Hamilton':        { aggression: 0.80, reliability: 0.96, experience: 1.00, consistency: 0.88 },
  'Fernando Alonso':       { aggression: 0.90, reliability: 0.94, experience: 1.00, consistency: 0.85 },
  'Liam Lawson':           { aggression: 0.82, reliability: 0.90, experience: 0.40, consistency: 0.75 },
  'Alexander Albon':       { aggression: 0.65, reliability: 0.93, experience: 0.75, consistency: 0.88 },
  'Andrea Kimi Antonelli': { aggression: 0.95, reliability: 0.85, experience: 0.20, consistency: 0.65 },
  'Sergio Perez':          { aggression: 0.60, reliability: 0.88, experience: 0.90, consistency: 0.55 },
  'Nico Hulkenberg':       { aggression: 0.70, reliability: 0.96, experience: 0.95, consistency: 0.82 },
};

const DEFAULT_TRAITS = { aggression: 0.7, reliability: 0.9, experience: 0.5, consistency: 0.7 };

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export const getRacePrediction = async (
  race: string,
  liveStandings?: { driver?: string; team: string; points: number; wins: number }[],
  liveConstructorStandings?: { team: string; points: number; wins: number }[],
): Promise<PredictionData> => {
  const seed = hashString(race);
  const rng = seededRng(seed);

  const circuit = getCircuit(race);
  const rKey = circuit.key;
  
  // Intelligence Coefficients
  const OVERTAKE_DIFFICULTY = rKey === 'monaco' || rKey === 'hungary' ? 0.4 : 1.0;
  const TYRE_WEAR_COEFF = rKey === 'bahrain' || rKey === 'spanish' ? 1.4 : 1.0;
  const DNF_PROB_COEFF = rKey === 'baku' || rKey === 'monaco' || rKey === 'singapore' ? 2.5 : 1.0;

  const pool = circuit.weatherPool;
  const weather = pool[Math.floor(rng() * pool.length)];
  const isWet = weather.condition.toLowerCase().includes('rain') || weather.condition.toLowerCase().includes('wet');

  // 1. Initial State & Intelligence Tiers
  const TIER_MAP: Record<string, 'S' | 'A' | 'B' | 'C'> = {
    'Max Verstappen': 'S', 'Lando Norris': 'S', 'Lewis Hamilton': 'S',
    'Charles Leclerc': 'A', 'Oscar Piastri': 'A', 'George Russell': 'A',
    'Carlos Sainz': 'A', 'Fernando Alonso': 'A',
    'Alexander Albon': 'B', 'Liam Lawson': 'B', 'Nico Hulkenberg': 'B', 'Pierre Gasly': 'B',
  };

  const driversState = F1_2026_DRIVERS.map(driver => {
    const team = DRIVER_TEAM_MAP[driver] ?? '';
    const traits = DRIVER_TRAITS[driver] ?? DEFAULT_TRAITS;
    const tier = TIER_MAP[driver] ?? 'C';
    let baseScore = BASE_SKILL[driver] ?? 0.55;

    baseScore += standingBoost(driver);
    baseScore += teamBoostFor(team, circuit.teamBoost);

    if (isWet) baseScore += (traits.experience - 0.5) * 0.15; // Experience heavily matters in wet

    return {
      driver,
      team,
      traits,
      tier,
      currentGap: 0,
      skill: baseScore,
      isDNF: false,
      gridPosition: 0, // Set after qualifying
      lastPosition: 0,
      tyreHealth: 1.0,
      bestLap: 999
    };
  });

  // 2. Qualifying (75 years of data shows top teams almost always occupy the first 2-3 rows)
  driversState.sort((a, b) => (b.skill + (rng() - 0.5) * 0.1) - (a.skill + (rng() - 0.5) * 0.1));
  driversState.forEach((d, i) => { 
    d.gridPosition = i + 1; 
    d.lastPosition = i + 1;
  });
  
  const startSeconds = circuitBaseSeconds(circuit, rng);
  const polePosition = { driver: driversState[0].driver, team: driversState[0].team, time: formatTime(startSeconds) };

  // 3. Historical Simulation
  const probabilityHistory: LapHistory[] = [];
  const commentary: CommentaryEntry[] = [];
  const TOTAL_LAPS = circuit.laps || 50;
  let isSafetyCar = false;
  let scLaps = 0;

  commentary.push({ lap: 0, text: `LIGHTS OUT AND AWAY WE GO! The historic ${circuit.officialName} venue is roaring for the 2026 GP!`, type: 'event' });

  for (let lap = 1; lap <= TOTAL_LAPS; lap++) {
    // Safety Car logic (10% chance per race for realism)
    if (!isSafetyCar && lap > 10 && lap < TOTAL_LAPS - 5 && rng() > 0.998) {
      isSafetyCar = true;
      scLaps = 3 + Math.floor(rng() * 4);
      commentary.push({ lap, text: "SAFETY CAR DEPLOYED! Packing up the field.", type: 'warning' });
    }

    if (scLaps > 0) {
      scLaps--;
      if (scLaps === 0) {
        isSafetyCar = false;
        commentary.push({ lap, text: "SAFETY CAR IN... Green Flag!", type: 'event' });
      }
    }

    driversState.forEach((d, i) => {
      if (d.isDNF) return;

      if (isSafetyCar) {
        d.currentGap *= 0.15; // Real-world bunching (90% reduction approx)
        return;
      }

      // 1. Basic Pace
      d.tyreHealth -= (0.009 + rng() * 0.005) * TYRE_WEAR_COEFF;
      if (lap === Math.floor(TOTAL_LAPS * 0.45)) d.tyreHealth = 1.0; // Pit transition

      const wearImpact = (1 - d.tyreHealth) * 0.25;
      let lapPerformance = d.skill - wearImpact + (rng() - 0.5) * (0.1 / d.traits.consistency);
      
      // 2. Dirty Air Modeling (Following car penalty)
      const currentPos = driversState.findIndex(ds => ds.driver === d.driver) + 1;
      if (currentPos > 1) {
         const aheadGap = d.currentGap - driversState[currentPos - 2].currentGap;
         if (aheadGap < 1.0) {
            // Turbulence Penalty: Experience (Alonso/Hamilton) mitigates this by 40%
            const turbPenalty = (0.3 - d.traits.experience * 0.1) * (1 / OVERTAKE_DIFFICULTY);
            lapPerformance -= turbPenalty;
         }
      }

      // 3. Recovery Intelligence (Tier S/A recovery from back)
      if (currentPos > 8 && (d.tier === 'S' || d.tier === 'A')) {
         lapPerformance += 0.15; // "The Spa 2022 Factor" - Elite cars hunting through midfield
      }

      const delta = (0.5 - lapPerformance) * 1.5;
      d.currentGap += delta;

      const currentLapTime = startSeconds + (0.5 - lapPerformance) * 3;
      if (currentLapTime < d.bestLap) d.bestLap = currentLapTime;

      // Realistic DNF rates (Modern F1 is 98% reliable)
      if (lap > 5 && rng() > 0.9999 + (d.traits.reliability * 0.0001)) {
        d.isDNF = true;
        const reasons = ["Power Unit loss", "Hydraulic failure", "Suspension damage"];
        commentary.push({ lap, text: `DNF: ${d.driver} out with ${reasons[Math.floor(rng() * reasons.length)]}.`, type: 'warning' });
      }
    });

    // Re-sort and Overtake
    driversState.sort((a, b) => {
      if (a.isDNF) return 1;
      if (b.isDNF) return -1;
      return a.currentGap - b.currentGap;
    });

    driversState.forEach((d, i) => {
       if (!d.isDNF && d.lastPosition > i + 1) {
          // Overtaking Logic
          const tierDiff = (d.tier === 'S' ? 3 : d.tier === 'A' ? 2 : 1) - (driversState[i].tier === 'S' ? 3 : driversState[i].tier === 'A' ? 2 : 1);
          const overtakeProb = (d.traits.aggression * 0.5) + (tierDiff * 0.2) + (OVERTAKE_DIFFICULTY * 0.3);
          
          if (rng() < overtakeProb) {
             if (i < 5) commentary.push({ lap, text: `${d.driver} pulls a classic move on ${driversState[i+1]?.driver}! Up to P${i+1}.`, type: 'telemetry' });
          } else {
             d.currentGap = driversState[i].currentGap + 0.5; // Stuck in dirty air
          }
       }
       d.lastPosition = i + 1;
    });

    // Probability Snapshot
    if (lap === 1 || lap % 10 === 0 || lap === TOTAL_LAPS) {
      const active = driversState.filter(d => !d.isDNF);
      const minGap = active[0].currentGap;
      const lapsLeft = TOTAL_LAPS - lap;
      
      const pData = active.slice(0, 10).map(d => {
         const gap = d.currentGap - minGap;
         const winProb = Math.max(0, 100 - (gap * (15 / (lapsLeft + 1)))); // Intelligence: Gap sensitivity increases near finish
         return { driver: d.driver, weight: winProb };
      });

      const totalW = pData.reduce((s, p) => s + p.weight, 0);
      probabilityHistory.push({
        lap,
        leader: active[0].driver,
        probabilities: pData.map(p => ({ driver: p.driver, probability: parseFloat(((p.weight / totalW) * 100).toFixed(1)) }))
      });
    }
  }

  // Identity fastest lap
  const winners = driversState.filter(d => !d.isDNF).sort((a,b) => a.bestLap - b.bestLap);
  const fastestLap = { driver: winners[0].driver, team: winners[0].team, time: formatTime(winners[0].bestLap) };

  const fullResults = driversState.map((d, i) => ({
    position: i + 1,
    driver: d.driver,
    team: d.team,
    startingPosition: d.gridPosition, // Use fixed gridPosition
    isDNF: d.isDNF,
    isFastestLap: d.driver === fastestLap.driver
  }));

  return {
    weather,
    podium: fullResults.slice(0, 3).map((r, i) => ({ position: i + 1, driver: r.driver, team: r.team })),
    fullResults,
    fastestLap,
    driverOfTheDay: { driver: driversState[3].driver, team: driversState[3].team }, // intelligence: hard fought racing
    fastestPitstop: { team: "McLaren Formula 1 Team", time: "1.85s" },
    winProbabilities: probabilityHistory[probabilityHistory.length - 1].probabilities,
    probabilityHistory,
    commentary: commentary.slice(0, 50),
    polePosition,
    keyRivalries: circuit.rivalries.map(r => ({ drivers: r.drivers as [string, string], description: r.description })),
    teamStrategies: circuit.strategies.map(s => ({ team: s.team, description: s.description })),
    driverStats: F1_2026_DRIVERS.map(driver => {
      const wdc = F1_WDC_STANDINGS.find(e => e.driver === driver);
      const team = DRIVER_TEAM_MAP[driver] || '';
      // Group standings by team to get constructor points
      const teamPoints: Record<string, number> = {};
      F1_WDC_STANDINGS.forEach(s => {
        teamPoints[s.team] = (teamPoints[s.team] || 0) + s.points;
      });
      const teamRanks = Object.keys(teamPoints).sort((a, b) => teamPoints[b] - teamPoints[a]);
      const cPos = teamRanks.indexOf(team) + 1;

      return { 
        driver, 
        stats: { 
          championshipPosition: wdc?.rank ?? 22, 
          points: wdc?.points ?? 0, 
          recentForm: recentForm(driver, race), 
          constructorPosition: cPos > 0 ? cPos : 11
        } 
      };
    })
  };
};