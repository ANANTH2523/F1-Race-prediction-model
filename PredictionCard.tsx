import React from 'react';
import { TEAM_COLORS, TEAM_LOGOS } from './constants';

interface PredictionCardProps {
  title: string;
  icon: React.ReactNode;
  mainText: string;
  subText?: string;
  team?: string;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ title, icon, mainText, subText, team }) => {
  const teamInfo = team && TEAM_COLORS[team] ? TEAM_COLORS[team] : { border: 'border-gray-600' };
  const teamLogo = team ? TEAM_LOGOS[team] : null;

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border-2 border-l-8 ${teamInfo.border} transition-all duration-300 hover:bg-gray-800/80 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between`}>
      <div className="flex items-start justify-between">
          <div>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{title}</h3>
            <p className="text-white text-xl font-bold truncate max-w-[150px]">{mainText}</p>
            {subText && <p className="text-gray-300">{subText}</p>}
          </div>
          <div className="text-red-500 text-3xl">
            {icon}
          </div>
      </div>
      {(teamLogo) && (
        <div className="flex justify-end mt-2 h-16 items-center">
            {teamLogo && <img src={teamLogo} alt={team} className="max-w-full max-h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'}/>}
        </div>
      )}
    </div>
  );
};

export default PredictionCard;