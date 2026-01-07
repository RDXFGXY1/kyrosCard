import React, { useEffect, useState } from 'react';

const WaveformVisual: React.FC = () => {
  const [points, setPoints] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(Array.from({ length: 24 }, () => Math.random() * 100));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 h-8 w-full">
      {points.map((p, i) => (
        <div 
          key={i} 
          className="flex-1 bg-[#ff3131]/40 transition-all duration-150" 
          style={{ height: `${Math.max(12, p)}%` }}
        ></div>
      ))}
    </div>
  );
};

export default WaveformVisual;