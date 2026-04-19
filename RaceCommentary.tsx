const RadioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const RaceCommentary: React.FC<RaceCommentaryProps> = ({ logs }) => {
  return (
    <div className="w-full bg-[#0a0a0a]/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col h-[500px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="p-6 border-b border-white/5 bg-gradient-to-r from-red-600/10 to-transparent flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white italic tracking-tighter">ELITE BROADCAST FEED</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
             LIVE SIMULATION DATA
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-red-600 border border-red-600 px-2 py-1 rounded">TV DIRECT</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono scrollbar-thin scrollbar-thumb-white/10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {logs.map((log, i) => {
          const isRadio = log.text.includes('[RADIO]');
          const isStewards = log.text.includes('STEWARDS:');
          
          return (
            <div 
              key={i} 
              className={`flex gap-4 p-4 rounded-xl transition-all duration-300 animate-slide-in-right ${
                log.type === 'event' ? 'bg-red-600/10 border-l-4 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.1)]' :
                log.type === 'warning' ? 'bg-yellow-600/10 border-l-4 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]' :
                log.type === 'strategy' ? 'bg-blue-600/10 border-l-4 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' :
                'bg-white/5 border-l-4 border-gray-600'
              }`}
            >
              <div className="flex flex-col items-center justify-start py-1 w-10 shrink-0">
                 <span className="text-[9px] font-black text-white/30 uppercase tracking-tighter">LAP</span>
                 <span className="text-lg font-black text-white leading-none">{log.lap}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                   {isRadio && <span className="text-blue-400"><RadioIcon /></span>}
                   {log.type === 'warning' && <span className="text-yellow-500"><WarningIcon /></span>}
                   <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      log.type === 'event' ? 'bg-red-600 text-white' :
                      log.type === 'warning' ? 'bg-yellow-600 text-white' :
                      log.type === 'strategy' ? 'bg-blue-600 text-white' :
                      'bg-gray-700 text-gray-300'
                   }`}>
                     {isRadio ? 'RADIO' : isStewards ? 'STEWARDS' : log.type}
                   </span>
                </div>
                <p className={`text-sm leading-relaxed ${
                  log.type === 'event' ? 'text-white font-bold' :
                  log.type === 'warning' ? 'text-yellow-100' :
                  log.type === 'strategy' ? 'text-blue-100' :
                  'text-gray-300'
                }`}>
                  {log.text.replace('[RADIO] ', '').replace('STEWARDS: ', '')}
                </p>
                <div className="mt-2 text-[8px] text-white/20 font-bold uppercase tracking-[0.2em]">
                   Simulated Telemetry Verified
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 bg-black/60 border-t border-white/5 flex items-center justify-between">
        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">
           Race Predictor v2.6.4
        </p>
        <p className="text-[9px] text-red-600 font-black uppercase tracking-[0.2em] animate-pulse">
           Signal Stable
        </p>
      </div>
    </div>
  );
};

export default RaceCommentary;
