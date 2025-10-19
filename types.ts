export interface WeatherPrediction {
  condition: string;
  temperature: string;
  detail: string;
}

export interface DriverInfo {
  driver: string;
  team: string;
}

export interface PositionInfo extends DriverInfo {
  position: number;
}

export interface TimedInfo extends DriverInfo {
  time: string;
}

export interface FastestPitstopInfo {
    team: string;
    time: string;
}

export interface WinProbability {
  driver: string;
  team: string;
  probability: number;
}

export interface RaceResultInfo {
  position: number;
  driver: string;
  team: string;
  startingPosition: number;
}

export interface ChampionshipStanding {
  rank: number;
  driver: string;
  team: string;
  points: number;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Rivalry {
  drivers: string[];
  description: string;
}

export interface Strategy {
  team: string;
  description: string;
}

export interface DriverStats {
  championshipPosition: number;
  points: number;
  recentForm: string; // e.g., "P5, P3, P10"
  constructorPosition: number;
}

export interface DriverStatsEntry {
  driver: string;
  stats: DriverStats;
}

export interface PredictionData {
  weather: WeatherPrediction;
  podium: PositionInfo[];
  fullResults: RaceResultInfo[];
  fastestLap: TimedInfo;
  driverOfTheDay: DriverInfo;
  fastestPitstop: FastestPitstopInfo;
  winProbabilities: WinProbability[];
  polePosition: TimedInfo;
  keyRivalries: Rivalry[];
  teamStrategies: Strategy[];
  driverStats: DriverStatsEntry[];
}