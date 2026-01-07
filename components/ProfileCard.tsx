import React, { useState } from 'react';
import CylinderButton from './CylinderButton';
import SideHUD from './SideHUD';
import WaveformVisual from './WaveformVisual';
import { soundManager } from '../utils/SoundManager';
import OperatorRegistry from './OperatorRegistry';
import { HUDView } from '../types';

interface ProfileCardProps {
  activeView: HUDView;
  onToggleView: (view: HUDView) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ activeView, onToggleView }) => {
  const [showRegistry, setShowRegistry] = useState(false);
  const [isDonationAuthorized, setIsDonationAuthorized] = useState(false);

  const handleToggle = (view: HUDView) => {
    if (view === 'donation' && !isDonationAuthorized) {
      soundManager.playTransition();
      setShowRegistry(true);
      return;
    }
    soundManager.playTransition();
    onToggleView(view);
  };

  const menuItems = [
    { view: 'links' as HUDView, icon: 'fa-satellite-dish', label: 'Neural_Link', id: '01' },
    { view: 'console' as HUDView, icon: 'fa-terminal', label: 'Root_Terminal', id: '02' },
    { view: 'diagnostics' as HUDView, icon: 'fa-heart-pulse', label: 'Bio_Metrics', id: '03' },
    { view: 'donation' as HUDView, icon: 'fa-box', label: 'Supply_Drop', id: '04' },
  ];

  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      {showRegistry && (
        <OperatorRegistry 
          onComplete={() => { setIsDonationAuthorized(true); setShowRegistry(false); handleToggle('donation'); }} 
          onCancel={() => setShowRegistry(false)} 
        />
      )}

      {/* MAIN CARD - Strictly Fixed Dimensions on Desktop to prevent resizing */}
      <div className="relative w-full max-w-[900px] h-[550px] flex flex-col md:flex-row bg-[#0a0a0a] border border-white/10 shadow-2xl rounded-sm overflow-hidden z-10 transition-all duration-300">
          
        {/* LEFT COLUMN: IDENTITY */}
        <div className="w-full md:w-[260px] h-auto md:h-full border-b md:border-b-0 md:border-r border-white/5 bg-black/40 p-6 flex flex-col items-center relative flex-shrink-0">
          
          {/* Header */}
          <div className="w-full flex justify-between items-center mb-6 md:mb-10">
            <span className="mono text-[9px] text-red-600 font-black tracking-widest uppercase">KY-09 // OP</span>
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
          </div>

          {/* Avatar Frame */}
          <div className="w-32 h-32 md:w-40 md:h-40 border border-white/10 p-1 mb-6 relative group">
            <img 
              src="https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=80&w=400" 
              alt="Operative" 
              className="w-full h-full object-cover grayscale brightness-75 contrast-125"
            />
            {/* Status Tag */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 px-2 py-0.5">
               <span className="mono text-[8px] text-black font-black uppercase">ROGUE_STATUS</span>
            </div>
          </div>

          {/* Name & Title */}
          <div className="text-center mb-4 md:mb-auto">
            <h2 className="stencil text-3xl text-white font-black tracking-tighter uppercase leading-none mb-1">KYROS</h2>
            <p className="mono text-[9px] text-white/40 tracking-[0.2em] font-bold uppercase">Tactical_Dev</p>
          </div>

          {/* Waveform Footer */}
          <div className="w-full space-y-2 pt-4 border-t border-white/5 hidden md:block">
            <div className="flex justify-between items-end mono text-[7px] text-white/20 uppercase font-black">
              <span>Signal</span>
              <span className="text-red-600">LIVE</span>
            </div>
            <WaveformVisual />
          </div>
        </div>

        {/* MIDDLE: CONTENT - Fixed Flex Basis, Scrollbar Always Visible to prevent jump */}
        <div className="flex-1 h-full relative bg-neutral-900/20 min-w-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
          
          {/* overflow-y-scroll forces scrollbar track to exist, preventing layout width jumps */}
          <div className="h-full p-8 relative z-10 overflow-y-scroll custom-scroll">
              {activeView ? (
                <SideHUD activeView={activeView} onClose={() => handleToggle(null)} />
              ) : (
                <div className="h-full flex flex-col justify-center animate-in fade-in duration-500">
                  <div className="border-l-2 border-red-600 pl-4 mb-8">
                      <h3 className="stencil text-4xl md:text-5xl text-white font-black tracking-tighter mb-2">READY</h3>
                      <p className="mono text-[10px] text-white/40 uppercase tracking-widest max-w-xs">
                        System initialized. Awaiting module selection.
                      </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Uptime', val: '99.9%' },
                        { label: 'Ping', val: '1ms' },
                        { label: 'Sec', val: 'MAX' },
                        { label: 'Net', val: 'GLB' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 p-3 hover:border-red-600/30 transition-colors">
                          <span className="mono text-[8px] text-white/20 uppercase font-black block">{stat.label}</span>
                          <span className="stencil text-lg text-white font-black">{stat.val}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* RIGHT COLUMN: NAVIGATION - Fixed Width on Desktop, Grid on Mobile */}
        <div className="w-full md:w-[200px] h-auto md:h-full bg-black/20 border-t md:border-t-0 md:border-l border-white/5 flex-shrink-0">
           <div className="grid grid-cols-4 md:flex md:flex-col h-full w-full p-1 md:p-4 gap-1 md:gap-3">
              {menuItems.map((item) => (
                <CylinderButton 
                  key={item.id}
                  index={item.id}
                  label={item.label}
                  icon={item.icon}
                  isActive={activeView === item.view}
                  onClick={() => handleToggle(item.view)}
                  rotationY={0}
                />
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileCard;