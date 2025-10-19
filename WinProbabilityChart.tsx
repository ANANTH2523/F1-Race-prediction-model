import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { WinProbability } from '../types';
import { TEAM_COLORS } from '../constants';

interface WinProbabilityChartProps {
  data: WinProbability[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const driverName = label;
      return (
        <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-700">
            <p className="text-white font-bold">{driverName}</p>
            <p className="text-gray-300">{`Win Chance: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

const CustomizedYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const driverName = payload.value;

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={-10} y={0} dy={5} textAnchor="end" fill="#d1d5db" fontSize={14}>
                {driverName.split(' ').pop()}
            </text>
        </g>
    );
};


const WinProbabilityChart: React.FC<WinProbabilityChartProps> = ({ data }) => {
    const top10Data = data.slice(0, 10);
    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg">
             <h2 className="text-2xl font-black text-center text-white mb-6 uppercase tracking-wider">Win Probability (Top 10)</h2>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <BarChart data={top10Data} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                        <XAxis type="number" stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
                        <YAxis 
                            dataKey="driver" 
                            type="category" 
                            width={120} 
                            stroke="#9ca3af"
                            tick={<CustomizedYAxisTick />}
                            interval={0}
                         />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}/>
                        <Bar dataKey="probability" name="Win Probability" barSize={20} animationDuration={1500}>
                            {top10Data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={TEAM_COLORS[entry.team]?.hex || '#8884d8'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WinProbabilityChart;