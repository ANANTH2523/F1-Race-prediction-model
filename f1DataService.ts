// Live F1 data service — fetches from the free Jolpica Ergast API (no key needed)
// Falls back gracefully to hardcoded constants if network is unavailable.
import type { ChampionshipStanding } from './types';
import { F1_WDC_STANDINGS, F1_2026_CALENDAR, DRIVER_TEAM_MAP, F1_2026_TEAMS } from './constants';

const JOLPICA_BASE = 'https://api.jolpi.ca/ergast/f1';

export interface LiveCalendarRace {
  name: string;
  circuit: string;
  date: string;       // display string e.g. "Mar 16"
  startDate: string;  // ISO date string
  country: string;
  round: number;
  hasSprint: boolean;
}

export interface LiveStanding {
  rank: number;
  driver?: string;  // only present if Driver Standing
  team: string;
  points: number;
  wins: number;
}

// ─── Driver name normalisation ───────────────────────────────────────────────
// Ergast uses "familyName, givenName" – map to our full-name constants
const ERGAST_SURNAME_MAP: Record<string, string> = {
  'norris': 'Lando Norris',
  'verstappen': 'Max Verstappen',
  'piastri': 'Oscar Piastri',
  'leclerc': 'Charles Leclerc',
  'hamilton': 'Lewis Hamilton',
  'russell': 'George Russell',
  'sainz': 'Carlos Sainz',
  'alonso': 'Fernando Alonso',
  'gasly': 'Pierre Gasly',
  'lawson': 'Liam Lawson',
  'tsunoda': 'Yuki Tsunoda',
  'hulkenberg': 'Nico Hulkenberg',
  'stroll': 'Lance Stroll',
  'ocon': 'Esteban Ocon',
  'albon': 'Alexander Albon',
  'hadjar': 'Isack Hadjar',
  'bearman': 'Oliver Bearman',
  'colapinto': 'Franco Colapinto',
  'antonelli': 'Andrea Kimi Antonelli',
  'doohan': 'Jack Doohan',
  'bortoleto': 'Gabriel Bortoleto',
  'lindblad': 'Arvid Lindblad',
  'perez': 'Sergio Perez',
  'bottas': 'Valtteri Bottas',
};

const ERGAST_TEAM_MAP: Record<string, string> = {
  'mclaren': 'McLaren Formula 1 Team',
  'red_bull': 'Oracle Red Bull Racing',
  'ferrari': 'Scuderia Ferrari HP',
  'mercedes': 'Mercedes-AMG Petronas Formula One Team',
  'williams': 'Williams Racing',
  'aston_martin': 'Aston Martin Aramco Formula One Team',
  'alpine': 'BWT Alpine F1 Team',
  'rb': 'Visa Cash App RB Formula One Team',
  'haas': 'MoneyGram Haas F1 Team',
  'kick_sauber': 'Audi F1 Team', // Kick Sauber rebranded to Audi
  'sauber': 'Audi F1 Team',
};

function normaliseTeam(constructorId: string, constructorName: string): string {
  const id = constructorId.toLowerCase();
  for (const [key, val] of Object.entries(ERGAST_TEAM_MAP)) {
    if (id.includes(key)) return val;
  }
  return constructorName;
}

function normaliseDriver(familyName: string, givenName: string): string {
  const key = familyName.toLowerCase();
  return ERGAST_SURNAME_MAP[key] || `${givenName} ${familyName}`;
}

// ─── Fetch driver standings ───────────────────────────────────────────────────
export async function fetchLiveDriverStandings(): Promise<LiveStanding[]> {
  try {
    const res = await fetch(`${JOLPICA_BASE}/current/driverStandings.json`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error('non-200');
    const json = await res.json();
    const list = json?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
    if (!list || list.length === 0) throw new Error('empty');

    return list.map((entry: any, i: number) => ({
      rank: i + 1,
      driver: normaliseDriver(entry.Driver.familyName, entry.Driver.givenName),
      team: normaliseTeam(entry.Constructors[0]?.constructorId ?? '', entry.Constructors[0]?.name ?? ''),
      points: parseFloat(entry.points),
      wins: parseInt(entry.wins, 10),
    }));
  } catch {
    // Fallback: return the hardcoded 2025/2026 constants
    return F1_WDC_STANDINGS.map(s => ({ ...s, wins: 0 }));
  }
}

// ─── Fetch constructor standings ──────────────────────────────────────────────
export async function fetchLiveConstructorStandings(): Promise<LiveStanding[]> {
  try {
    const res = await fetch(`${JOLPICA_BASE}/current/constructorStandings.json`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error('non-200');
    const json = await res.json();
    const list = json?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings;
    if (!list || list.length === 0) throw new Error('empty');

    return list.map((entry: any, i: number) => ({
      rank: i + 1,
      team: normaliseTeam(entry.Constructor?.constructorId ?? '', entry.Constructor?.name ?? ''),
      points: parseFloat(entry.points),
      wins: parseInt(entry.wins, 10),
    }));
  } catch {
    // Fallback: derive team points from the fallback driver standings
    const teamPoints: Record<string, { points: number, wins: number }> = {};
    for (const team of F1_2026_TEAMS) {
      teamPoints[team] = { points: 0, wins: 0 };
    }
    
    for (const standing of F1_WDC_STANDINGS) {
      if (!teamPoints[standing.team]) teamPoints[standing.team] = { points: 0, wins: 0 };
      teamPoints[standing.team].points += standing.points;
    }
    
    return Object.entries(teamPoints)
      .map(([team, data]) => ({ team, points: data.points, wins: data.wins, rank: 0 }))
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  }
}

// ─── Fetch race calendar ─────────────────────────────────────────────────────
export async function fetchLiveCalendar(): Promise<LiveCalendarRace[]> {
  try {
    const res = await fetch(`${JOLPICA_BASE}/current.json`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error('non-200');
    const json = await res.json();
    const races = json?.MRData?.RaceTable?.Races;
    if (!races || races.length === 0) throw new Error('empty');

    return races.map((r: any) => {
      const dateStr = r.date as string; // YYYY-MM-DD
      const dt = new Date(dateStr);
      const formatted = dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      return {
        name: r.raceName,
        circuit: r.Circuit?.circuitName ?? r.raceName,
        date: formatted,
        startDate: dateStr,
        country: r.Circuit?.Location?.country ?? '',
        round: parseInt(r.round, 10),
        hasSprint: !!r.Sprint,
      };
    });
  } catch {
    // Fallback to the hardcoded 2026 calendar
    return F1_2026_CALENDAR.map((r, i) => ({
      name: r.name,
      circuit: r.circuit,
      date: r.date,
      startDate: r.startDate,
      country: '',
      round: i + 1,
      hasSprint: r.name.toLowerCase().includes('sprint') || false,
    }));
  }
}

// ─── Next race helper ─────────────────────────────────────────────────────────
export function getNextRace(calendar: LiveCalendarRace[]): LiveCalendarRace | null {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return calendar.find(r => new Date(r.startDate) >= now) ?? null;
}
