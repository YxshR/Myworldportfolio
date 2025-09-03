/**
 * Mobile-Optimized Card Component
 * Enhanced with swipe gestures, touch interactions, and mobile-specific layouts
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';

interface MobileCardProps {
  variant?: 'default' | 'elevated' | 'interactive' | 'swipeable';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  border?: boolean;
  glow?: boolean;
  shimmer?: boolean;
  swipeThreshold?: number;
  hapticFeedback?: boolean;
  expandOnTouch?: boolean;
}

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  isSwiping: boolean;
  swipeDirection: 'left' | 'right' | 'up' | 'down' | null;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  variant = 'default',
  children,
  className,
  onClick,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  padding = 'md',
  rounded = 'lg',
  border = true,
  glow = false,
  shimmer = false,
  swipeThreshold = 50,
  hapticFeedback = true,
  expandOnTouch = false,
}) => {
  const { optimizations } = useMobileOptimizations();
  const [isPressed, setIsPressed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    isSwiping: false,
    swipeDirection: null,
  });
  
  const cardRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout>();
  
  const isClickable = !!onClick;
  const isSwipeable = variant === 'swipeable' || !!(onSwipeLeft || onSwipeRight || onSwipeUp || onSwipeDown);
  
  // Haptic feedback function
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!hapticFeedback) return;
    
    if ('vibrate' in navigator && optimizations.capabilities?.isMobile) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  };
  
  // Handle touch start
  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    
    setIsPressed(true);
    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
      isSwiping: false,
      swipeDirection: null,
    });
    
    if (hapticFeedback) {
      triggerHaptic('light');
    }
    
    // Long press for expansion
    if (expandOnTouch) {
      longPressTimer.current = setTimeout(() => {
        setIsExpanded(true);
        triggerHaptic('medium');
      }, 500);
    }
  };
  
  // Handle touch move
  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isSwipeable) return;
    
    const touch = event.touches[0];
    const deltaX = touch.clientX - swipeState.startX;
    const deltaY = touch.clientY - swipeState.startY;
    
    // Determine swipe direction
    let swipeDirection: 'left' | 'right' | 'up' | 'down' | null = null;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > swipeThreshold) {
        swipeDirection = deltaX > 0 ? 'right' : 'left';
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > swipeThreshold) {
        swipeDirection = deltaY > 0 ? 'down' : 'up';
      }
    }
    
    setSwipeState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX,
      deltaY,
      isSwiping: Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10,
      swipeDirection,
    }));
    
    // Clear long press timer if swiping
    if (swipeState.isSwiping && longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };
  
  // Handle touch end
  const handleTouchEnd = () => {
    setIsPressed(false);
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    // Handle swipe actions
    if (swipeState.isSwiping && swipeState.swipeDirection) {
      triggerHaptic('medium');
      
      switch (swipeState.swipeDirection) {
        case 'left':
          onSwipeLeft?.();
          break;
        case 'right':
          onSwipeRight?.();
          break;
        case 'up':
          onSwipeUp?.();
          break;
        case 'down':
          onSwipeDown?.();
          break;
      }
    } else if (!swipeState.isSwiping && isClickable) {
      // Handle click if not swiping
      onClick?.();
    }
    
    // Reset swipe state
    setSwipeState({
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      deltaX: 0,
      deltaY: 0,
      isSwiping: false,
      swipeDirection: null,
    });
  };
  
  // Base classes
  const baseClasses = [
    'relative',
    'backdrop-blur-xl',
    '-webkit-backdrop-filter',
    'webkit-backdrop-blur-xl',
    'transition-all',
    'duration-300', // Faster for mobile
    'ease-out',
    'group',
    'overflow-hidden',
    'touch-manipulation', // Optimize for touch
    'select-none', // Prevent text selection
  ];
  
  // Variant classes
  const variantClasses = {
    default: [
      'bg-white/5',
      isPressed ? 'bg-white/10 scale-98' : 'hover:bg-white/8',
      border && 'border-white/10',
      border && 'hover:border-white/20',
    ],
    elevated: [
      'bg-white/8',
      isPressed ? 'bg-white/15 scale-95' : 'hover:bg-white/12',
      border && 'border-white/15',
      border && 'hover:border-white/25',
      'shadow-lg',
      'shadow-black/20',
      isPressed ? 'shadow-xl shadow-black/40' : 'hover:shadow-xl hover:shadow-black/30',
      !isPressed && 'hover:scale-[1.02] hover:-translate-y-1',
    ],
    interactive: [
      'bg-white/6',
      isPressed ? 'bg-white/15 scale-95' : 'hover:bg-white/10',
      border && 'border-white/12',
      border && 'hover:border-accent-gold/30',
      'cursor-pointer',
      !isPressed && 'hover:scale-[1.03] hover:-translate-y-2',
      'hover:shadow-2xl',
      'hover:shadow-accent-gold/10',
    ],
    swipeable: [
      'bg-white/6',
      isPressed ? 'bg-white/12 scale-98' : 'hover:bg-white/10',
      border && 'border-white/12',
      border && swipeState.isSwiping && 'border-accent-gold/50',
      'cursor-grab',
      swipeState.isSwiping && 'cursor-grabbing',
      swipeState.isSwiping && 'scale-105',
    ],
  };
  
  // Padding classes (larger for mobile)
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  // Rounded classes (more rounded for mobile)
  const roundedClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    '2xl': 'rounded-[2rem]',
  };
  
  // Clickable classes
  const clickableClasses = isClickable
    ? [
        'cursor-pointer',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-accent-gold/30',
        'focus:ring-offset-2',
        'focus:ring-offset-bg-primary',
      ]
    : [];
  
  // Glow classes
  const glowClasses = glow
    ? [
        'before:absolute',
        'before:inset-0',
        'before:rounded-inherit',
        'before:p-[1px]',
        'before:bg-gradient-to-r',
        'before:from-accent-gold/20',
        'before:via-accent-silver/20',
        'before:to-accent-gold/20',
        'before:mask-composite',
        'before:mask-[linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]',
        'before:mask-composite-subtract',
        'before:opacity-0',
        'hover:before:opacity-100',
        'before:transition-opacity',
        'before:duration-500',
      ]
    : [];
  
  // Shimmer classes
  const shimmerClasses = shimmer
    ? [
        'after:absolute',
        'after:inset-0',
        'after:bg-gradient-to-r',
        'after:from-transparent',
        'after:via-white/10',
        'after:to-transparent',
        'after:translate-x-[-100%]',
        'after:transition-transform',
        'after:duration-1000',
        'hover:after:translate-x-[100%]',
        'after:pointer-events-none',
      ]
    : [];
  
  // Expansion classes
  const expansionClasses = isExpanded
    ? ['scale-105', 'z-10', 'shadow-2xl', 'shadow-accent-gold/20']
    : [];
  
  const combinedClasses = clsx(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    roundedClasses[rounded],
    clickableClasses,
    glowClasses,
    shimmerClasses,
    expansionClasses,
    className
  );
  
  // Transform style for swipe feedback
  const transformStyle = swipeState.isSwiping
    ? {
        transform: `translate(${swipeState.deltaX * 0.1}px, ${swipeState.deltaY * 0.1}px) rotate(${swipeState.deltaX * 0.02}deg)`,
      }
    : {};
  
  return (
    <div
      ref={cardRef}
      className={combinedClasses}
      style={transformStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={!optimizations.capabilities?.isMobile ? onClick : undefined}
    >
      {/* Swipe indicators */}
      {isSwipeable && swipeState.isSwiping && (
        <>
          {swipeState.swipeDirection === 'left' && onSwipeLeft && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 animate-pulse">
              <SwipeLeftIcon className="w-6 h-6" />
            </div>
          )}
          {swipeState.swipeDirection === 'right' && onSwipeRight && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 animate-pulse">
              <SwipeRightIcon className="w-6 h-6" />
            </div>
          )}
          {swipeState.swipeDirection === 'up' && onSwipeUp && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-blue-400 animate-pulse">
              <SwipeUpIcon className="w-6 h-6" />
            </div>
          )}
          {swipeState.swipeDirection === 'down' && onSwipeDown && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-yellow-400 animate-pulse">
              <SwipeDownIcon className="w-6 h-6" />
            </div>
          )}
        </>
      )}
      
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Press state overlay */}
      {isPressed && (
        <div className="absolute inset-0 bg-white/10 rounded-inherit pointer-events-none" />
      )}
      
      {/* Expansion overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 cursor-pointer"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      {/* Floating particles effect for elevated variant */}
      {variant === 'elevated' && (
        <>
          <div className="absolute top-4 right-4 w-1 h-1 bg-accent-gold/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />
          <div className="absolute bottom-6 left-6 w-0.5 h-0.5 bg-accent-silver/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300" />
          <div className="absolute top-1/2 left-4 w-0.5 h-0.5 bg-accent-blue/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-500" />
        </>
      )}
      
      {/* Interactive pulse effect */}
      {variant === 'interactive' && (
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-accent-gold/5 via-transparent to-accent-gold/5 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
      )}
    </div>
  );
};

// Swipe direction icons
const SwipeLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const SwipeRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const SwipeUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const SwipeDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// Card Header Component
interface MobileCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCardHeader: React.FC<MobileCardHeaderProps> = ({ children, className }) => (
  <div className={clsx('mb-4 pb-4 border-b border-white/10', className)}>
    {children}
  </div>
);

// Card Title Component
interface MobileCardTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MobileCardTitle: React.FC<MobileCardTitleProps> = ({ 
  children, 
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <h3 className={clsx(
      'font-display font-semibold text-text-primary',
      sizeClasses[size],
      className
    )}>
      {children}
    </h3>
  );
};

// Card Content Component
interface MobileCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCardContent: React.FC<MobileCardContentProps> = ({ children, className }) => (
  <div className={clsx('text-text-secondary leading-relaxed', className)}>
    {children}
  </div>
);

// Card Footer Component
interface MobileCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCardFooter: React.FC<MobileCardFooterProps> = ({ children, className }) => (
  <div className={clsx('mt-6 pt-4 border-t border-white/10', className)}>
    {children}
  </div>
);