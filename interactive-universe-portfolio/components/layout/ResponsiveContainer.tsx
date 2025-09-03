'use client';

import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileBreakpoint?: number;
}

interface ViewportInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  mobileBreakpoint = 768
}) => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: 'portrait'
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({
        width,
        height,
        isMobile: width < mobileBreakpoint,
        isTablet: width >= mobileBreakpoint && width < 1024,
        isDesktop: width >= 1024,
        orientation: width > height ? 'landscape' : 'portrait'
      });
    };

    // Initial update
    updateViewport();

    // Listen for resize events
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, [mobileBreakpoint]);

  // Provide viewport context to children
  const contextValue = {
    viewport,
    isMobile: viewport.isMobile,
    isTablet: viewport.isTablet,
    isDesktop: viewport.isDesktop
  };

  return (
    <div 
      className={clsx(
        'responsive-container',
        {
          'mobile': viewport.isMobile,
          'tablet': viewport.isTablet,
          'desktop': viewport.isDesktop,
          'portrait': viewport.orientation === 'portrait',
          'landscape': viewport.orientation === 'landscape'
        },
        className
      )}
      data-viewport={JSON.stringify(viewport)}
    >
      {children}
    </div>
  );
};

// Hook for accessing viewport info in child components
export const useViewport = () => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: 'portrait'
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        orientation: width > height ? 'landscape' : 'portrait'
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return viewport;
};