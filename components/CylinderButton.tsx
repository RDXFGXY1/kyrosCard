import React from 'react';
import { soundManager } from '../utils/SoundManager';

interface CylinderButtonProps {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
  index: string;
  rotationY: number; 
}

const CylinderButton: React.FC<CylinderButtonProps> = ({ label, icon, isActive, onClick, index }) => {
  return (
    <button
      onClick={() => {
        soundManager.playClick();
        onClick();
      }}
      onMouseEnter={() => soundManager.playHover()}
      className={`
        relative group flex items-center justify-center md:justify-start
        w-full h-12 md:h-16
        border border-transparent transition-all duration-200 overflow-hidden
        ${isActive 
          ? 'bg-red-600/10 border-red-600' 
          : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/20'}
      `}
    >
      {/* Background Effect */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent transition-transform duration-300 origin-left
        ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
      `}></div>

      {/* Selection Marker (Left side on desktop, Bottom on mobile potentially, but keeping left for consistency) */}
      <div className={`
        absolute left-0 top-0 bottom-0 w-1 transition-all duration-300
        ${isActive ? 'bg-red-600' : 'bg-transparent'}
      `}></div>

      <div className="flex items-center w-full px-2 md:px-4 gap-2 md:gap-3 relative z-10 justify-center md:justify-start">
        {/* Index */}
        <span className={`
          hidden md:block mono text-[9px] font-black transition-colors
          ${isActive ? 'text-red-500' : 'text-white/20'}
        `}>
          {index}
        </span>

        {/* Icon */}
        <div className={`
          flex items-center justify-center w-6
          ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'}
        `}>
          <i className={`fa-solid ${icon} text-sm md:text-base`}></i>
        </div>

        {/* Label - Hidden on very small screens if needed, but visible on standard mobile in grid */}
        <span className={`
          hidden sm:block stencil text-[10px] md:text-[11px] uppercase tracking-widest transition-colors
          ${isActive ? 'text-white font-bold' : 'text-white/40 group-hover:text-white'}
        `}>
          {label.replace('_', ' ')}
        </span>
      </div>

      {/* Active Indicator Triangle */}
      {isActive && (
         <div className="absolute right-2 w-1.5 h-1.5 bg-red-600 rotate-45 hidden md:block"></div>
      )}
    </button>
  );
};

export default CylinderButton;