import React from 'react';

const CIRCUIT_PATHS: Record<string, string> = {
  'Monaco': "M 50,50 L 150,40 L 180,80 L 140,120 L 160,160 L 100,180 L 40,150 L 20,100 Z",
  'Spa': "M 20,20 L 180,40 L 160,180 L 80,180 L 20,100 Z",
  'Silverstone': "M 30,30 C 80,10 120,10 170,30 C 190,50 190,120 170,140 C 130,170 70,170 30,140 C 10,120 10,50 30,30",
  'Austin': "M 20,100 L 60,20 L 100,100 L 180,100 L 180,180 L 60,180 Z"
};

const DEFAULT_PATH = "M 50,20 A 80,40 0 1,1 50,180 A 80,40 0 1,1 50,20";

interface CircuitMapProps {
  raceName: string;
  isSafetyCar?: boolean;
}

const CircuitMap: React.FC<CircuitMapProps> = ({ raceName, isSafetyCar }) => {
  const path = Object.keys(CIRCUIT_PATHS).find(k => raceName.includes(k)) 
    ? CIRCUIT_PATHS[Object.keys(CIRCUIT_PATHS).find(k => raceName.includes(k))!]
    : DEFAULT_PATH;

  return (
    <div className="relative w-48 h-48 bg-black/40 rounded-full border border-white/5 shadow-inner p-4">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* The Track */}
        <path
          id="circuit-path"
          d={path}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="12"
          strokeLinejoin="round"
        />
        <path
          d={path}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* The Drivers (Top 10 Blips) */}
        {[...Array(10)].map((_, i) => (
          <circle
            key={i}
            r="3"
            fill={i === 0 ? "#E10600" : i < 3 ? "#fff" : "#666"}
            className="shadow-lg"
          >
            <animateMotion
              dur={`${isSafetyCar ? 8 : 4 + i * 0.1}s`}
              repeatCount="indefinite"
              path={path}
              rotate="auto"
            />
          </circle>
        ))}
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none">
        <span className="text-[8px] font-black text-white tracking-[0.5em] uppercase">Telemetry</span>
        <span className="text-[6px] font-bold text-gray-500 uppercase">Track Map Node 04</span>
      </div>
    </div>
  );
};

export default CircuitMap;
