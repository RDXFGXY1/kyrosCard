import React, { useState, useRef, useEffect } from 'react';
import { soundManager } from '../utils/SoundManager';

const IdentityTag: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const tagRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    soundManager.playDragStart();
    
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
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
      if (isDragging) soundManager.playDragEnd();
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
      ref={tagRef}
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 50px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 100 : 60
      }}
      className={`
        w-28 h-80 bg-[#0a0c0e]/95 border border-white/10 flex flex-col items-center py-6 gap-6 shadow-2xl
        transition-all duration-300 select-none backdrop-blur-md
        ${isDragging ? 'opacity-80 scale-105 border-red-600 shadow-[0_0_50px_rgba(255,0,0,0.4)]' : 'hover:border-white/20'}
      `}
    >
      {/* Decorative hole */}
      <div className="w-6 h-6 rounded-full bg-black border border-white/10 flex items-center justify-center relative">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-ping absolute"></div>
        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
      </div>

      {/* Portrait */}
      <div className="w-20 h-20 bg-white/5 border border-white/5 overflow-hidden relative">
        <img 
           src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400" 
           alt="ID" 
           className="w-full h-full object-cover grayscale brightness-75 contrast-125 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-red-600/5 mix-blend-overlay"></div>
      </div>
      
      {/* Bio Labels */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <span className="mono text-[8px] text-white/20 uppercase tracking-[0.8em] rotate-180 [writing-mode:vertical-lr] font-black italic">
          OPERATOR_KYROS-09_X
        </span>
      </div>

      {/* Barcode / Data */}
      <div className="w-20 h-10 border-t border-white/5 pt-4 flex gap-1 items-end px-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-red-600/20 w-full" style={{ height: `${20 + Math.random() * 80}%` }}></div>
        ))}
      </div>
      
      {/* ID Banner */}
      <div className="bg-red-600 w-full py-2.5 flex items-center justify-center shadow-lg">
        <span className="stencil text-[10px] text-black font-black uppercase tracking-widest">KYROS</span>
      </div>
    </div>
  );
};

export default IdentityTag;