'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { useEmailSubmission } from '@/hooks/useEmailSubmission';
import { validateForm } from '@/lib/validation';

export interface EmailFormProps {
  onSubmit: (email: string, name: string) => void | Promise<void>;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const EmailForm: React.FC<EmailFormProps> = ({
  onSubmit,
  isLoading: externalLoading,
  error: externalError,
  success: externalSuccess,
  className = '',
  title = 'Join the Universe',
  subtitle = 'Enter your details to claim your star',
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; name?: string }>({});
  const [touched, setTouched] = useState<{ email: boolean; name: boolean }>({
    email: false,
    name: false,
  });

  const { state, submitEmail, clearError } = useEmailSubmission(onSubmit);

  // Use external state if provided, otherwise use internal state
  const isLoading = externalLoading ?? state.isLoading;
  const error = externalError ?? state.error;
  const success = externalSuccess ?? state.success;

  const validateField = (field: 'email' | 'name', value: string) => {
    const errors = validateForm(
      field === 'email' ? value : email,
      field === 'name' ? value : name
    );
    
    setFieldErrors(prev => ({
      ...prev,
      [field]: errors[field],
    }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      validateField('email', value);
    }
    if (error) clearError();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (touched.name) {
      validateField('name', value);
    }
    if (error) clearError();
  };

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    validateField('email', email);
  };

  const handleNameBlur = () => {
    setTouched(prev => ({ ...prev, name: true }));
    validateField('name', name);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ email: true, name: true });
    
    // Validate all fields
    const errors = validateForm(email, name);
    setFieldErrors(errors);
    
    // Don't submit if there are validation errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    await submitEmail(email, name);
  };

  const isFormValid = email && name && Object.keys(fieldErrors).length === 0;

  // Clear form on successful submission
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setEmail('');
        setName('');
        setFieldErrors({});
        setTouched({ email: false, name: false });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <Card variant="elevated" className={`p-6 max-w-md mx-auto ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-green-400 text-sm font-medium">
              Welcome to the universe! Your star is falling to Earth...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            error={touched.name ? fieldErrors.name : undefined}
            label="Name"
            disabled={isLoading || success}
          />
        </div>

        <div>
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            error={touched.email ? fieldErrors.email : undefined}
            label="Email"
            disabled={isLoading || success}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isFormValid || isLoading || success}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Claiming your star...</span>
            </div>
          ) : success ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Star claimed!</span>
            </div>
          ) : (
            'Claim Your Star'
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Your email will be used to personalize your star experience.
          <br />
          We respect your privacy and won&apos;t spam you.
        </p>
      </div>
    </Card>
  );
};