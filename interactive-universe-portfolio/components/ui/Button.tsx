import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className,
  type = 'button',
}) => {
  const baseClasses = [
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'font-semibold',
    'border',
    'rounded-lg',
    'transition-all',
    'duration-300',
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
  ];

  const variantClasses = {
    primary: [
      'bg-gradient-to-r',
      'from-accent-gold',
      'to-accent-silver',
      'text-bg-primary',
      'border-transparent',
      'hover:shadow-lg',
      'hover:shadow-accent-gold/25',
      'hover:scale-105',
      'focus:ring-accent-gold',
      'active:scale-95',
    ],
    secondary: [
      'bg-transparent',
      'text-text-primary',
      'border-accent-gold/30',
      'backdrop-blur-sm',
      'hover:bg-accent-gold/10',
      'hover:border-accent-gold/50',
      'hover:shadow-lg',
      'hover:shadow-accent-gold/10',
      'hover:scale-102',
      'focus:ring-accent-gold/50',
    ],
    ghost: [
      'bg-transparent',
      'text-text-secondary',
      'border-transparent',
      'hover:bg-white/5',
      'hover:text-text-primary',
      'hover:backdrop-blur-sm',
      'focus:ring-white/20',
    ],
  };

  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm', 'gap-1.5'],
    md: ['px-6', 'py-3', 'text-base', 'gap-2'],
    lg: ['px-8', 'py-4', 'text-lg', 'gap-3'],
  };

  const shimmerClasses = variant === 'primary' ? [
    'before:absolute',
    'before:inset-0',
    'before:bg-gradient-to-r',
    'before:from-transparent',
    'before:via-white/20',
    'before:to-transparent',
    'before:translate-x-[-100%]',
    'before:transition-transform',
    'before:duration-700',
    'hover:before:translate-x-[100%]',
  ] : [];

  const combinedClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    shimmerClasses,
    className
  );

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Shimmer effect overlay for primary buttons */}
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] transition-transform duration-700 group-hover:translate-x-[100%]" />
      )}
      
      {/* Glass morphism background for secondary buttons */}
      {variant === 'secondary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-inherit">
        {children}
      </span>
    </button>
  );
};