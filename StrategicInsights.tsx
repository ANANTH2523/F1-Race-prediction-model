import React from 'react';
import type { Rivalry, Strategy } from '../types';
import { TEAM_COLORS } from '../constants';

// Icons
const RivalryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const StrategyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;

interface StrategicInsightsProps {
  rivalries: Rivalry[];
  strategies: Strategy[];
}

const StrategicInsights: React.FC<StrategicInsightsProps> = ({ rivalries, strategies }) => {
  if ((!rivalries || rivalries.length === 0) && (!strategies || strategies.length === 0)) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Key Rivalries */}
        <div>
          <h3 className="flex items-center gap-3 text-xl font-bold text-white mb-4 uppercase tracking-wider">
            <RivalryIcon />
            Key Rivalries
          </h3>
          <ul className="space-y-4">
            {rivalries.map((rivalry, index) => (
              <li key={index} className="bg-gray-900/40 p-4 rounded-lg">
                <p className="font-bold text-red-500 mb-1">{rivalry.drivers.join(' vs ')}</p>
                <p className="text-gray-300 text-sm">{rivalry.description}</p>
              </li>
            ))}
          </ul>
        </div>
        {/* Team Strategies */}
        <div>
          <h3 className="flex items-center gap-3 text-xl font-bold text-white mb-4 uppercase tracking-wider">
            <StrategyIcon />
            Team Strategies
          </h3>
          <ul className="space-y-4">
            {strategies.map((strategy, index) => {
              const teamInfo = TEAM_COLORS[strategy.team] || { border: 'border-gray-600' };
              return (
                <li key={index} className={`bg-gray-900/40 p-4 rounded-lg border-l-4 ${teamInfo.border}`}>
                  <p className="font-bold text-white mb-1">{strategy.team}</p>
                  <p className="text-gray-300 text-sm">{strategy.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StrategicInsights;