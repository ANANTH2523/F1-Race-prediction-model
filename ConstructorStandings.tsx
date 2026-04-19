import React from 'react';
import type { LiveStanding } from './f1DataService';
import { TEAM_COLORS } from './constants';

interface ConstructorStandingsProps {
  standings: LiveStanding[];
  isLive?: boolean;
}

const ConstructorStandings: React.FC<ConstructorStandingsProps> = ({ standings, isLive }) => {
  const maxPoints = Math.max(...standings.map(s => s.points), 1);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/50 hover:shadow-2xl hover:border-gray-600/50 transition-all duration-300 animate-fade-in group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white uppercase tracking-wider select-none">
          World Constructors' Championship
        </h2>
        <div className="flex flex-col items-end gap-1">
          {isLive ? (
            <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/40 text-green-400 text-xs font-black px-3 py-1 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              LIVE DATA
            </span>
          ) : (
            <span className="bg-gray-800/80 border border-gray-600/50 text-gray-300 text-xs px-3 py-1 rounded-full shadow-inner">
              Reference Data
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm">
              <th className="p-4 text-xs font-black text-gray-400 w-12 text-center tracking-widest">POS</th>
              <th className="p-4 text-xs font-black text-gray-400 tracking-widest">TEAM</th>
              <th className="p-4 text-xs font-black text-gray-400 w-24 hidden sm:table-cell tracking-widest text-center">GAP</th>
              <th className="p-4 text-xs font-black text-gray-400 w-24 text-right tracking-widest">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, idx) => {
              const teamInfo = TEAM_COLORS[standing.team] || { bg: 'bg-gray-700', hex: '#6b7280', border: 'border-gray-500' };
              const leader = standings[0];
              const gap = idx === 0 ? '—' : `–${leader.points - standing.points}`;
              const barWidth = (standing.points / maxPoints) * 100;

              return (
                <tr key={standing.team} className="border-b border-gray-800 hover:bg-gray-800/80 transition-all duration-200 cursor-default">
                  <td className="p-4 text-center align-middle">
                     <span className="font-bold text-gray-300">{standing.rank}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <span className={`w-1.5 h-6 ${teamInfo.bg} rounded-full flex-shrink-0 shadow-sm`} />
                        <span className="font-bold text-white text-base tracking-wide uppercase">{standing.team}</span>
                        {(standing.wins ?? 0) > 0 && <span className="text-yellow-500 text-xs ml-auto hidden sm:inline">🏆 {standing.wins} WINS</span>}
                      </div>
                      <div className="mt-2 w-full max-w-xs relative group/bar hidden md:block">
                        <div className="h-1 bg-gray-800 rounded-full w-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${barWidth}%`, backgroundColor: teamInfo.hex }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 text-sm font-mono font-medium hidden sm:table-cell align-middle text-center">{gap}</td>
                  <td className="p-4 text-right align-middle">
                    <span className="font-black text-xl text-white tracking-tighter drop-shadow-sm">{standing.points}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center font-medium uppercase tracking-tighter opacity-50">
        World Championship Standings • 2026 Prediction Threshold
      </p>
    </div>
  );
};

export default ConstructorStandings;
