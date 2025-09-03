/**
 * Mobile-Optimized Button Component
 * Enhanced with touch gestures, haptic feedback, and mobile-specific interactions
 */

import React, { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';

interface MobileButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'floating';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  onClick?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'none';
  rippleEffect?: boolean;
  longPressDelay?: number;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  onLongPress,
  disabled = false,
  className,
  type = 'button',
  hapticFeedback = 'light',
  rippleEffect = true,
  longPressDelay = 500,
  icon,
  iconPosition = 'left',
}) => {
  const { optimizations } = useMobileOptimizations();
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const rippleCounter = useRef(0);
  
  // Haptic feedback function
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (hapticFeedback === 'none') return;
    
    if ('vibrate' in navigator && optimizations.capabilities?.isMobile) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  };
  
  // Create ripple effect
  const createRipple = (event: React.MouseEvent | React.TouchEvent) => {
    if (!rippleEffect || !buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const newRipple = {
      id: rippleCounter.current++,
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };
  
  // Handle touch start
  const handleTouchStart = (event: React.TouchEvent) => {
    if (disabled) return;
    
    setIsPressed(true);
    setLongPressTriggered(false);
    createRipple(event);
    triggerHaptic(hapticFeedback);
    
    // Start long press timer
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        setLongPressTriggered(true);
        triggerHaptic('heavy');
        onLongPress();
      }, longPressDelay);
    }
  };
  
  // Handle touch end
  const handleTouchEnd = () => {
    if (disabled) return;
    
    setIsPressed(false);
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    // Trigger click if not long press
    if (!longPressTriggered && onClick) {
      onClick();
    }
  };
  
  // Handle mouse events for desktop fallback
  const handleMouseDown = (event: React.MouseEvent) => {
    if (disabled || optimizations.capabilities?.isMobile) return;
    
    setIsPressed(true);
    createRipple(event);
  };
  
  const handleMouseUp = () => {
    if (disabled || optimizations.capabilities?.isMobile) return;
    
    setIsPressed(false);
    if (onClick) {
      onClick();
    }
  };
  
  const handleMouseLeave = () => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };
  
  // Base classes
  const baseClasses = [
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'font-semibold',
    'border',
    'rounded-xl', // More rounded for mobile
    'transition-all',
    'duration-200', // Faster transitions for mobile
    'ease-out',
    'cursor-pointer',
    'overflow-hidden',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-offset-bg-primary',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:transform-none',
    'group',
    'select-none', // Prevent text selection on mobile
    'touch-manipulation', // Optimize for touch
  ];
  
  // Variant classes
  const variantClasses = {
    primary: [
      'bg-gradient-to-r',
      'from-accent-gold',
      'to-accent-silver',
      'text-bg-primary',
      'border-transparent',
      'shadow-lg',
      'shadow-accent-gold/25',
      isPressed ? 'scale-95 shadow-accent-gold/40' : 'hover:scale-105',
      'focus:ring-accent-gold',
    ],
    secondary: [
      'bg-white/10',
      'text-text-primary',
      'border-accent-gold/30',
      'backdrop-blur-sm',
      'shadow-md',
      isPressed ? 'scale-95 bg-white/20' : 'hover:bg-accent-gold/10',
      'hover:border-accent-gold/50',
      'focus:ring-accent-gold/50',
    ],
    ghost: [
      'bg-transparent',
      'text-text-secondary',
      'border-transparent',
      isPressed ? 'scale-95 bg-white/10' : 'hover:bg-white/5',
      'hover:text-text-primary',
      'focus:ring-white/20',
    ],
    floating: [
      'bg-black/80',
      'backdrop-blur-xl',
      'text-text-primary',
      'border-white/20',
      'shadow-2xl',
      'shadow-black/50',
      isPressed ? 'scale-95' : 'hover:scale-105',
      'hover:bg-black/90',
      'hover:border-accent-gold/30',
      'focus:ring-accent-gold/30',
    ],
  };
  
  // Size classes (larger for mobile)
  const sizeClasses = {
    sm: ['px-4', 'py-2', 'text-sm', 'gap-2', 'min-h-[40px]'],
    md: ['px-6', 'py-3', 'text-base', 'gap-3', 'min-h-[48px]'],
    lg: ['px-8', 'py-4', 'text-lg', 'gap-3', 'min-h-[56px]'],
    xl: ['px-10', 'py-5', 'text-xl', 'gap-4', 'min-h-[64px]'],
  };
  
  const combinedClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );
  
  return (
    <button
      ref={buttonRef}
      type={type}
      className={combinedClasses}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ping pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
      
      {/* Shimmer effect for primary buttons */}
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] transition-transform duration-700 group-hover:translate-x-[100%]" />
      )}
      
      {/* Glass morphism background for secondary buttons */}
      {variant === 'secondary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-inherit">
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </span>
      
      {/* Long press indicator */}
      {onLongPress && isPressed && (
        <div className="absolute inset-0 rounded-inherit">
          <div 
            className="h-full bg-white/20 rounded-inherit transition-all duration-500 ease-out"
            style={{
              width: longPressTriggered ? '100%' : '0%',
            }}
          />
        </div>
      )}
      
      {/* Press state overlay */}
      {isPressed && (
        <div className="absolute inset-0 bg-white/10 rounded-inherit" />
      )}
    </button>
  );
};