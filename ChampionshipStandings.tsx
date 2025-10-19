import React from 'react';
import type { ChampionshipStanding } from '../types';
import { TEAM_COLORS } from '../constants';

interface ChampionshipStandingsProps {
  standings: ChampionshipStanding[];
}

const ChampionshipStandings: React.FC<ChampionshipStandingsProps> = ({ standings }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-black text-center text-white mb-6 uppercase tracking-wider">World Drivers' Championship Standings</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-3 text-sm font-semibold text-gray-400 w-12 text-center">RANK</th>
              <th className="p-3 text-sm font-semibold text-gray-400">DRIVER</th>
              <th className="p-3 text-sm font-semibold text-gray-400 hidden md:table-cell">TEAM</th>
              <th className="p-3 text-sm font-semibold text-gray-400 w-20 text-right">POINTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing) => {
              const teamInfo = TEAM_COLORS[standing.team] || { bg: 'bg-gray-700' };

              return (
                <tr key={standing.rank} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-3 font-bold text-white text-center">{standing.rank}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <span className={`w-1 h-6 mr-4 ${teamInfo.bg}`}></span>
                      <span className="font-semibold text-white">{standing.driver}</span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-300 text-sm hidden md:table-cell">{standing.team}</td>
                  <td className="p-3 font-bold text-white text-right">{standing.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-4 text-center">Standings are based on the latest available data.</p>
      </div>
    </div>
  );
};

export default ChampionshipStandings;
