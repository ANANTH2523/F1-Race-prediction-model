import React, { useEffect, useState } from 'react';
import type { LiveCalendarRace } from './f1DataService';

interface NextRaceCountdownProps {
  nextRace: LiveCalendarRace | null;
}

function pad(n: number) { return String(n).padStart(2, '0'); }

const NextRaceCountdown: React.FC<NextRaceCountdownProps> = ({ nextRace }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isRaceWeekend, setIsRaceWeekend] = useState(false);

  useEffect(() => {
    if (!nextRace) return;
    const target = new Date(nextRace.startDate + 'T14:00:00'); // assume 14:00 local
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setIsRaceWeekend(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setIsRaceWeekend(false);
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextRace]);

  if (!nextRace) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-5 bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-red-900/50 shadow-lg animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: race info */}
        <div className="text-center md:text-left flex-1">
          <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1">
            {isRaceWeekend ? '🏁 RACE WEEKEND — LIVE!' : '⏱ Next Race'}
          </p>
          <h3 className="text-white text-2xl font-black">{nextRace.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{nextRace.circuit}</p>
          <p className="text-gray-500 text-xs mt-1">
            {nextRace.date}
            {nextRace.hasSprint && (
              <span className="ml-2 bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-xs font-bold">
                SPRINT
              </span>
            )}
          </p>
        </div>

        {/* Right: countdown */}
        <div className="flex items-center gap-3 md:gap-4">
          {isRaceWeekend ? (
            <div className="text-center">
              <span className="text-3xl font-black text-red-500 animate-pulse">IT'S RACE TIME!</span>
            </div>
          ) : (
            [
              { label: 'DAYS',    value: timeLeft.days    },
              { label: 'HRS',     value: timeLeft.hours   },
              { label: 'MIN',     value: timeLeft.minutes  },
              { label: 'SEC',     value: timeLeft.seconds  },
            ].map(({ label, value }, i, arr) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                    <span className="text-white text-2xl md:text-3xl font-black tabular-nums">
                      {pad(value)}
                    </span>
                  </div>
                  <span className="text-gray-500 text-xs mt-1 font-semibold">{label}</span>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-red-500 text-2xl font-bold mb-4 select-none">:</span>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NextRaceCountdown;
