'use client';

import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-all duration-1000 ease-out ${
      isVisible 
        ? 'opacity-100 translate-y-0 scale-100 blur-none' 
        : 'opacity-0 translate-y-8 scale-95 blur-sm'
    } ${className}`}>
      {children}
    </div>
  );
};