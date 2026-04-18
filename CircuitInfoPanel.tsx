import React from 'react';
import type { CircuitData } from './constants';

interface CircuitInfoPanelProps {
  circuit: CircuitData | null;
}

const DegBadge: React.FC<{ level: CircuitData['tyreDegradation'] }> = ({ level }) => {
  const colors: Record<string, string> = {
    'Low':       'bg-green-500/20 text-green-400 border-green-500/40',
    'Medium':    'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    'High':      'bg-orange-500/20 text-orange-400 border-orange-500/40',
    'Very High': 'bg-red-500/20 text-red-400 border-red-500/40',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${colors[level] ?? colors['Medium']}`}>
      {level}
    </span>
  );
};

const WeatherBadge: React.FC<{ risk: CircuitData['weatherRisk'] }> = ({ risk }) => {
  const colors: Record<string, string> = {
    'Low':    'bg-green-500/20 text-green-400',
    'Medium': 'bg-yellow-500/20 text-yellow-400',
    'High':   'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colors[risk]}`}>
      {risk} Risk
    </span>
  );
};

const OvertakingBar: React.FC<{ index: number }> = ({ index }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 bg-gray-700 rounded-full h-2">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-red-600 to-orange-400 transition-all duration-700"
        style={{ width: `${index * 10}%` }}
      />
    </div>
    <span className="text-white font-bold text-sm w-6 text-right">{index}</span>
  </div>
);

const typeColors: Record<string, string> = {
  'Street':     'text-yellow-400',
  'High-Speed': 'text-red-400',
  'Technical':  'text-blue-400',
  'Balanced':   'text-green-400',
};

const CircuitInfoPanel: React.FC<CircuitInfoPanelProps> = ({ circuit }) => {
  if (!circuit) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-5 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-lg animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white text-xl font-black">{circuit.officialName}</h3>
          <p className="text-gray-400 text-sm">{circuit.location}</p>
        </div>
        <span className={`text-sm font-bold ${typeColors[circuit.circuitType] ?? 'text-gray-400'}`}>
          {circuit.circuitType}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Lap Length',  value: `${circuit.lapLength} km`   },
          { label: 'Race Laps',   value: circuit.laps                },
          { label: 'Top Speed',   value: `${circuit.topSpeed} km/h`  },
          { label: 'DRS Zones',   value: circuit.drsZones            },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-900/60 rounded-xl p-3 text-center">
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            <p className="text-white font-black text-lg">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900/60 rounded-xl p-4 mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Current Lap Record</p>
        <p className="text-white">
          <span className="font-black text-2xl text-red-500">{circuit.lapRecord}</span>
          <span className="text-gray-400 text-sm ml-3">
            {circuit.lapRecordHolder} · {circuit.lapRecordYear}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/60 rounded-xl p-3">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Tyre Degradation</p>
          <DegBadge level={circuit.tyreDegradation} />
        </div>
        <div className="bg-gray-900/60 rounded-xl p-3">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Weather Risk</p>
          <WeatherBadge risk={circuit.weatherRisk} />
        </div>
        <div className="bg-gray-900/60 rounded-xl p-3">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Overtaking Index</p>
          <OvertakingBar index={circuit.overtakingIndex} />
        </div>
      </div>
    </div>
  );
};

export default CircuitInfoPanel;
