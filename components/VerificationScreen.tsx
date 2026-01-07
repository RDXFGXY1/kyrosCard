
import React, { useState, useEffect, useCallback } from 'react';
import { soundManager } from '../utils/SoundManager';

interface VerificationScreenProps {
  onVerified: () => void;
}

type VerificationStep = 'boot' | 'sync' | 'scanning' | 'biometric' | 'granted';

const VerificationScreen: React.FC<VerificationScreenProps> = ({ onVerified }) => {
  const [step, setStep] = useState<VerificationStep>('boot');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [syncCount, setSyncCount] = useState(0);
  const [syncTargets, setSyncTargets] = useState<{id: number, x: number, y: number}[]>([]);

  // Phase 1: Rapid Boot Sequence
  useEffect(() => {
    if (step === 'boot') {
      const messages = [
        '>> INITIALIZING_SECURE_KERNEL...',
        '>> LOADING_ENCRYPTION_MODULES...',
        '>> [ERR] SYNC_MISMATCH_DETECTED',
        '>> RE-ROUTING_TO_MANUAL_SYNCHRONIZER...',
        '>> WAITING_FOR_USER_INPUT...'
      ];
      let i = 0;
      const timer = setInterval(() => {
        if (i < messages.length) {
          setLogs(prev => [...prev.slice(-8), messages[i]]);
          soundManager.playBootTick();
          i++;
        } else {
          clearInterval(timer);
          setTimeout(() => setStep('sync'), 800);
        }
      }, 200);
      return () => clearInterval(timer);
    }
  }, [step]);

  // Phase 2: Manual Link Synchronizer (Interaction Needed)
  useEffect(() => {
    if (step === 'sync' && syncTargets.length < 3) {
      const generateTarget = () => ({
        id: Date.now(),
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 60
      });
      setSyncTargets([generateTarget()]);
    }
  }, [step, syncCount]);

  const handleSyncClick = (id: number) => {
    soundManager.playSyncClick();
    setSyncCount(prev => prev + 1);
    setSyncTargets([]);
    if (syncCount >= 2) {
      setStep('scanning');
    }
  };

  // Phase 3: High-Intensity Scanning
  useEffect(() => {
    if (step === 'scanning') {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setStep('biometric'), 1000);
            return 100;
          }
          soundManager.playScan(prev);
          return prev + 4;
        });
      }, 40);
      return () => clearInterval(timer);
    }
  }, [step]);

  // Phase 4: Biometric Pulse
  useEffect(() => {
    let holdTimer: any;
    if (isHolding && step === 'biometric') {
      holdTimer = setInterval(() => {
        setProgress(prev => {
          const currentProgress = prev - 100;
          if (prev >= 200) {
            clearInterval(holdTimer);
            soundManager.playSuccess();
            setStep('granted');
            setTimeout(onVerified, 2000);
            return 200;
          }
          soundManager.playBiometricCharge(currentProgress);
          return prev + 4;
        });
      }, 30);
    } else if (!isHolding && step === 'biometric') {
      setProgress(100);
    }
    return () => clearInterval(holdTimer);
  }, [isHolding, step, onVerified]);

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center bg-black transition-colors duration-1000 ${isHolding ? 'bg-red-950/20' : 'bg-black/95'} backdrop-blur-3xl`}>
      <div className={`w-[600px] flex flex-col items-center gap-8 transition-transform duration-500 ${isHolding ? 'scale-110' : 'scale-100'}`}>
        
        {/* Terminal Header */}
        <div className="w-full flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 bg-red-600 rounded-full ${isHolding ? 'animate-ping' : 'animate-pulse'} shadow-[0_0_15px_rgba(239,68,68,1)]`}></div>
            <span className="mono text-[10px] text-white/50 tracking-[0.4em] uppercase font-black">Kyros_Security_Terminal_v4.2</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="mono text-[10px] text-red-500 font-bold uppercase tracking-widest italic animate-pulse">
               {step.toUpperCase()} PROTOCOL
             </span>
             <span className="mono text-[8px] text-white/20 uppercase font-bold">NODE: KY-09-ALPHA</span>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className={`relative w-full h-[400px] bg-neutral-900/40 border-x border-white/5 overflow-hidden flex flex-col justify-center items-center shadow-2xl transition-all duration-300 ${isHolding ? 'border-red-600/50 shake-intense' : 'border-white/5'}`}>
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-red-600/40"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-red-600/40"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-red-600/40"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-red-600/40"></div>

          {step === 'boot' && (
            <div className="w-full h-full p-12 flex flex-col justify-end gap-3 overflow-hidden">
              {logs.map((log, i) => (
                <div key={i} className="mono text-[12px] text-white uppercase tracking-wider italic animate-in flex items-center gap-3">
                  <span className="text-red-600 text-[10px] font-black">{'>'}</span>
                  {log}
                </div>
              ))}
              <div className="w-3 h-5 bg-red-600 animate-pulse mt-2"></div>
            </div>
          )}

          {step === 'sync' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-8 p-12 animate-in">
              <div className="text-center space-y-2">
                <span className="stencil text-2xl text-white tracking-[0.3em] uppercase">Link_Synchronizer</span>
                <p className="mono text-[10px] text-white/40 uppercase tracking-widest italic">Manual Synchronization Required to Stabilize Neural Link</p>
              </div>
              <div className="relative w-full h-48 border border-white/10 bg-black/40 overflow-hidden">
                 {/* Crosshair Background */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <div className="w-px h-full bg-red-600"></div>
                    <div className="h-px w-full bg-red-600"></div>
                 </div>
                 {syncTargets.map(target => (
                   <button 
                     key={target.id}
                     onClick={() => handleSyncClick(target.id)}
                     style={{ left: `${target.x}%`, top: `${target.y}%` }}
                     className="absolute w-12 h-12 flex items-center justify-center group"
                   >
                     <div className="absolute inset-0 border border-red-600 animate-spin-slow group-hover:bg-red-600/20 transition-all"></div>
                     <div className="w-2 h-2 bg-red-600 shadow-[0_0_10px_rgba(239,68,68,1)]"></div>
                   </button>
                 ))}
              </div>
              <div className="flex gap-2">
                 {[...Array(3)].map((_, i) => (
                   <div key={i} className={`w-10 h-1 border border-white/10 transition-colors ${syncCount > i ? 'bg-red-600' : ''}`}></div>
                 ))}
              </div>
            </div>
          )}

          {step === 'scanning' && (
            <div className="relative flex flex-col items-center gap-10 w-full animate-in">
              <div className="relative w-64 h-64 flex items-center justify-center">
                 {/* Reticle UI */}
                 <div className="absolute inset-0 border border-red-600/10 rounded-full scale-110"></div>
                 <div className="absolute inset-0 border-2 border-dashed border-red-600/30 rounded-full animate-spin-slow"></div>
                 <div className="absolute inset-4 border border-red-600/20 rounded-full"></div>
                 
                 <i className="fa-solid fa-microchip text-7xl text-white/10"></i>
                 
                 {/* Scanning Bar */}
                 <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-1 bg-red-600 shadow-[0_0_30px_rgba(239,68,68,1)] animate-[scanline_2s_linear_infinite]"></div>
                 </div>

                 {/* Coordinate Readouts */}
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 mono text-[9px] text-red-500 font-bold tracking-widest bg-black/40 px-2 py-1 border border-red-600/20">
                    X: {Math.random().toFixed(4)} | Y: {Math.random().toFixed(4)}
                 </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="stencil text-2xl text-white tracking-[0.5em] uppercase mb-1">Ocular_Mapping</span>
                <div className="flex items-center gap-4">
                   <div className="w-48 h-2 bg-white/5 border border-white/10 overflow-hidden">
                      <div className="h-full bg-red-600 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                   </div>
                   <span className="mono text-[12px] text-red-500 font-black">{progress}%</span>
                </div>
              </div>
            </div>
          )}

          {step === 'biometric' && (
            <div className="relative flex flex-col items-center gap-10 w-full animate-in">
              <div 
                onMouseDown={() => { setIsHolding(true); soundManager.playHover(); }}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
                onTouchStart={() => { setIsHolding(true); soundManager.playHover(); }}
                onTouchEnd={() => setIsHolding(false)}
                className={`
                  relative w-40 h-40 cursor-pointer transition-all duration-300
                  ${isHolding ? 'scale-90 brightness-150' : 'scale-100 hover:scale-105'}
                `}
              >
                {/* Fingerprint Pulse */}
                <div className={`absolute -inset-8 border-2 border-red-600/20 rounded-full ${isHolding ? 'animate-ping' : ''}`}></div>
                <div className={`absolute -inset-4 border border-red-600/40 rounded-full ${isHolding ? 'scale-110 opacity-100' : 'scale-90 opacity-0'} transition-all`}></div>
                
                <div className={`
                  absolute inset-0 bg-neutral-900 rounded-sm flex items-center justify-center border transition-all duration-300 overflow-hidden
                  ${isHolding ? 'border-red-600 shadow-[0_0_50px_rgba(239,68,68,0.4)]' : 'border-white/10'}
                `}>
                   <i className={`fa-solid fa-dna text-7xl transition-all duration-500 ${isHolding ? 'text-red-500 rotate-180 scale-125' : 'text-white/20 rotate-0 scale-100'}`}></i>
                   
                   {/* Vertical Fill Progress */}
                   <div 
                     className="absolute bottom-0 left-0 right-0 bg-red-600/30 transition-all duration-100" 
                     style={{ height: `${(progress - 100)}%` }}
                   ></div>
                </div>
              </div>
              <div className="flex flex-col items-center text-center px-12">
                <span className={`stencil text-2xl tracking-[0.4em] uppercase mb-2 transition-colors ${isHolding ? 'text-red-500' : 'text-white'}`}>
                  Biometric_Handshake
                </span>
                <p className="mono text-[11px] text-white/30 uppercase tracking-[0.2em] font-black">
                  {isHolding ? 'ID_VALIDATION_IN_PROGRESS...' : 'PRESS_AND_HOLD_TO_CONFIRM_IDENTITY'}
                </p>
              </div>
            </div>
          )}

          {step === 'granted' && (
            <div className="flex flex-col items-center gap-6 animate-in">
              <div className="w-28 h-28 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_80px_rgba(239,68,68,1)] border-4 border-white animate-[pulse_1s_infinite]">
                <i className="fa-solid fa-lock-open text-5xl text-white"></i>
              </div>
              <div className="text-center space-y-2">
                <span className="stencil text-5xl text-white tracking-[0.2em] uppercase glitch-text">ACCESS_GRANTED</span>
                <div className="mono text-[12px] text-red-500 font-black uppercase tracking-widest animate-pulse">Welcome Back, Kyros</div>
              </div>
            </div>
          )}

          {/* Random background hex digits - Persistent Atmosphere */}
          <div className="absolute inset-0 opacity-[0.02] mono text-[9px] pointer-events-none break-all leading-relaxed p-6 select-none overflow-hidden">
            {Array.from({length: 400}).map(() => (Math.random() * 0xFFFFFF << 0).toString(16).toUpperCase()).join(' ')}
          </div>
        </div>

        {/* Tactical Footer Brackets */}
        <div className="w-full flex justify-between mono text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">
          <div className="flex items-center gap-4">
             <span className="text-red-600">ALPHA_CLEARANCE</span>
             <span className="w-1 h-3 bg-white/10"></span>
             <span>REF_99-XA</span>
          </div>
          <div className="flex items-center gap-4">
             <span>SECURE_CHANNELS: 12</span>
             <span className="text-red-600 font-bold animate-pulse">LIVE</span>
          </div>
        </div>

      </div>
      
      {/* Decorative Full-Screen Frame */}
      <div className="absolute inset-12 border border-white/5 pointer-events-none">
        <div className="absolute -top-1 -left-1 w-12 h-12 border-t-2 border-l-2 border-red-600/40"></div>
        <div className="absolute -top-1 -right-1 w-12 h-12 border-t-2 border-r-2 border-red-600/40"></div>
        <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-2 border-l-2 border-red-600/40"></div>
        <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-2 border-r-2 border-red-600/40"></div>
      </div>
    </div>
  );
};

export default VerificationScreen;
