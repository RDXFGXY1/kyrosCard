import React, { useState, useEffect } from 'react';
import { HUDView } from '../types';
import { soundManager } from '../utils/SoundManager';

interface SideHUDProps {
  activeView: HUDView;
  onClose: () => void;
}

const SideHUD: React.FC<SideHUDProps> = ({ activeView, onClose }) => {
  return (
    <div className="h-full w-full flex flex-col relative animate-in fade-in duration-300">
      
      {/* Header with Sharp Red Accents */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="mono text-[8px] text-red-600 font-black tracking-widest uppercase mb-1">
             SYS_MODULE // {activeView}
          </span>
          <span className="stencil text-3xl text-white tracking-tighter font-black uppercase">{activeView?.replace('_', ' ')}</span>
        </div>
        
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center border border-white/10 hover:bg-red-600 hover:border-red-600 transition-all group"
        >
          <i className="fa-solid fa-xmark text-lg group-hover:scale-110 transition-transform"></i>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scroll pr-4">
        {activeView === 'links' && <NeuralLinkView />}
        {activeView === 'console' && <ConsoleView />}
        {activeView === 'diagnostics' && <NeuralDiagnosticsView />}
        {activeView === 'donation' && <DonationLinkView />}
      </div>
    </div>
  );
};

const NeuralLinkView = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {['DISCORD', 'GITHUB', 'TERMINAL', 'RECON'].map((name, i) => (
      <div key={i} className="bg-white/[0.03] border border-white/5 p-4 group hover:border-red-600 transition-colors cursor-pointer">
        <span className="mono text-[8px] text-white/30 uppercase font-black block mb-2">ACCESS_POINT</span>
        <div className="flex justify-between items-center">
          <span className="stencil text-sm text-white font-black">{name}</span>
          <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></i>
        </div>
      </div>
    ))}
  </div>
);

const ConsoleView = () => {
  const [lines, setLines] = useState(['>> INITIALIZING ROOT...', '>> CONNECTION ESTABLISHED', '>> WAITING FOR INPUT...']);
  return (
    <div className="bg-black/60 border border-white/5 p-6 h-full flex flex-col font-mono text-[11px] text-white/40">
       <div className="flex-1 space-y-2">
          {lines.map((l, i) => <div key={i} className={l.startsWith('>') ? 'text-red-600' : ''}>{l}</div>)}
          <div className="w-1.5 h-3 bg-red-600 animate-pulse inline-block"></div>
       </div>
    </div>
  );
};

const NeuralDiagnosticsView = () => (
  <div className="space-y-6">
    {[
      { label: 'Neural_Load', val: '42%' },
      { label: 'Sync_Rate', val: '99%' },
      { label: 'Bio_Status', val: 'NOMINAL' }
    ].map((d, i) => (
      <div key={i} className="space-y-2">
         <div className="flex justify-between mono text-[9px] text-white/30 uppercase font-black">
           <span>{d.label}</span>
           <span className="text-red-600">{d.val}</span>
         </div>
         <div className="h-1 w-full bg-white/5"><div className="h-full bg-red-600 w-1/2 shadow-[0_0_10px_#ff0000]"></div></div>
      </div>
    ))}
  </div>
);

const DonationLinkView = () => (
  <div className="grid grid-cols-1 gap-4">
    <div className="bg-red-600/5 border border-red-600/20 p-6 flex items-center justify-between">
       <div className="flex flex-col">
         <span className="stencil text-xl text-white font-black">SUPPLY_LINE</span>
         <span className="mono text-[8px] text-white/40 uppercase">Support hardware upgrades</span>
       </div>
       <button className="bg-red-600 px-6 py-2 stencil text-xs text-black font-black hover:bg-white transition-all">INITIALIZE</button>
    </div>
  </div>
);

export default SideHUD;