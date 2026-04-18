import React from 'react';
import type { RaceResultInfo, DriverStats } from './types';
import { TEAM_COLORS } from './constants';

interface ResultsTableProps {
  results: RaceResultInfo[];
  title: string;
  driverStats: { [driverName: string]: DriverStats };
}

const DriverStatsTooltip: React.FC<{ stats: DriverStats }> = ({ stats }) => (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        <h4 className="font-bold text-white border-b border-gray-600 pb-1 mb-2">Driver Stats</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
                <p className="text-gray-400">WDC Rank</p>
                <p className="font-bold text-white">{stats.championshipPosition || 'N/A'}</p>
            </div>
            <div>
                <p className="text-gray-400">Points</p>
                <p className="font-bold text-white">{stats.points || 'N/A'}</p>
            </div>
             <div>
                <p className="text-gray-400">WCC Rank</p>
                <p className="font-bold text-white">{stats.constructorPosition || 'N/A'}</p>
            </div>
            <div>
                <p className="text-gray-400">Recent Form</p>
                <p className="font-bold text-white">{stats.recentForm || 'N/A'}</p>
            </div>
        </div>
    </div>
);


const ResultsTable: React.FC<ResultsTableProps> = ({ results, title, driverStats }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg">
      <h2 className="text-2xl font-black text-center text-white mb-6 uppercase tracking-wider">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-3 text-sm font-semibold text-gray-400 w-12 text-center">POS</th>
              <th className="p-3 text-sm font-semibold text-gray-400">DRIVER</th>
              <th className="p-3 text-sm font-semibold text-gray-400 hidden md:table-cell">TEAM</th>
              <th className="p-3 text-sm font-semibold text-gray-400 w-12 text-center">GRID</th>
              <th className="p-3 text-sm font-semibold text-gray-400 w-12 text-center">+/-</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => {
              const teamInfo = TEAM_COLORS[result.team] || { bg: 'bg-gray-700' };
              const positionChange = result.startingPosition - result.position;
              const stats = driverStats[result.driver];
              
              let changeContent: React.ReactNode;
              if (positionChange > 0) {
                changeContent = (
                  <div className="flex items-center justify-center px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                    <span className="text-[10px] mr-1">▲</span>
                    <span className="text-xs font-black">{positionChange}</span>
                  </div>
                );
              } else if (positionChange < 0) {
                changeContent = (
                  <div className="flex items-center justify-center px-2 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                    <span className="text-[10px] mr-1">▼</span>
                    <span className="text-xs font-black">{Math.abs(positionChange)}</span>
                  </div>
                );
              } else {
                changeContent = (
                  <div className="flex items-center justify-center px-2 py-1 rounded-full bg-gray-500/10 text-gray-500 border border-white/5">
                    <span className="text-xs font-black">=</span>
                  </div>
                );
              }

              return (
                <tr key={result.position} className={`border-b border-gray-700 hover:bg-gray-700/50 ${result.isDNF ? 'opacity-60 bg-red-900/5' : ''}`}>
                  <td className={`p-3 font-bold text-center ${result.isDNF ? 'text-red-500' : 'text-white'}`}>
                    {result.isDNF ? 'DNF' : result.position}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <span className={`w-1 h-6 mr-4 ${teamInfo.bg}`}></span>
                      <div className="relative group">
                         <div className="flex items-center gap-2">
                            <span className={`font-semibold cursor-help ${result.isDNF ? 'text-red-400' : 'text-white'}`}>
                              {result.driver}
                            </span>
                            {result.isFastestLap && (
                              <div className="group/lap relative flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="absolute left-full ml-2 px-2 py-1 bg-purple-900 text-[10px] text-white rounded opacity-0 group-hover/lap:opacity-100 transition-opacity whitespace-nowrap z-20">
                                  Fastest Lap
                                </span>
                              </div>
                            )}
                         </div>
                         {stats && <DriverStatsTooltip stats={stats} />}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-300 text-sm hidden md:table-cell">{result.team}</td>
                  <td className="p-3 font-mono text-white text-center">{result.startingPosition}</td>
                  <td className="p-3 font-mono font-bold text-center">
                    {result.isDNF ? <span className="text-gray-600">—</span> : changeContent}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;