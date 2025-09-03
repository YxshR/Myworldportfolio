'use client';

import { useEffect, useState } from 'react';

interface PremiumLoaderProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

export const PremiumLoader: React.FC<PremiumLoaderProps> = ({ 
  isLoading, 
  progress = 0, 
  message = "Loading Universe..." 
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDisplayProgress(prev => {
          const target = progress || Math.min(prev + Math.random() * 15, 95);
          return prev + (target - prev) * 0.1;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setDisplayProgress(100);
    }
  }, [isLoading, progress]);

  if (!isLoading && displayProgress >= 100) return null;

  return (
    <div className="fixed inset-0 z-50 bg-bg-primary flex items-center justify-center">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent-gold rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="text-center z-10">
        {/* Main loader animation */}
        <div className="relative mb-8">
          {/* Outer ring */}
          <div className="w-32 h-32 border-2 border-accent-gold/20 rounded-full animate-spin mx-auto">
            <div className="absolute inset-2 border-2 border-accent-gold/40 rounded-full animate-spin" 
                 style={{ animationDirection: 'reverse', animationDuration: '3s' }}>
              <div className="absolute inset-2 border-2 border-accent-gold rounded-full animate-spin"
                   style={{ animationDuration: '1.5s' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-accent-gold rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-radial from-accent-gold/20 via-transparent to-transparent blur-xl"></div>
        </div>

        {/* Progress bar */}
        <div className="w-64 mx-auto mb-6">
          <div className="glass-card p-1 rounded-full">
            <div 
              className="h-2 bg-gradient-to-r from-accent-gold to-accent-silver rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${displayProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-text-muted mt-2">
            <span>0%</span>
            <span className="text-accent-gold font-semibold">{Math.round(displayProgress)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Loading message */}
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          {message}
        </h2>
        <p className="text-text-secondary text-sm">
          Preparing your cosmic experience...
        </p>

        {/* Status indicators */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-text-muted">WebGL Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-text-muted">3D Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-gold rounded-full animate-pulse"></div>
            <span className="text-xs text-text-muted">Stars System</span>
          </div>
        </div>
      </div>
    </div>
  );
};