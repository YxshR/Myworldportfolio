'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserSession {
  sessionId: string;
  ipHash: string;
  starId: string;
  hasEmail: boolean;
  name?: string;
  email?: string;
  createdAt: Date;
  lastSeen: Date;
  visitCount: number;
}

export interface UseUserSessionReturn {
  session: UserSession | null;
  isLoading: boolean;
  isReturningVisitor: boolean;
  createSession: (starId: string, ipHash: string) => UserSession;
  updateSession: (updates: Partial<UserSession>) => void;
  addEmailToSession: (email: string, name: string) => void;
  clearSession: () => void;
  getSessionData: () => UserSession | null;
}

const SESSION_STORAGE_KEY = 'universe_portfolio_session';
const SESSION_EXPIRY_DAYS = 30;

/**
 * Generates a unique session ID
 */
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generates a mock IP hash for demo purposes
 */
const generateMockIpHash = (): string => {
  // In a real implementation, this would be generated server-side from the actual IP
  return `ip_${Math.random().toString(36).substr(2, 16)}`;
};

/**
 * Checks if a session has expired
 */
const isSessionExpired = (session: UserSession): boolean => {
  const expiryDate = new Date(session.lastSeen);
  expiryDate.setDate(expiryDate.getDate() + SESSION_EXPIRY_DAYS);
  return new Date() > expiryDate;
};

/**
 * Hook for managing user session state and persistence
 */
export const useUserSession = (): UseUserSessionReturn => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
        if (storedSession) {
          const parsedSession: UserSession = JSON.parse(storedSession);
          
          // Convert date strings back to Date objects
          parsedSession.createdAt = new Date(parsedSession.createdAt);
          parsedSession.lastSeen = new Date(parsedSession.lastSeen);
          
          // Check if session has expired
          if (isSessionExpired(parsedSession)) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            setSession(null);
            setIsReturningVisitor(false);
          } else {
            // Update last seen and visit count
            parsedSession.lastSeen = new Date();
            parsedSession.visitCount += 1;
            
            setSession(parsedSession);
            setIsReturningVisitor(true);
            
            // Save updated session back to localStorage
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(parsedSession));
          }
        }
      } catch (error) {
        console.error('Error loading session from localStorage:', error);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (session) {
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } catch (error) {
        console.error('Error saving session to localStorage:', error);
      }
    }
  }, [session]);

  const createSession = useCallback((starId: string, ipHash?: string): UserSession => {
    const newSession: UserSession = {
      sessionId: generateSessionId(),
      ipHash: ipHash || generateMockIpHash(),
      starId,
      hasEmail: false,
      createdAt: new Date(),
      lastSeen: new Date(),
      visitCount: 1,
    };

    setSession(newSession);
    setIsReturningVisitor(false);
    return newSession;
  }, []);

  const updateSession = useCallback((updates: Partial<UserSession>) => {
    setSession(prevSession => {
      if (!prevSession) return null;
      
      const updatedSession = {
        ...prevSession,
        ...updates,
        lastSeen: new Date(),
      };
      
      return updatedSession;
    });
  }, []);

  const addEmailToSession = useCallback((email: string, name: string) => {
    updateSession({
      email,
      name,
      hasEmail: true,
    });
  }, [updateSession]);

  const clearSession = useCallback(() => {
    setSession(null);
    setIsReturningVisitor(false);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing session from localStorage:', error);
    }
  }, []);

  const getSessionData = useCallback((): UserSession | null => {
    return session;
  }, [session]);

  return {
    session,
    isLoading,
    isReturningVisitor,
    createSession,
    updateSession,
    addEmailToSession,
    clearSession,
    getSessionData,
  };
};