import React, { useState, useRef, useEffect } from 'react';

const TacticalBadge: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const badgeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    
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

    const handleMouseUp = () => setIsDragging(false);

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
      ref={badgeRef}
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 100 : 60
      }}
      className={`
        absolute left-10 top-10 w-48 bg-black border border-white/10 p-4 shadow-2xl transition-shadow duration-300
        ${isDragging ? 'shadow-[0_0_50px_rgba(255,49,49,0.3)] border-red-600 scale-105' : 'hover:border-white/20'}
      `}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="mono text-[8px] text-red-600 font-black uppercase tracking-widest">Dossier_ID</span>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
        </div>
        
        <div className="aspect-square bg-white/5 border border-white/5 overflow-hidden relative">
          <img 
            src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400" 
            alt="Operative" 
            className="w-full h-full object-cover grayscale brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-red-600/5"></div>
        </div>

        <div className="space-y-1">
          <h4 className="stencil text-sm text-white font-black uppercase tracking-tighter">KYROS-09</h4>
          <p className="mono text-[7px] text-white/30 uppercase font-black">SECTOR: RED_ZONE</p>
        </div>
      </div>
      
      {/* Decorative corner */}
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-red-600" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
    </div>
  );
};

export default TacticalBadge;