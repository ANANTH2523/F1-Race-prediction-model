import React, { useState, useEffect } from 'react';

const loadingTexts = [
  "ANALYZING TELEMETRY...",
  "CALCULATING TYRE DEGRADATION...",
  "SIMULATING QUALIFYING...",
  "RUNNING RACE STRATEGIES...",
  "PREPARING THE GRID...",
];

const Loader: React.FC = () => {
  const [text, setText] = useState(loadingTexts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setText(prev => {
        const currentIndex = loadingTexts.indexOf(prev);
        return loadingTexts[(currentIndex + 1) % loadingTexts.length];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 text-center overflow-hidden py-10">
      <style>{`
        .scanner-container {
          position: relative;
          width: 300px;
          height: 140px;
        }
        .car-svg {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
        }
        .car-path {
          stroke: #E10600;
          stroke-width: 1.5;
          fill: none;
          filter: drop-shadow(0 0 8px rgba(225, 6, 0, 0.8));
          clip-path: inset(0 0 100% 0);
          animation: reveal-car 3s infinite cubic-bezier(0.76, 0, 0.24, 1);
        }
        .scanner-line {
          position: absolute;
          width: 100%;
          height: 3px;
          background: #E10600;
          box-shadow: 0 0 15px 5px rgba(225, 6, 0, 0.7);
          border-radius: 3px;
          animation: scan 3s infinite cubic-bezier(0.76, 0, 0.24, 1);
        }

        @keyframes scan {
          0% {
            top: -5%;
            opacity: 0.2;
          }
          20% {
             opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            top: 105%;
            opacity: 0.2;
          }
        }

        @keyframes reveal-car {
          0%, 10% {
            clip-path: inset(0 0 100% 0);
          }
          90%, 100% {
            clip-path: inset(0 0 0% 0);
          }
        }
      `}</style>
      <div className="scanner-container">
        <svg className="car-svg" viewBox="0 0 200 93" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="car-path" d="M198.5 42.5C189.9 42.5 183.5 40.5 183.5 37V31M1.5 42.5C10.1 42.5 16.5 40.5 16.5 37V31M16.5 31L26 23.5L41.5 22L51.5 18L72.5 17L82.5 12L116.5 11.5L130 16.5L148.5 17.5L159 22.5L174 23.5L183.5 31M16.5 31V62M183.5 31V62M16.5 62C16.5 58.5 10.1 50.5 1.5 50.5M183.5 62C183.5 58.5 189.9 50.5 198.5 50.5M16.5 62L26 70L41.5 71.5L51.5 75.5L72.5 76.5L82.5 81.5L116.5 82L130 77L148.5 76L159 71L174 70L183.5 62M87 12L90.5 2L108.5 1.5L112 12M89.5 81.5L92 91.5L107 92L110 81.5M41.5 22L45 32H155L159 22.5M41.5 71.5L45 61.5H155L159 71M72.5 17L76.5 32H123.5L130 16.5M72.5 76.5L76.5 61.5H123.5L130 77M82.5 32H116.5M82.5 61.5H116.5M82.5 32V61.5M116.5 32V61.5M26 23.5V70M174 23.5V70" />
        </svg>
        <div className="scanner-line"></div>
      </div>
      <p className="text-xl font-bold uppercase tracking-widest text-white transition-all duration-500">{text}</p>
    </div>
  );
};

export default Loader;
