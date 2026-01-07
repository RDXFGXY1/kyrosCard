import React from 'react';
import { soundManager } from '../utils/SoundManager';

interface TacticalNodeButtonProps {
  label: string;
  subtext?: string;
  icon?: string;
  index?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const TacticalNodeButton: React.FC<TacticalNodeButtonProps> = ({ 
  label, 
  subtext = "AUTH_LEVEL_0", 
  icon, 
  index = "01",
  isActive = false,
  onClick 
}) => {
  const handleClick = () => {
    soundManager.playClick();
    if (onClick) onClick();
  };

  const handleMouseEnter = () => {
    soundManager.playHover();
  };

  return (
    <div className="relative w-full">
      <button 
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={`
          relative w-full h-12 flex items-center transition-all duration-200 group
          ${isActive ? 'bg-white' : 'bg-transparent hover:bg-white/5'}
          border-b border-white/5
        `}
      >
        {/* Active Selection Indicator */}
        <div className={`
          absolute left-0 top-0 bottom-0 w-1 transition-all duration-300
          ${isActive ? 'bg-red-600' : 'bg-transparent group-hover:bg-red-600/50'}
        `}></div>

        <div className="flex items-center w-full px-4 gap-4">
          {/* Index Number */}
          <span className={`
            mono text-[10px] font-black w-6 transition-colors
            ${isActive ? 'text-black/40' : 'text-white/20'}
          `}>
            {index}
          </span>

          {/* Icon */}
          <div className={`
            flex items-center justify-center transition-colors
            ${isActive ? 'text-red-600' : 'text-white/40 group-hover:text-white'}
          `}>
            <i className={`fa-solid ${icon} text-sm`}></i>
          </div>

          {/* Label */}
          <div className="flex flex-col flex-1 text-left">
            <span className={`
              stencil text-xs font-black tracking-widest uppercase transition-colors
              ${isActive ? 'text-black' : 'text-white group-hover:text-white'}
            `}>
              {label}
            </span>
          </div>

          {/* Status Dot */}
          {isActive && (
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Diagonal Cut Effect (CoD style corner) */}
        <div className={`
          absolute right-0 top-0 w-4 h-full 
          ${isActive ? 'bg-white' : 'bg-transparent'}
        `} style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
      </button>
    </div>
  );
};

export default TacticalNodeButton;