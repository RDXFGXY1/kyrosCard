import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/SoundManager';

interface OperatorRegistryProps {
  onComplete: (data: { name: string, sig: string }) => void;
  onCancel: () => void;
}

const OperatorRegistry: React.FC<OperatorRegistryProps> = ({ onComplete, onCancel }) => {
  const [name, setName] = useState('');
  const [sig, setSig] = useState('');
  const [role, setRole] = useState('RECON_SPEC');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [randomHex, setRandomHex] = useState('');

  useEffect(() => {
    const hexInterval = setInterval(() => {
      setRandomHex(Math.random().toString(16).slice(2, 10).toUpperCase());
    }, 100);
    return () => clearInterval(hexInterval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sig) return;
    
    setIsSubmitting(true);
    soundManager.playScan(50);
    
    let prog = 0;
    const interval = setInterval(() => {
      prog += 2;
      setSyncProgress(prog);
      if (prog % 20 === 0) soundManager.playBootTick();
      if (prog >= 100) {
        clearInterval(interval);
        onComplete({ name, sig });
      }
    }, 40);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in pointer-events-auto">
      <div className="w-[580px] bg-[#0c0d0e] p-10 relative shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5">
        
        {/* Sharp Corner Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-red-600"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-red-600"></div>
        
        {/* Header - CoD Minimalist Style */}
        <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-8">
          <div className="w-16 h-16 bg-red-600 flex items-center justify-center flex-shrink-0">
             <i className="fa-solid fa-user-secret text-black text-3xl"></i>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="stencil text-4xl text-white tracking-tighter font-black leading-none uppercase">OPERATOR_REG</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="mono text-[9px] text-red-600 font-black uppercase tracking-[0.3em]">SECURE_UPLINK:</span>
              <span className="mono text-[9px] text-white/40 uppercase font-bold">{randomHex}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          {/* Top Row: Call of Duty Form Fields */}
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="mono text-[10px] text-white/30 font-black uppercase tracking-[0.4em]">OPERATIVE_ID</label>
              <input 
                type="text" 
                required
                autoFocus
                value={name}
                onChange={(e) => { setName(e.target.value); soundManager.playHover(); }}
                className="w-full bg-white/5 border-b-2 border-white/10 p-4 mono text-sm text-white focus:outline-none focus:border-red-600 transition-all uppercase placeholder:text-white/5 font-bold"
                placeholder="ID_ENTRY..."
              />
            </div>

            <div className="space-y-3">
              <label className="mono text-[10px] text-white/30 font-black uppercase tracking-[0.4em]">SECTOR_ROLE</label>
              <div className="relative">
                <select 
                  value={role}
                  onChange={(e) => { setRole(e.target.value); soundManager.playBootTick(); }}
                  className="w-full bg-white/5 border-b-2 border-white/10 p-4 mono text-sm text-white focus:outline-none focus:border-red-600 transition-all uppercase appearance-none cursor-pointer font-bold pr-10"
                >
                  <option value="RECON_SPEC">RECON_SPEC</option>
                  <option value="CYBER_ARC">CYBER_ARC</option>
                  <option value="DATA_MINER">DATA_MINER</option>
                  <option value="CORE_SUPP">CORE_SUPP</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                  <i className="fa-solid fa-chevron-down text-[10px]"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Full Width Message */}
          <div className="space-y-3">
            <label className="mono text-[10px] text-white/30 font-black uppercase tracking-[0.4em]">SIGNATURE_PACKET</label>
            <textarea 
              required
              value={sig}
              rows={3}
              onChange={(e) => { setSig(e.target.value); soundManager.playHover(); }}
              className="w-full bg-white/5 border-b-2 border-white/10 p-4 mono text-sm text-white focus:outline-none focus:border-red-600 transition-all uppercase placeholder:text-white/5 resize-none font-bold leading-relaxed"
              placeholder="ENTER_MESSAGE..."
            />
          </div>

          {isSubmitting ? (
            <div className="space-y-4 pt-4">
              <div className="flex justify-between mono text-[10px] font-black uppercase">
                <span className="text-white/20 tracking-[0.5em]">NEURAL_SYNCING...</span>
                <span className="text-red-600">{syncProgress}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 overflow-hidden">
                <div 
                  className="h-full bg-red-600 transition-all duration-100 ease-linear" 
                  style={{ width: `${syncProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="flex gap-6 pt-8">
              <button 
                type="button"
                onClick={() => { soundManager.playClick(); onCancel(); }}
                className="flex-1 bg-transparent border border-white/10 py-6 stencil text-xl text-white/40 hover:text-white hover:bg-white/5 transition-all uppercase tracking-[0.3em] font-black"
              >
                ABORT
              </button>
              <button 
                type="submit"
                className="flex-1 bg-red-600 py-6 stencil text-xl text-black tracking-[0.3em] uppercase font-black hover:bg-white transition-all shadow-xl active:translate-y-1"
              >
                INITIALIZE
              </button>
            </div>
          )}
        </form>
        
        {/* Aesthetic Detail: Barcode in bottom left */}
        <div className="absolute bottom-12 left-10 opacity-5 pointer-events-none flex gap-0.5 h-6">
           {[...Array(20)].map((_, i) => (
             <div key={i} className="w-0.5 bg-white" style={{ height: `${20 + Math.random() * 80}%` }}></div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default OperatorRegistry;