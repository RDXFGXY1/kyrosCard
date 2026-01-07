
import React, { useState, useRef, useEffect } from 'react';
import { soundManager } from '../utils/SoundManager';

interface FloatingModuleProps {
  children: React.ReactNode;
  title: string;
  className?: string;
  variant?: 'red' | 'gray';
  initialPos?: { x: number, y: number };
}

const FloatingModule: React.FC<FloatingModuleProps> = ({ children, title, className, variant = 'gray', initialPos = { x: 0, y: 0 } }) => {
  const isRed = variant === 'red';
  const [position, setPosition] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const moduleRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    soundManager.playDragStart();
    
    const rect = moduleRef.current?.getBoundingClientRect();
    if (rect) {
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        soundManager.playDragEnd();
      }
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={moduleRef}
      onMouseDown={handleMouseDown}
      style={{ 
        position: 'fixed',
        left: position.x || undefined,
        top: position.y || undefined,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 100 : 50
      }}
      className={`
        bg-neutral-900/95 backdrop-blur-md border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-3 
        transition-shadow duration-300 select-none
        ${isDragging ? 'ring-2 ring-red-600/50 shadow-[0_0_30px_rgba(239,68,68,0.3)] opacity-80 scale-105' : 'hover:border-white/20'}
        ${!position.x && className}
      `}
    >
      {/* Dragging Coordinates Overlay */}
      {isDragging && (
        <div className="absolute -top-8 left-0 mono text-[8px] text-red-500 font-bold bg-black/80 px-2 py-1 border border-red-600/20 whitespace-nowrap animate-pulse">
          LOC_X: {Math.round(position.x)} | LOC_Y: {Math.round(position.y)}
        </div>
      )}

      <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-1 pointer-events-none">
        <span className={`mono text-[7px] font-black uppercase tracking-widest ${isRed ? 'text-red-500' : 'text-white/40'}`}>
          {title}
        </span>
        <div className={`w-1 h-1 rounded-full ${isRed ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`}></div>
      </div>
      <div className="relative pointer-events-none">
        {children}
      </div>
      {/* Corner Brackets */}
      <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-red-600/40"></div>
      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-red-600/40"></div>
    </div>
  );
};

export default FloatingModule;
