
import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseDown = () => setIsGrabbing(true);
    const onMouseUp = () => setIsGrabbing(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .interactive, [onMouseDown]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <>
      {/* Main Cursor Dot */}
      <div 
        className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[300] mix-blend-difference transition-all duration-200 ${isHovering ? 'bg-red-500 scale-150' : 'bg-white'}`}
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: 'transform 0.05s linear'
        }}
      />
      {/* Outer Ring / Reticle */}
      <div 
        className={`
          fixed top-0 left-0 w-8 h-8 border rounded-full pointer-events-none z-[300] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out
          ${isHovering ? 'scale-150 border-red-500 bg-red-500/10' : 'scale-100 border-white/30'}
          ${isGrabbing ? 'scale-[2.5] border-dashed opacity-50' : 'opacity-100'}
        `}
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          left: 0,
          top: 0
        }}
      >
        {isHovering && (
          <>
            <div className="absolute top-1/2 left-[-10px] right-[-10px] h-px bg-red-500/40"></div>
            <div className="absolute left-1/2 top-[-10px] bottom-[-10px] w-px bg-red-500/40"></div>
          </>
        )}
      </div>
    </>
  );
};

export default CustomCursor;
