
import React from 'react';

const SpinningCylinderVisual: React.FC = () => {
  const segments = Array.from({ length: 12 });
  const radius = 35; 
  
  return (
    <div className="relative w-20 h-40 flex items-center justify-center perspective-stack">
      <div className="cylinder-3d w-8 h-28 relative">
        {segments.map((_, i) => {
          const angle = (i * 360) / segments.length;
          return (
            <div 
              key={i}
              className="absolute inset-0 backface-hidden"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                borderLeft: '1px solid rgba(239, 68, 68, 0.2)',
                background: 'linear-gradient(to bottom, transparent, rgba(239, 68, 68, 0.05), transparent)'
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-between py-1 opacity-20">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="h-px w-full bg-red-500/40"></div>
                ))}
              </div>
            </div>
          );
        })}
        {/* Caps */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] rounded-full border border-red-500/20 bg-red-500/5"
          style={{ transform: 'rotateX(90deg)' }}
        ></div>
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[70px] h-[70px] rounded-full border border-red-500/20 bg-red-500/5"
          style={{ transform: 'rotateX(90deg)' }}
        ></div>
        
        {/* Red edge indicator (Requested constant) */}
        <div className="absolute left-[-37px] top-0 h-full w-[2px] bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-50"></div>
      </div>
    </div>
  );
};

export default SpinningCylinderVisual;
