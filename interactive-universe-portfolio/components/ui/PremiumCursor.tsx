'use client';

import { useEffect, useState } from 'react';

export const PremiumCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, .interactive-element, canvas')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, .interactive-element, canvas')) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        className={`fixed pointer-events-none z-50 transition-all duration-200 ease-out ${
          isHovering ? 'scale-150' : 'scale-100'
        } ${isClicking ? 'scale-75' : ''}`}
        style={{
          left: position.x - 8,
          top: position.y - 8,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1}) scale(${isClicking ? 0.75 : 1})`
        }}
      >
        <div className="w-4 h-4 bg-accent-gold rounded-full opacity-80 animate-pulse"></div>
      </div>

      {/* Trailing cursor */}
      <div
        className="fixed pointer-events-none z-40 transition-all duration-500 ease-out"
        style={{
          left: position.x - 16,
          top: position.y - 16,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className={`w-8 h-8 border-2 border-accent-gold/30 rounded-full transition-all duration-300 ${
          isHovering ? 'scale-200 border-accent-gold/50' : 'scale-100'
        }`}></div>
      </div>

      {/* Glow effect */}
      <div
        className="fixed pointer-events-none z-30 transition-all duration-700 ease-out"
        style={{
          left: position.x - 32,
          top: position.y - 32,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className={`w-16 h-16 bg-gradient-radial from-accent-gold/10 to-transparent rounded-full transition-all duration-500 ${
          isHovering ? 'scale-150 opacity-100' : 'scale-100 opacity-50'
        }`}></div>
      </div>
    </>
  );
};