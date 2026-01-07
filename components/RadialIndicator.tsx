import React from 'react';

interface RadialIndicatorProps {
  progress: number;
  label: string;
}

const RadialIndicator: React.FC<RadialIndicatorProps> = ({ progress, label }) => {
  const radius = 34; // Reduced radius
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-full h-full flex items-center justify-center group/radial">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background Track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="stroke-white/5 fill-none"
          strokeWidth="3"
        />
        {/* Active Progress */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="stroke-red-600 fill-none transition-all duration-1000 ease-out"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center Text Area */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="stencil text-base text-white group-hover/radial:text-red-500 transition-colors leading-none">{progress}%</span>
        <span className="mono text-[6px] text-white/20 font-black uppercase tracking-widest mt-0.5">{label}</span>
      </div>
    </div>
  );
};

export default RadialIndicator;