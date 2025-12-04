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
                  <div className="flex items-center justify-center gap-1 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                    <span>{positionChange}</span>
                  </div>
                );
              } else if (positionChange < 0) {
                changeContent = (
                  <div className="flex items-center justify-center gap-1 text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    <span>{Math.abs(positionChange)}</span>
                  </div>
                );
              } else {
                changeContent = <span className="text-gray-400 font-bold">-</span>;
              }

              return (
                <tr key={result.position} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-3 font-bold text-white text-center">{result.position}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <span className={`w-1 h-6 mr-4 ${teamInfo.bg}`}></span>
                      <div className="relative group">
                         <span className="font-semibold text-white cursor-help">{result.driver}</span>
                         {stats && <DriverStatsTooltip stats={stats} />}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-300 text-sm hidden md:table-cell">{result.team}</td>
                  <td className="p-3 font-mono text-white text-center">{result.startingPosition}</td>
                  <td className="p-3 font-mono font-bold text-center">{changeContent}</td>
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