// This file contains the Podium component, responsible for visualizing the top 3 drivers.
import React from 'react';
import type { PositionInfo } from '../types';
import { TEAM_COLORS } from '../constants';

interface PodiumProps {
  drivers: PositionInfo[];
}

// Fix: Implement the Podium component which was previously missing.
// This component displays a 3-step podium for the predicted top finishers.
const Podium: React.FC<PodiumProps> = ({ drivers }) => {
  const p1 = drivers.find(d => d.position === 1);
  const p2 = drivers.find(d => d.position === 2);
  const p3 = drivers.find(d => d.position === 3);

  if (!p1 || !p2 || !p3) {
    return (
        <div className="text-center text-red-500 p-4">Podium data is incomplete.</div>
    );
  }

  const podiumOrder = [p2, p1, p3]; // Order for visual layout (2nd, 1st, 3rd)

  const podiumSteps = [
    { height: 'h-40 md:h-48', order: 'order-2 md:order-1', driver: podiumOrder[0] }, // P2
    { height: 'h-56 md:h-64', order: 'order-1 md:order-2', driver: podiumOrder[1] }, // P1
    { height: 'h-32 md:h-40', order: 'order-3 md:order-3', driver: podiumOrder[2] }, // P3
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg">
      <h2 className="text-2xl font-black text-center text-white mb-8 uppercase tracking-wider">Predicted Podium</h2>
      <div className="flex items-end justify-center gap-2 md:gap-4 text-center">
        {podiumSteps.map((step, index) => {
          const teamInfo = TEAM_COLORS[step.driver.team] || { bg: 'bg-gray-600', hex: '#6b7280' };
          const driverNameParts = step.driver.driver.split(' ');
          const lastName = driverNameParts.pop();
          const firstName = driverNameParts.join(' ');
          
          return (
            <div key={index} className={`flex flex-col items-center justify-end w-1/3 ${step.order}`}>
              <div className="flex flex-col items-center mb-2">
                 <span className="text-lg md:text-xl font-semibold text-gray-300">{firstName}</span>
                 <span className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">{lastName}</span>
                 <span className="text-sm md:text-base text-gray-400 mt-1">{step.driver.team}</span>
              </div>
              <div
                className={`w-full ${step.height} rounded-t-lg flex flex-col items-center justify-between p-2 md:p-4 shadow-inner`}
                style={{ backgroundColor: `${teamInfo.hex}40` /* 25% opacity */, borderTop: `4px solid ${teamInfo.hex}`}}
              >
                <div className="text-white font-black text-6xl md:text-8xl opacity-30" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
                  {step.driver.position}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Podium;
