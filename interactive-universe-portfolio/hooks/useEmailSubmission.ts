'use client';

import { useState, useCallback } from 'react';
import { validateForm, sanitizeInput } from '@/lib/validation';

export interface EmailSubmissionState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  isSubmitted: boolean;
}

export interface EmailSubmissionData {
  email: string;
  name: string;
}

export interface UseEmailSubmissionReturn {
  state: EmailSubmissionState;
  submitEmail: (email: string, name: string) => Promise<void>;
  resetState: () => void;
  clearError: () => void;
}

/**
 * Hook for managing email submission state and logic
 */
export const useEmailSubmission = (
  onSubmit: (email: string, name: string) => void | Promise<void>
): UseEmailSubmissionReturn => {
  const [state, setState] = useState<EmailSubmissionState>({
    isLoading: false,
    error: null,
    success: false,
    isSubmitted: false,
  });

  const submitEmail = useCallback(async (email: string, name: string) => {
    // Start loading state
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      success: false,
    }));

    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedName = sanitizeInput(name);

      // Validate form
      const errors = validateForm(sanitizedEmail, sanitizedName);
      if (Object.keys(errors).length > 0) {
        const errorMessage = Object.values(errors)[0];
        throw new Error(errorMessage);
      }

      // Call the onSubmit handler
      await onSubmit(sanitizedEmail, sanitizedName);

      // Success state
      setState(prev => ({
        ...prev,
        isLoading: false,
        success: true,
        isSubmitted: true,
        error: null,
      }));

    } catch (error) {
      // Error state
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        success: false,
      }));
    }
  }, [onSubmit]);

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      success: false,
      isSubmitted: false,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    state,
    submitEmail,
    resetState,
    clearError,
  };
};