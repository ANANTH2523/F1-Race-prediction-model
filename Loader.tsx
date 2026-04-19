import React, { useState, useEffect } from 'react';
import CircuitMap from './CircuitMap';

interface LoaderProps {
  raceName: string;
}

const Loader: React.FC<LoaderProps> = ({ raceName }) => {
  const [phase, setPhase] = useState<'entry' | 'pitting' | 'exit'>('entry');
  const [status, setStatus] = useState('BOX BOX...');

  useEffect(() => {
    // Timing matching the 4s delay in App.tsx
    const pitTimer = setTimeout(() => {
      setPhase('pitting');
      setStatus('CHANGING TYRES...');
    }, 1000);

    const exitTimer = setTimeout(() => {
      setPhase('exit');
      setStatus('GO GO GO!');
    }, 3000);

    return () => {
      clearTimeout(pitTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full py-12 overflow-hidden bg-black/20 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl">
      <div className="mb-8 flex flex-col items-center gap-4">
         <CircuitMap raceName={raceName} isSafetyCar={phase === 'pitting'} />
         <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
      </div>

      <style>{`
        .track {
          position: relative;
          width: 100%;
          max-width: 600px;
          height: 120px;
          border-bottom: 4px solid #333;
          margin-bottom: 2rem;
          overflow: visible;
        }

        .pit-box {
           position: absolute;
           bottom: 0;
           left: 50%;
           transform: translateX(-50%);
           width: 180px;
           height: 8px;
           background: repeating-linear-gradient(
             45deg,
             #ffeb3b,
             #ffeb3b 10px,
             #000 10px,
             #000 20px
           );
           opacity: 0.5;
        }

        .car-container {
          position: absolute;
          bottom: 12px;
          width: 220px;
          height: 60px;
          transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-origin: bottom center;
        }

        .car-entry {
          transform: translateX(-250%) scale(0.9);
          animation: enter 1s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .car-pitting {
          transform: translateX(-50%) scale(1);
          animation: pit-lift 0.6s ease-out forwards;
        }

        @keyframes pit-lift {
          0% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
          100% { transform: translateX(-50%) translateY(-6px); }
        }

        .car-exit {
          transform: translateX(450%) scale(1.1);
          animation: exit 1s forwards cubic-bezier(0.55, 0.085, 0.68, 0.53);
        }

        @keyframes enter {
          0% { transform: translateX(-250%) scale(0.9) rotate(0deg); }
          70% { transform: translateX(-60%) scale(1) rotate(2deg); }
          100% { transform: translateX(-50%) scale(1) rotate(0deg); }
        }

        @keyframes exit {
          0% { transform: translateX(-50%) translateY(-6px) rotate(0deg); }
          10% { transform: translateX(-48%) translateY(0) rotate(-2deg); }
          40% { transform: translateX(-20%) translateY(2px) rotate(-4deg); }
          100% { transform: translateX(450%) scale(1.1) rotate(0deg); filter: blur(2px); }
        }

        .wheel-rear {
          animation: spin 0.4s linear infinite;
        }
        .wheel-front {
          animation: spin 0.35s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .car-part {
          fill: #E10600;
          stroke: #900;
          stroke-width: 0.5;
        }

        .car-carbon {
          fill: #1a1a1a;
        }

        .car-accent {
          fill: #fff;
          opacity: 0.3;
        }

        .text-glow {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(225, 6, 0, 0.3);
        }
      `}</style>

      <div className="track">
        <div className="pit-box"></div>
        
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${phase === 'pitting' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute" style={{ left: '32%', bottom: '20px' }}>
            <svg width="40" height="60" viewBox="0 0 40 60">
              <path d="M10 60 L20 10 L30 60 Z" fill="#222" />
              <circle cx="20" cy="8" r="6" fill="#111" />
              <rect x="5" y="45" width="30" height="4" fill="#333" rx="2" />
            </svg>
          </div>
          <div className="absolute" style={{ left: '62%', bottom: '20px' }}>
            <svg width="40" height="60" viewBox="0 0 40 60">
              <path d="M10 60 L20 10 L30 60 Z" fill="#222" />
              <circle cx="20" cy="8" r="6" fill="#111" />
              <rect x="5" y="45" width="30" height="4" fill="#333" rx="2" />
            </svg>
          </div>
          <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ left: '44%', bottom: '55px' }} />
          <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ left: '54%', bottom: '55px' }} />
          <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ left: '44%', bottom: '5px' }} />
          <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ left: '54%', bottom: '5px' }} />
        </div>

        <div className={`car-container car-${phase}`}>
          <svg viewBox="0 0 220 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 15 L35 15 L35 45 L5 45 Z" className="car-carbon" />
            <path d="M8 20 L32 20 L32 24 L8 24 Z" className="car-part" />
            <path d="M40 50 L180 50 L185 55 L35 55 Z" className="car-carbon" />
            <path d="M35 45 C50 45, 60 30, 90 28 C120 26, 150 35, 185 45 L190 50 L40 50 Z" className="car-part" />
            <path d="M90 32 L130 32 L130 45 L90 45 Z" fill="#400" />
            <path d="M60 28 L95 18 L110 25 L110 28 Z" className="car-part" />
            <path d="M70 18 L105 18 L105 20 L70 20 Z" className="car-carbon" />
            <path d="M185 45 L215 52 L215 55 L180 50 Z" className="car-part" />
            <path d="M135 32 C135 25, 165 25, 165 32 L160 35 C160 30, 140 30, 140 35 Z" className="car-carbon" />
            <path d="M195 52 L220 52 L220 58 L195 58 Z" className="car-carbon" />
            <path d="M200 53 L218 53 L218 55 L200 55 Z" className="car-part" />
            <path d="M95 30 L140 30 L135 35 L100 35 Z" className="car-accent" />
            <g transform="translate(55, 48)">
              <circle cx="0" cy="0" r="12" fill="#111" />
              <g className={phase !== 'pitting' ? 'wheel-rear' : ''}>
                <circle cx="0" cy="0" r="4" fill="#333" />
                <path d="M-6 0 L6 0 M0 -6 L0 6" stroke="#444" strokeWidth="2" />
              </g>
            </g>
            <g transform="translate(170, 48)">
              <circle cx="0" cy="0" r="12" fill="#111" />
              <g className={phase !== 'pitting' ? 'wheel-front' : ''}>
                <circle cx="0" cy="0" r="4" fill="#333" />
                <path d="M-6 0 L6 0 M0 -6 L0 6" stroke="#444" strokeWidth="2" />
              </g>
            </g>
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 w-full px-6">
        <div className="flex flex-col items-center -space-y-1">
          <h3 className="text-3xl font-black text-white italic tracking-tighter text-glow">
            {status}
          </h3>
          <p className="text-red-500 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
             Simulating Race Intelligence
          </p>
        </div>

        <div className="w-full max-w-2xl bg-black/40 border-y border-white/10 overflow-hidden relative group/ticker mt-4">
           <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
           <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />
           <div className="flex items-center gap-8 py-2 animate-ticker whitespace-nowrap">
              <span className="flex items-center gap-2 text-[10px] font-black text-yellow-500 italic">
                 <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                 RACE CONTROL:
              </span>
              <span className="text-[10px] font-bold text-gray-400">TRACK TEMP: 42.5°C</span>
              <span className="text-[10px] font-bold text-gray-400">WIND: 14KM/H SW</span>
              <span className="text-[10px] font-bold text-gray-400">CALCULATING OVERCUT PROBABILITIES...</span>
              <span className="text-[10px] font-black text-purple-500">SECTOR 1 ANALYSIS: COMPLETE</span>
              <span className="text-[10px] font-bold text-gray-400">DRS ENABLED</span>
              <span className="text-[10px] font-bold text-gray-400">MCLAREN STRATEGY A7 ACTIVE</span>
              <span className="text-[10px] font-bold text-gray-400">EVOLVING TRACK GRIP: +2.1%</span>
              <span className="text-[10px] font-black text-yellow-500 italic">
                 <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                 RACE CONTROL:
              </span>
              <span className="text-[10px] font-bold text-gray-400">VERSTAPPEN VS NORRIS DELTA: -0.8s</span>
           </div>

           <style>{`
              @keyframes ticker {
                 0% { transform: translateX(0); }
                 100% { transform: translateX(-50%); }
              }
              .animate-ticker {
                 display: flex;
                 width: fit-content;
                 animation: ticker 30s linear infinite;
              }
           `}</style>
        </div>
      </div>
    </div>
  );
};

export default Loader;
