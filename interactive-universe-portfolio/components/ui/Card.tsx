'use client';

import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  variant: 'default' | 'elevated' | 'interactive';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  border?: boolean;
  glow?: boolean;
  shimmer?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className,
  onClick,
  padding = 'md',
  rounded = 'lg',
  border = true,
  glow = false,
  shimmer = false,
}) => {
  const isClickable = !!onClick;

  const baseClasses = [
    'relative',
    'backdrop-blur-xl',
    '-webkit-backdrop-filter',
    'webkit-backdrop-blur-xl',
    'transition-all',
    'duration-500',
    'ease-out',
    'group',
    'overflow-hidden',
  ];

  const variantClasses = {
    default: [
      'bg-white/5',
      'hover:bg-white/8',
      border && 'border-white/10',
      border && 'hover:border-white/20',
    ],
    elevated: [
      'bg-white/8',
      'hover:bg-white/12',
      border && 'border-white/15',
      border && 'hover:border-white/25',
      'shadow-lg',
      'shadow-black/20',
      'hover:shadow-xl',
      'hover:shadow-black/30',
      'hover:scale-[1.02]',
      'hover:-translate-y-1',
    ],
    interactive: [
      'bg-white/6',
      'hover:bg-white/10',
      border && 'border-white/12',
      border && 'hover:border-accent-gold/30',
      'cursor-pointer',
      'hover:scale-[1.03]',
      'hover:-translate-y-2',
      'hover:shadow-2xl',
      'hover:shadow-accent-gold/10',
      'active:scale-[0.98]',
      'active:translate-y-0',
    ],
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  };

  const clickableClasses = isClickable
    ? [
        'cursor-pointer',
        'select-none',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-accent-gold/30',
        'focus:ring-offset-2',
        'focus:ring-offset-bg-primary',
      ]
    : [];

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

  const combinedClasses = clsx(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    roundedClasses[rounded],
    clickableClasses,
    glowClasses,
    shimmerClasses,
    className
  );

  const CardComponent = onClick ? 'button' : 'div';

  return (
    <CardComponent
      className={combinedClasses}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

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
    </CardComponent>
  );
};

// Card Header Component
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={clsx('mb-4 pb-4 border-b border-white/10', className)}>
    {children}
  </div>
);

// Card Title Component
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
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
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={clsx('text-text-secondary leading-relaxed', className)}>
    {children}
  </div>
);

// Card Footer Component
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={clsx('mt-6 pt-4 border-t border-white/10', className)}>
    {children}
  </div>
);