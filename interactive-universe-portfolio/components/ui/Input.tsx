'use client';

import React, { useState, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps {
  type: 'text' | 'email' | 'password';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  label,
  className,
  disabled = false,
  required = false,
  id,
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = [
    'w-full',
    'px-4',
    'py-3',
    'text-base',
    'text-text-primary',
    'bg-transparent',
    'border',
    'rounded-lg',
    'transition-all',
    'duration-300',
    'ease-out',
    'backdrop-blur-sm',
    'focus:outline-none',
    'placeholder:text-text-muted',
    'placeholder:font-light',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ];

  const stateClasses = error
    ? [
        'border-red-500/50',
        'bg-red-500/5',
        'focus:border-red-500',
        'focus:ring-2',
        'focus:ring-red-500/20',
        'focus:bg-red-500/10',
      ]
    : [
        'border-white/10',
        'bg-white/3',
        'hover:border-white/20',
        'hover:bg-white/5',
        'focus:border-accent-gold',
        'focus:ring-2',
        'focus:ring-accent-gold/20',
        'focus:bg-white/8',
      ];

  const focusClasses = isFocused && !error
    ? [
        'shadow-lg',
        'shadow-accent-gold/10',
        'scale-[1.02]',
      ]
    : [];

  const combinedClasses = clsx(
    baseClasses,
    stateClasses,
    focusClasses,
    className
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className={clsx(
            'block text-sm font-medium transition-colors duration-200',
            error ? 'text-red-400' : 'text-text-primary',
            required && "after:content-['*'] after:ml-1 after:text-red-400"
          )}
        >
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative group">
        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={combinedClasses}
        />

        {/* Password Toggle Button */}
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={clsx(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'p-1 rounded-md',
              'text-text-muted hover:text-text-primary',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-accent-gold/20',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={disabled}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOffIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Focus Ring Effect */}
        <div 
          className={clsx(
            'absolute inset-0 rounded-lg pointer-events-none transition-all duration-300',
            isFocused && !error && 'ring-2 ring-accent-gold/30 ring-offset-2 ring-offset-bg-primary'
          )}
        />

        {/* Shimmer Effect on Focus */}
        {isFocused && !error && (
          <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-gold/10 to-transparent translate-x-[-100%] animate-shimmer" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 animate-slideInLuxury">
          <ExclamationIcon className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text for Password Requirements */}
      {type === 'password' && !error && value && (
        <div className="text-xs text-text-muted space-y-1">
          <div className="flex items-center gap-2">
            <div className={clsx(
              'w-2 h-2 rounded-full transition-colors duration-200',
              value.length >= 8 ? 'bg-green-500' : 'bg-text-muted/30'
            )} />
            <span>At least 8 characters</span>
          </div>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Simple SVG Icons
const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const ExclamationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);