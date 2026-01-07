import React, { useState, useEffect } from 'react';

const BackgroundEffects: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const logMessages = [
      'FIELD_OPS: SYNC_READY',
      'OPERATOR: KYROS_09',
      'FREQ: 88.4THZ ENCRYPT',
      'NODE_RED: ACTIVE',
      'LINK: SECURE',
      'SIGNAL: OPTIMAL',
      'POSITION: UNKNOWN',
      'SCAN: SCANNING...',
      'LOCK: ENGAGED'
    ];

    const interval = setInterval(() => {
      const newLog = `TAC_RED // ${logMessages[Math.floor(Math.random() * logMessages.length)]}`;
      setLogs(prev => [...prev.slice(-25), newLog]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none bg-[#050607]">
      
      {/* Topographic Map Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/micro-fabrics.png')]"
        style={{ filter: 'invert(1)' }}
      ></div>

      {/* Military Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      
      {/* Scope Reticle Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full border border-white/[0.01]"></div>

      {/* Floating Tactical Data Logs - RED */}
      <div className="absolute left-10 top-20 bottom-20 w-64 overflow-hidden flex flex-col items-start opacity-[0.04] hidden xl:flex">
        <div className="flex flex-col gap-2">
          {logs.map((log, i) => (
            <div key={i} className="mono text-[8px] text-[#ff3131] font-black uppercase whitespace-nowrap italic tracking-widest">
              {log}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-10 top-20 bottom-20 w-64 overflow-hidden flex flex-col items-end opacity-[0.04] hidden xl:flex">
        <div className="flex flex-col gap-2">
          {[...logs].reverse().map((log, i) => (
            <div key={i} className="mono text-[8px] text-white/50 font-black uppercase whitespace-nowrap italic tracking-widest">
              DATA_PKT // 0x{Math.floor(Math.random()*1000).toString(16).toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      {/* Atmospheric Red Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#ff3131]/5 blur-[180px]"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#ff3131]/3 blur-[180px]"></div>

    </div>
  );
};

export default BackgroundEffects;