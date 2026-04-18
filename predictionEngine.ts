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

  // 1. Initial State
  const driversState = F1_2026_DRIVERS.map(driver => {
    const team = DRIVER_TEAM_MAP[driver] ?? '';
    const traits = DRIVER_TRAITS[driver] ?? DEFAULT_TRAITS;
    let baseScore = BASE_SKILL[driver] ?? 0.55;

    baseScore += standingBoost(driver);
    baseScore += teamBoostFor(team, circuit.teamBoost);

    if (isWet) baseScore += (traits.experience - 0.5) * 0.12;

    return {
      driver,
      team,
      traits,
      currentGap: 0,
      skill: baseScore,
      isDNF: false,
      lastPosition: 0,
      tyreHealth: 1.0,
      bestLap: 999
    };
  });

  // 2. Qualifying
  driversState.sort((a, b) => (b.skill + (rng() - 0.5) * 0.12) - (a.skill + (rng() - 0.5) * 0.12));
  driversState.forEach((d, i) => { d.lastPosition = i + 1; });
  const startSeconds = circuitBaseSeconds(circuit, rng);
  const polePosition = { driver: driversState[0].driver, team: driversState[0].team, time: formatTime(startSeconds) };

  // 3. Monte Carlo Simulation (50 Laps)
  const probabilityHistory: LapHistory[] = [];
  const commentary: CommentaryEntry[] = [];
  const TOTAL_LAPS = 50;

  commentary.push({ lap: 0, text: `LIGHTS OUT AND AWAY WE GO! The 2026 ${race.toUpperCase()} GP is underway!`, type: 'event' });

  for (let lap = 1; lap <= TOTAL_LAPS; lap++) {
    const lapFactor = lap / TOTAL_LAPS;

    driversState.forEach((d) => {
      if (d.isDNF) return;

      // Tyre Management Logic
      d.tyreHealth -= (0.01 + rng() * 0.005) * TYRE_WEAR_COEFF;
      if (lap === 20 || lap === 35) d.tyreHealth = 1.0; // Simulated Pit Stop

      const wearImpact = (1 - d.tyreHealth) * 0.15;
      const consistencyFactor = (1.1 - d.traits.consistency) * 0.3;
      
      const lapPerformance = d.skill - wearImpact + (rng() - 0.5) * consistencyFactor;
      const delta = (0.5 - lapPerformance) * 1.8;
      d.currentGap += delta;

      // Tracking Best Lap
      const currentLapTime = startSeconds + (0.5 - lapPerformance) * 2;
      if (currentLapTime < d.bestLap) d.bestLap = currentLapTime;

      // Dynamic DNF Probability
      const dnfFloor = 0.9997;
      const reliabilityAdjust = (d.traits.reliability - 0.9) * 0.02;
      if (lap > 5 && rng() > dnfFloor + reliabilityAdjust / DNF_PROB_COEFF) {
        d.isDNF = true;
        const reasons = ["Engine failure", "Gearbox issue", "Hydraulic leak", "Collision in the chicane", "Brake failure"];
        const reason = reasons[Math.floor(rng() * reasons.length)];
        commentary.push({ lap, text: `YELLOW FLAG: ${d.driver} is out! ${reason}.`, type: 'warning' });
      }
    });

    // Re-sort and Overtake Simulation
    driversState.sort((a, b) => {
      if (a.isDNF) return 1;
      if (b.isDNF) return -1;
      return a.currentGap - b.currentGap;
    });

    driversState.forEach((d, i) => {
      if (!d.isDNF && d.lastPosition > i + 1) {
        // Intelligence: Overtaking is harder on street circuits
        if (rng() < OVERTAKE_DIFFICULTY) {
          if (i < 3) {
             const text = i === 0 
                ? `${d.driver} launches a mega move into Turn 1 and TAKES THE LEAD!` 
                : `${d.driver} is flying! Just passed ${driversState[i+1]?.driver} for P${i+1}.`;
             commentary.push({ lap, text, type: i === 0 ? 'event' : 'telemetry' });
          }
        } else {
          // Failed Overtake attempt
          if (i < 5 && rng() > 0.8) {
             commentary.push({ lap, text: `${d.driver} looking for a way past ${driversState[i].driver}, but can't find the gap at ${race}.`, type: 'telemetry' });
          }
        }
      }
      d.lastPosition = i + 1;
    });

    // Probability Snapshot
    if (lap === 1 || lap % 10 === 0 || lap === TOTAL_LAPS) {
      const active = driversState.filter(d => !d.isDNF);
      const minGap = active[0].currentGap;
      const totalRelGap = active.slice(0, 10).reduce((sum, d) => sum + Math.exp(-(d.currentGap - minGap)), 0);
      
      probabilityHistory.push({
        lap,
        leader: active[0].driver,
        probabilities: active.slice(0, 10).map(d => ({
          driver: d.driver,
          probability: parseFloat(((Math.exp(-(d.currentGap - minGap)) / totalRelGap) * 100).toFixed(1))
        }))
      });
    }

    if (lap === 15 && isWet) commentary.push({ lap, text: "The track is getting Greasier. Grip levels are dropping significantly.", type: 'strategy' });
    if (lap === 45) commentary.push({ lap, text: "Closing stages! We are seeing some intense strategy battles on the pit wall.", type: 'strategy' });
  }

  // Identity fastest lap
  const allBestLaps = driversState.filter(d => !d.isDNF).sort((a,b) => a.bestLap - b.bestLap);
  const fastestLapEntry = allBestLaps[0];
  const fastestLap = {
    driver: fastestLapEntry.driver,
    team: fastestLapEntry.team,
    time: formatTime(fastestLapEntry.bestLap)
  };

  commentary.push({ lap: TOTAL_LAPS, text: `CHEQUERED FLAG! ${driversState[0].driver} crosses the line to win a thriller at ${race}!`, type: 'event' });

  const winProbabilities = probabilityHistory[probabilityHistory.length - 1].probabilities;
  const fullResults = driversState.map((d, i) => ({
    position: i + 1,
    driver: d.driver,
    team: d.team,
    startingPosition: d.lastPosition,
    isDNF: d.isDNF,
    isFastestLap: d.driver === fastestLap.driver
  }));

  const podium = fullResults.slice(0, 3).map((r, i) => ({
    position: i + 1,
    driver: r.driver,
    team: r.team,
  }));

  const dotdIdx = 4 + Math.floor(rng() * 8);
  const dotdDriver = driversState[dotdIdx];
  const driverOfTheDay = { driver: dotdDriver.driver, team: dotdDriver.team };

  const pitstopRng = seededRng(seed + 80);
  const fastestPitstop = { team: F1_2026_TEAMS[Math.floor(rng() * F1_2026_TEAMS.length)], time: pitstopTime(pitstopRng) };
  const keyRivalries = circuit.rivalries.map(r => ({ drivers: r.drivers as [string, string], description: r.description }));
  const teamStrategies = circuit.strategies.map(s => ({ team: s.team, description: s.description }));

  const teamConstructorRank: Record<string, number> = {};
  F1_WDC_STANDINGS.forEach(e => { teamConstructorRank[e.team] = (teamConstructorRank[e.team] || 0) + e.points; });
  const teamRanks = Object.keys(teamConstructorRank).sort((a,b) => teamConstructorRank[b] - teamConstructorRank[a]);

  const driverStats = F1_2026_DRIVERS.map(driver => {
    const wdc = F1_WDC_STANDINGS.find(e => e.driver === driver);
    const team = DRIVER_TEAM_MAP[driver] ?? '';
    return {
      driver,
      stats: {
        championshipPosition: wdc?.rank ?? 22,
        points: wdc?.points ?? 0,
        recentForm: recentForm(driver, race),
        constructorPosition: teamRanks.indexOf(team) + 1,
      },
    };
  });

  return {
    weather,
    podium,
    fullResults,
    fastestLap,
    driverOfTheDay,
    fastestPitstop,
    winProbabilities,
    probabilityHistory,
    commentary: commentary.slice(0, 50),
    polePosition,
    keyRivalries,
    teamStrategies,
    driverStats,
  };
};