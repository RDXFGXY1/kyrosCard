
import React from 'react';
import { soundManager } from '../utils/SoundManager';

interface TacticalButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: string;
  style?: React.CSSProperties;
  className?: string;
  subtext?: string;
  onClick?: () => void;
}

const TacticalButton: React.FC<TacticalButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon, 
  style, 
  className,
  subtext = "AUTH_LEVEL_0",
  onClick
}) => {
  const isPrimary = variant === 'primary';

  const handleClick = () => {
    soundManager.playClick();
    if (onClick) onClick();
  };

  const handleMouseEnter = () => {
    soundManager.playHover();
  };
  
  return (
    <button 
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`
        relative group w-full h-16 overflow-hidden transition-all duration-200 transform active:scale-[0.98]
        hover:z-40 text-left border
        ${isPrimary 
          ? 'bg-red-600/10 border-red-600/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
          : 'bg-neutral-900 border-white/5 hover:border-white/20'
        }
        ${className}
      `}
    >
      {/* TACTICAL BACKGROUND OVERLAY */}
      <div className={`
        absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
        ${isPrimary ? 'bg-red-600/5' : 'bg-white/[0.02]'}
      `}></div>

      {/* GLITCH LINE EFFECT ON HOVER */}
      <div className={`
        absolute top-0 left-0 w-full h-[1px] bg-red-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left
      `}></div>
      <div className={`
        absolute bottom-0 left-0 w-full h-[1px] bg-red-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right
      `}></div>

      {/* TACTICAL VERTICAL ACCENT */}
      <div className={`
        absolute left-0 top-0 bottom-0 w-[3px] z-40 transition-all duration-300
        ${isPrimary ? 'bg-red-600 shadow-[2px_0_15px_rgba(239,68,68,0.8)]' : 'bg-white/10 group-hover:bg-red-600 group-hover:shadow-[2px_0_10px_rgba(239,68,68,0.5)]'}
      `}></div>

      {/* CONTENT LAYER */}
      <div className="absolute inset-0 flex items-center px-8 z-30">
        <div className="flex-1 flex flex-col items-start justify-center">
          <div className="flex items-center gap-4">
            {icon && (
              <i className={`fa-solid ${icon} ${isPrimary ? 'text-red-500' : 'text-neutral-500 group-hover:text-red-400'} text-sm transition-all duration-300`}></i>
            )}
            <span className={`
              stencil text-[15px] tracking-[0.2em] uppercase transition-all duration-300
              ${isPrimary ? 'text-white' : 'text-neutral-400 group-hover:text-white group-hover:translate-x-1'}
            `}>
              {children}
            </span>
          </div>
          <span className="mono text-[8px] text-white/20 mt-0.5 uppercase tracking-[0.1em] font-black group-hover:text-red-500/40 transition-colors">
            {subtext}
          </span>
        </div>

        {/* HUD ELEMENTS */}
        <div className="flex items-center gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
           <div className="mono text-[7px] text-white tracking-widest hidden group-hover:block animate-pulse">
             0x{Math.floor(Math.random() * 1000).toString(16).toUpperCase()}
           </div>
           <i className="fa-solid fa-angle-right text-[10px] text-white/40 group-hover:text-red-500 group-hover:translate-x-1 transition-all"></i>
        </div>
      </div>

      {/* CORNER DECORATIONS */}
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/20"></div>
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/20"></div>
    </button>
  );
};

export default TacticalButton;
