import React from 'react';
import type { ChampionshipStanding } from './types';
import { TEAM_COLORS } from './constants';

interface ExtendedStanding extends ChampionshipStanding {
  wins?: number;
}

interface ChampionshipStandingsProps {
  standings: ExtendedStanding[];
  isLive?: boolean;
  lastUpdated?: string;
}

const ChampionshipStandings: React.FC<ChampionshipStandingsProps> = ({ standings, isLive, lastUpdated }) => {
  const maxPoints = Math.max(...standings.map(s => s.points), 1);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-wider">
          World Drivers' Championship
        </h2>
        <div className="flex flex-col items-end gap-1">
          {isLive ? (
            <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              LIVE DATA
            </span>
          ) : (
            <span className="bg-gray-700/50 text-gray-400 text-xs px-3 py-1 rounded-full">
              Reference Data
            </span>
          )}
          {lastUpdated && (
            <span className="text-gray-600 text-xs">{lastUpdated}</span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-3 text-sm font-semibold text-gray-400 w-12 text-center">POS</th>
              <th className="p-3 text-sm font-semibold text-gray-400">DRIVER</th>
              <th className="p-3 text-sm font-semibold text-gray-400 hidden md:table-cell">TEAM</th>
              <th className="p-3 text-sm font-semibold text-gray-400 w-20 hidden sm:table-cell">GAP</th>
              {standings.some(s => s.wins !== undefined) && (
                <th className="p-3 text-sm font-semibold text-gray-400 w-16 text-center hidden md:table-cell">WINS</th>
              )}
              <th className="p-3 text-sm font-semibold text-gray-400 w-20 text-right">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, idx) => {
              const teamInfo = TEAM_COLORS[standing.team] || { bg: 'bg-gray-700', hex: '#6b7280' };
              const leader = standings[0];
              const gap = idx === 0 ? '—' : `–${leader.points - standing.points}`;
              const barWidth = (standing.points / maxPoints) * 100;

              return (
                <tr key={standing.rank} className="border-b border-gray-700/60 hover:bg-gray-700/30 transition-colors group">
                  <td className="p-3 text-center">
                    {standing.rank <= 3 ? (
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-sm
                        ${standing.rank === 1 ? 'bg-yellow-500 text-black' : standing.rank === 2 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'}`}>
                        {standing.rank}
                      </span>
                    ) : (
                      <span className="font-bold text-gray-400">{standing.rank}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <span className={`w-1 h-6 ${teamInfo.bg} rounded-full flex-shrink-0`} />
                        <span className="font-semibold text-white">{standing.driver}</span>
                      </div>
                      {/* Points bar */}
                      <div className="ml-4 mt-1.5 hidden sm:block">
                        <div className="h-1 bg-gray-700 rounded-full w-32">
                          <div
                            className="h-1 rounded-full transition-all duration-1000"
                            style={{ width: `${barWidth}%`, backgroundColor: teamInfo.hex }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-400 text-sm hidden md:table-cell">{standing.team}</td>
                  <td className="p-3 text-gray-500 text-sm font-mono hidden sm:table-cell">{gap}</td>
                  {standings.some(s => s.wins !== undefined) && (
                    <td className="p-3 text-center hidden md:table-cell">
                      {(standing.wins ?? 0) > 0 && (
                        <span className="text-yellow-400 font-bold">{standing.wins}</span>
                      )}
                      {(standing.wins ?? 0) === 0 && (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                  )}
                  <td className="p-3 font-black text-white text-right tabular-nums">{standing.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-600 mt-4 text-center">
        {isLive
          ? '✓ Data fetched live from the official F1 timing feed.'
          : 'Standings based on 2025 season reference data.'}
      </p>
    </div>
  );
};

export default ChampionshipStandings;
