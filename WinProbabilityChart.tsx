import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import type { LapHistory, WinProbability } from './types';
import { TEAM_COLORS, DRIVER_TEAM_MAP } from './constants';

interface WinProbabilityChartProps {
  history: LapHistory[];
  currentProbabilities: WinProbability[];
}

const WinProbabilityChart: React.FC<WinProbabilityChartProps> = ({ history, currentProbabilities }) => {
  // 1. Identify top 6 drivers to plot (to avoid overcrowding)
  const topDrivers = currentProbabilities.slice(0, 6).map(p => p.driver);

  // 2. Transform history for Recharts
  const chartData = history.map(h => {
    const dataPoint: any = { lap: h.lap };
    h.probabilities.forEach(p => {
      if (topDrivers.includes(p.driver)) {
        dataPoint[p.driver] = p.probability;
      }
    });
    return dataPoint;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 p-4 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md">
          <p className="text-white font-black text-xs mb-2 uppercase tracking-widest">Lap {label}</p>
          <div className="space-y-1">
            {payload.sort((a: any, b: any) => b.value - a.value).map((p: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-gray-300 text-sm font-medium">{p.name.split(' ').pop()}</span>
                <span className="text-white text-sm font-bold ml-auto">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-6 bg-gray-900/30 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white italic tracking-tighter">WIN PROBABILITY FLOW</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Real-time Monte Carlo Simulation Data</p>
        </div>
        <div className="flex gap-4">
           {topDrivers.slice(0, 3).map(driver => (
             <div key={driver} className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TEAM_COLORS[DRIVER_TEAM_MAP[driver] || '']?.hex || '#888' }} />
               <span className="text-[10px] font-bold text-gray-500 uppercase">{driver.split(' ').pop()}</span>
             </div>
           ))}
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {topDrivers.map((driver, i) => {
                const team = DRIVER_TEAM_MAP[driver] || '';
                const color = TEAM_COLORS[team]?.hex || '#888';
                return (
                  <linearGradient key={`grad-${i}`} id={`lineGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="lap" 
              stroke="rgba(255,255,255,0.3)" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700 }}
              label={{ value: 'Race Laps', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700 }}
              domain={[0, 'auto']}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            {topDrivers.map((driver, i) => {
              const team = DRIVER_TEAM_MAP[driver] || '';
              return (
                <Line
                  key={driver}
                  type="monotone"
                  dataKey={driver}
                  stroke={TEAM_COLORS[team]?.hex || '#888'}
                  strokeWidth={4}
                  dot={{ r: 4, strokeWidth: 2, fill: '#000' }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: TEAM_COLORS[team]?.hex }}
                  animationDuration={2000}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WinProbabilityChart;