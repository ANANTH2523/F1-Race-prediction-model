import { TEAM_COLORS, DRIVER_STATS, DRIVER_PERSONAS } from './constants';

const RadarChart: React.FC<{ driver: string }> = ({ driver }) => {
  const stats = DRIVER_STATS[driver] || { pace: 70, defense: 70, overtaking: 70, consistency: 70 };
  
  // Scale stats (0-100) to coordinates (center 50,50)
  // Axis: Pace (top), Defense (right), Overtaking (bottom), Consistency (left)
  const p = { x: 50, y: 50 - (stats.pace * 0.4) };
  const d = { x: 50 + (stats.defense * 0.4), y: 50 };
  const o = { x: 50, y: 50 + (stats.overtaking * 0.4) };
  const c = { x: 50 - (stats.consistency * 0.4), y: 50 };

  const points = `${p.x},${p.y} ${d.x},${d.y} ${o.x},${o.y} ${c.x},${c.y}`;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-[0_0_8px_rgba(225,6,0,0.4)]">
        {/* Background Grids */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        
        {/* The Data Polygon */}
        <polygon
          points={points}
          fill="rgba(225, 6, 0, 0.4)"
          stroke="#E10600"
          strokeWidth="1.5"
          className="animate-pulse"
        />

        {/* Labels (Minimalist) */}
        <text x="50" y="8" textAnchor="middle" className="fill-gray-500 text-[6px] font-black uppercase">PAC</text>
        <text x="92" y="52" textAnchor="middle" className="fill-gray-500 text-[6px] font-black uppercase">DEF</text>
        <text x="50" y="98" textAnchor="middle" className="fill-gray-500 text-[6px] font-black uppercase">OVR</text>
        <text x="8" y="52" textAnchor="middle" className="fill-gray-500 text-[6px] font-black uppercase">CON</text>
      </svg>
    </div>
  );
};

const DriverStatsTooltip: React.FC<{ driver: string; stats: DriverStats }> = ({ driver, stats }) => {
    const persona = DRIVER_PERSONAS[driver] || "The Contender";
    
    return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 transform translate-y-2 group-hover:translate-y-0">
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
           <div>
              <h4 className="font-black text-white text-lg tracking-tighter uppercase italic">{driver}</h4>
              <p className="text-red-500 text-[9px] font-black uppercase tracking-[0.2em]">{persona}</p>
           </div>
           <div className="text-right">
              <span className="text-white/40 text-[9px] font-bold">WDC RANK</span>
              <p className="font-black text-white text-xl leading-none">#{stats.championshipPosition || '?'}</p>
           </div>
        </div>

        <div className="flex gap-4 items-center">
           <RadarChart driver={driver} />
           <div className="flex-1 space-y-2">
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                 <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Recent Form</p>
                 <p className="text-xs font-bold text-gray-200">{stats.recentForm || 'Stable'}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                 <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">WCC Impact</p>
                 <p className="text-xs font-bold text-gray-200">P{stats.constructorPosition || '?'}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                 <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Season Points</p>
                 <p className="text-xs font-bold text-white">{stats.points || '0'} PTS</p>
              </div>
           </div>
        </div>
        <div className="mt-3 pt-2 border-t border-white/5 text-center">
           <p className="text-[7px] text-gray-600 font-bold uppercase tracking-[0.3em]">Advanced Skill Telemetry 2026</p>
        </div>
    </div>
    );
};


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
              <th className="p-3 text-sm font-semibold text-gray-400 w-12 text-center">PTS</th>
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

              const tyreHealth = result.finalTyreHealth ?? 1.0;
              const tyreColor = tyreHealth > 0.6 ? 'bg-green-500' : tyreHealth > 0.3 ? 'bg-yellow-500' : 'bg-red-500';
              const tyreLabel = tyreHealth > 0.6 ? 'Fresh' : tyreHealth > 0.3 ? 'Worn' : 'Critical';

              return (
                <tr key={result.position} className={`border-b border-gray-700 hover:bg-gray-700/50 ${result.isDNF ? 'opacity-60 bg-red-900/5' : ''}`}>
                  <td className={`p-3 font-bold text-center ${result.isDNF ? 'text-red-500' : 'text-white'}`}>
                    {result.isDNF ? 'DNF' : result.position}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <span className={`w-1 h-6 mr-4 ${teamInfo.bg}`}></span>
                      <div className="relative group">
                         <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                               <span className={`font-semibold cursor-help ${result.isDNF ? 'text-red-400' : 'text-white'}`}>
                                 {result.driver}
                               </span>
                               {result.isFastestLap && (
                                 <div className="group/lap relative flex items-center">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                   </svg>
                                 </div>
                               )}
                            </div>
                            {/* Tyre Telemetry Bar */}
                            {!result.isDNF && (
                               <div className="flex items-center gap-2 mt-1">
                                  <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                                     <div className={`h-full ${tyreColor} transition-all duration-1000`} style={{ width: `${tyreHealth * 100}%` }} />
                                  </div>
                                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">{tyreLabel}</span>
                               </div>
                            )}
                         </div>
                         {stats && <DriverStatsTooltip driver={result.driver} stats={stats} />}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-300 text-sm hidden md:table-cell">{result.team}</td>
                  <td className="p-3 font-mono text-white text-center">{result.startingPosition}</td>
                  <td className="p-3 font-mono font-bold text-center">
                    {result.isDNF ? <span className="text-gray-600">—</span> : changeContent}
                  </td>
                  <td className="p-3 font-mono font-black text-center text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
                    +{result.pointsGained}
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