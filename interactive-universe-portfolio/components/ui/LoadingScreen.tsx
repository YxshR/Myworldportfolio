'use client';

import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

interface LoadingScreenProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
  variant?: 'full' | 'overlay' | 'inline';
  showProgress?: boolean;
  showMessage?: boolean;
  onComplete?: () => void;
  className?: string;
}

interface LoadingStage {
  id: string;
  message: string;
  duration: number;
}

const loadingStages: LoadingStage[] = [
  { id: 'initializing', message: 'Initializing Universe...', duration: 1000 },
  { id: 'loading-earth', message: 'Loading Earth Textures...', duration: 1500 },
  { id: 'creating-stars', message: 'Creating Star System...', duration: 1200 },
  { id: 'preparing-experience', message: 'Preparing Experience...', duration: 800 },
  { id: 'ready', message: 'Welcome to the Universe', duration: 500 },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  progress,
  message,
  variant = 'full',
  showProgress = true,
  showMessage = true,
  onComplete,
  className,
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [internalProgress, setInternalProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Auto-progress through stages if no external progress provided
  useEffect(() => {
    if (!isLoading || progress !== undefined) return;

    const timer = setTimeout(() => {
      if (currentStage < loadingStages.length - 1) {
        setCurrentStage(prev => prev + 1);
        setInternalProgress(((currentStage + 1) / loadingStages.length) * 100);
      } else {
        setInternalProgress(100);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }, loadingStages[currentStage].duration);
      }
    }, loadingStages[currentStage]?.duration || 1000);

    return () => clearTimeout(timer);
  }, [currentStage, isLoading, progress, onComplete]);

  // Handle external progress changes
  useEffect(() => {
    if (progress !== undefined) {
      setInternalProgress(progress);
      if (progress >= 100) {
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }, 300);
      }
    }
  }, [progress, onComplete]);

  const currentProgress = progress !== undefined ? progress : internalProgress;
  const currentMessage = message || loadingStages[currentStage]?.message || 'Loading...';

  if (!isLoading && !isExiting) return null;

  const getVariantClasses = () => {
    switch (variant) {
      case 'full':
        return [
          'fixed',
          'inset-0',
          'z-50',
          'flex',
          'items-center',
          'justify-center',
          'bg-bg-primary',
        ];
      case 'overlay':
        return [
          'fixed',
          'inset-0',
          'z-40',
          'flex',
          'items-center',
          'justify-center',
          'backdrop-blur-xl',
          'bg-black/80',
        ];
      case 'inline':
        return [
          'flex',
          'items-center',
          'justify-center',
          'p-8',
        ];
      default:
        return [];
    }
  };

  const baseClasses = [
    'transition-all',
    'duration-500',
    'ease-out',
    isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
    ...getVariantClasses(),
  ];

  return (
    <div className={clsx(baseClasses, className)}>
      {/* Background Effects */}
      {variant !== 'inline' && (
        <>
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-accent-gold/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Orbital Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {[1, 2, 3].map((ring) => (
                <div
                  key={ring}
                  className={clsx(
                    'absolute border border-accent-gold/10 rounded-full',
                    'animate-spin'
                  )}
                  style={{
                    width: `${ring * 120}px`,
                    height: `${ring * 120}px`,
                    left: `${-ring * 60}px`,
                    top: `${-ring * 60}px`,
                    animationDuration: `${ring * 8}s`,
                    animationDirection: ring % 2 === 0 ? 'reverse' : 'normal',
                  }}
                >
                  <div
                    className="absolute w-2 h-2 bg-accent-gold/50 rounded-full"
                    style={{
                      top: '-1px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Main Loading Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo/Brand */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-accent-gold to-accent-silver flex items-center justify-center shadow-2xl shadow-accent-gold/30">
            <UniverseIcon className="w-10 h-10 text-bg-primary animate-pulse" />
          </div>
          
          {/* Pulsing Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-gold to-accent-silver opacity-30 blur-xl animate-pulse" />
          
          {/* Rotating Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-accent-gold/20 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute w-1 h-1 bg-accent-gold rounded-full -top-0.5 left-1/2 transform -translate-x-1/2" />
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="relative">
          <div className="w-16 h-16 relative">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-accent-gold/20" />
            
            {/* Progress Ring */}
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="text-accent-gold/30"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - currentProgress / 100)}`}
                className="text-accent-gold transition-all duration-500 ease-out"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.5))',
                }}
              />
            </svg>

            {/* Center Dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-accent-gold rounded-full animate-pulse" />
            </div>
          </div>

          {/* Orbiting Dots */}
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="absolute w-1 h-1 bg-accent-silver/60 rounded-full"
              style={{
                animation: `orbit 2s linear infinite`,
                animationDelay: `${dot * 0.6}s`,
                transformOrigin: '32px 32px',
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="w-full max-w-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-text-secondary">
                Progress
              </span>
              <span className="text-sm font-mono text-accent-gold">
                {Math.round(currentProgress)}%
              </span>
            </div>
            
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              {/* Progress Fill */}
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent-gold to-accent-silver rounded-full transition-all duration-500 ease-out"
                style={{ width: `${currentProgress}%` }}
              />
              
              {/* Shimmer Effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-shimmer"
                style={{ animationDuration: '2s' }}
              />
              
              {/* Glow Effect */}
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent-gold/50 to-accent-silver/50 rounded-full blur-sm transition-all duration-500 ease-out"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Loading Message */}
        {showMessage && (
          <div className="text-center space-y-2">
            <p className="text-lg font-display font-medium text-text-primary animate-pulse">
              {currentMessage}
            </p>
            
            {/* Stage Indicators */}
            <div className="flex items-center justify-center space-x-2">
              {loadingStages.map((stage, index) => (
                <div
                  key={stage.id}
                  className={clsx(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    index <= currentStage
                      ? 'bg-accent-gold shadow-lg shadow-accent-gold/50'
                      : 'bg-white/20'
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading Tips */}
        <div className="text-center">
          <p className="text-sm text-text-muted max-w-sm">
            Preparing an immersive 3D universe experience with real-time visitor interactions
          </p>
        </div>
      </div>

      {/* Additional CSS for animations */}
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(32px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(32px) rotate(-360deg);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

// Compact Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'silver' | 'blue';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'gold',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    gold: 'text-accent-gold',
    silver: 'text-accent-silver',
    blue: 'text-accent-blue',
  };

  return (
    <div className={clsx('relative', sizeClasses[size], className)}>
      <svg
        className="animate-spin"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className={clsx('opacity-75', colorClasses[color])}
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Loading Dots Component
interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'silver' | 'blue';
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'md',
  color = 'gold',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const colorClasses = {
    gold: 'bg-accent-gold',
    silver: 'bg-accent-silver',
    blue: 'bg-accent-blue',
  };

  return (
    <div className={clsx('flex items-center space-x-1', className)}>
      {[0, 1, 2].map((dot) => (
        <div
          key={dot}
          className={clsx(
            'rounded-full animate-pulse',
            sizeClasses[size],
            colorClasses[color]
          )}
          style={{
            animationDelay: `${dot * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'silver' | 'blue';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showPercentage = true,
  size = 'md',
  color = 'gold',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    gold: 'from-accent-gold to-accent-silver',
    silver: 'from-accent-silver to-white',
    blue: 'from-accent-blue to-blue-300',
  };

  return (
    <div className={clsx('w-full', className)}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-secondary">
            Loading
          </span>
          <span className="text-sm font-mono text-accent-gold">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      
      <div className={clsx(
        'relative bg-white/10 rounded-full overflow-hidden backdrop-blur-sm',
        sizeClasses[size]
      )}>
        <div
          className={clsx(
            'absolute left-0 top-0 h-full bg-gradient-to-r rounded-full transition-all duration-500 ease-out',
            colorClasses[color]
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
        
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-shimmer"
          style={{ animationDuration: '2s' }}
        />
      </div>
    </div>
  );
};

// Simple SVG Icons
const UniverseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);