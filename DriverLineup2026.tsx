import React from 'react';
import { F1_2026_DRIVERS, TEAM_COLORS } from './constants';

const DriverLineup2026: React.FC = () => {
  // Group drivers by team (pairs of 2)
  const teams = [];
  for (let i = 0; i < F1_2026_DRIVERS.length; i += 2) {
    teams.push(F1_2026_DRIVERS.slice(i, i + 2));
  }

  // Helper to guess team name from driver (simple mapping for display)
  const getTeamName = (driver1: string) => {
    if (driver1.includes("Russell")) return "Mercedes-AMG Petronas";
    if (driver1.includes("Verstappen")) return "Oracle Red Bull Racing";
    if (driver1.includes("Leclerc")) return "Scuderia Ferrari HP";
    if (driver1.includes("Norris")) return "McLaren Formula 1 Team";
    if (driver1.includes("Alonso")) return "Aston Martin Aramco";
    if (driver1.includes("Gasly")) return "BWT Alpine F1 Team";
    if (driver1.includes("Albon")) return "Williams Racing";
    if (driver1.includes("Hulkenberg")) return "Audi F1 Team";
    if (driver1.includes("Lawson")) return "Visa Cash App RB";
    if (driver1.includes("Bearman")) return "MoneyGram Haas F1 Team";
    if (driver1.includes("Perez")) return "Cadillac F1 Team";
    return "Unknown Team";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 mt-12 bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tighter">
          <span className="text-red-600">2026</span> Driver Lineup
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          The confirmed grid for the 2026 season, featuring new entries and team rebrands.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teams.map((drivers, index) => {
          const teamName = getTeamName(drivers[0]);
          const teamColor = TEAM_COLORS[teamName] || TEAM_COLORS["Audi F1 Team"]; // Fallback
          
          return (
            <div 
              key={index} 
              className={`bg-gray-800/80 rounded-xl overflow-hidden border-t-4 ${teamColor.border} hover:transform hover:scale-105 transition-all duration-300 shadow-lg`}
            >
              <div className={`p-3 ${teamColor.bg} bg-opacity-20 border-b border-gray-700`}>
                <h3 className="font-bold text-white text-center truncate">{teamName}</h3>
              </div>
              <div className="p-4 space-y-3">
                {drivers.map((driver, dIndex) => (
                  <div key={dIndex} className="flex items-center gap-3">
                    <div className={`w-1.5 h-8 ${teamColor.bg} rounded-full`}></div>
                    <span className="text-gray-200 font-medium text-lg">{driver}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriverLineup2026;
