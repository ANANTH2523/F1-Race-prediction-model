import React from 'react';
import { CommentaryEntry } from './types';

interface RaceCommentaryProps {
  logs: CommentaryEntry[];
}

const RaceCommentary: React.FC<RaceCommentaryProps> = ({ logs }) => {
  return (
    <div className="w-full bg-gray-900/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[500px] shadow-2xl">
      <div className="p-6 border-bottom border-white/5 bg-gradient-to-r from-red-600/10 to-transparent">
        <h2 className="text-xl font-black text-white italic tracking-tighter">SIMULATION NARRATIVE</h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Live Feed from Predictor Core</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono scrollbar-thin scrollbar-thumb-white/10">
        {logs.map((log, i) => (
          <div 
            key={i} 
            className={`flex gap-4 p-3 rounded-xl transition-all duration-300 animate-slide-in-right ${
              log.type === 'event' ? 'bg-red-600/10 border-l-4 border-red-600' :
              log.type === 'warning' ? 'bg-yellow-600/10 border-l-4 border-yellow-500' :
              log.type === 'strategy' ? 'bg-blue-600/10 border-l-4 border-blue-500' :
              'bg-white/5 opacity-80'
            }`}
          >
            <div className="flex flex-col items-center justify-start py-1">
               <span className="text-[10px] font-black text-white/40">LAP</span>
               <span className="text-sm font-black text-white">{log.lap}</span>
            </div>
            
            <div className="flex-1">
              <p className={`text-sm ${
                log.type === 'event' ? 'text-white font-bold' :
                log.type === 'warning' ? 'text-yellow-200' :
                log.type === 'strategy' ? 'text-blue-200' :
                'text-gray-300'
              }`}>
                {log.text}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                   log.type === 'event' ? 'bg-red-600 text-white' :
                   log.type === 'warning' ? 'bg-yellow-600 text-black' :
                   log.type === 'strategy' ? 'bg-blue-600 text-white' :
                   'bg-gray-700 text-gray-300'
                }`}>
                  {log.type}
                </span>
                <span className="text-[8px] text-white/20 font-bold uppercase tracking-tighter">Verified @ 1000hz</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-black/40 border-t border-white/5 text-center">
        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] animate-pulse">
           End of Simulation Sequence
        </p>
      </div>
    </div>
  );
};

export default RaceCommentary;
