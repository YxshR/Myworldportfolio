import { useState, useEffect, useCallback, useRef } from 'react';
import { Star } from '@/types';
import { StarData } from '@/types/star';
import { mockStarsWithVisitors, getCurrentUserStar, convertToStarData } from '@/data/mockStars';
import { simulateStarUpdates, convertStarToStarData } from '@/lib/mockDataGenerator';

interface StarStateConfig {
  enableRealTimeUpdates?: boolean;
  updateInterval?: number;
  maxStars?: number;
  autoCleanup?: boolean;
}

interface StarState {
  allStars: Star[];
  currentUserStar: Star;
  visibleStars: StarData[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date;
}

interface StarStateActions {
  updateStar: (starId: string, updates: Partial<Star>) => void;
  updateCurrentUserStar: (updates: Partial<Star>) => void;
  addStar: (star: Star) => void;
  removeStar: (starId: string) => void;
  refreshStars: () => void;
  simulateRealTime: () => void;
  getStarById: (starId: string) => Star | undefined;
  getVisibleStarsForRendering: () => StarData[];
  resetState: () => void;
}

export function useStarState(config: StarStateConfig = {}): StarState & StarStateActions {
  const {
    enableRealTimeUpdates = true,
    updateInterval = 3000,
    maxStars = 50,
    autoCleanup = true
  } = config;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [state, setState] = useState<StarState>({
    allStars: [],
    currentUserStar: getCurrentUserStar(),
    visibleStars: [],
    isLoading: true,
    error: null,
    lastUpdate: new Date()
  });

  // Initialize star state
  useEffect(() => {
    const initializeStars = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const allStars = mockStarsWithVisitors.slice(0, maxStars);
        const currentUserStar = getCurrentUserStar();
        
        // Convert to StarData for rendering
        const visibleStars = allStars.map(star => 
          convertStarToStarData(star, star.id === currentUserStar.id)
        );
        
        setState({
          allStars,
          currentUserStar,
          visibleStars,
          isLoading: false,
          error: null,
          lastUpdate: new Date()
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to initialize stars'
        }));
      }
    };

    initializeStars();
  }, [maxStars]);

  // Set up real-time updates
  useEffect(() => {
    if (!enableRealTimeUpdates) return;

    intervalRef.current = setInterval(() => {
      setState(prev => {
        const updatedStars = simulateStarUpdates(prev.allStars);
        const visibleStars = updatedStars.map(star => 
          convertStarToStarData(star, star.id === prev.currentUserStar.id)
        );
        
        return {
          ...prev,
          allStars: updatedStars,
          visibleStars,
          lastUpdate: new Date()
        };
      });
    }, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enableRealTimeUpdates, updateInterval]);

  // Auto cleanup old stars
  useEffect(() => {
    if (!autoCleanup) return;

    const cleanupInterval = setInterval(() => {
      setState(prev => {
        const now = new Date();
        const maxAge = 30 * 60 * 1000; // 30 minutes
        
        const filteredStars = prev.allStars.filter(star => {
          // Keep current user's star and recently active stars
          if (star.id === prev.currentUserStar.id) return true;
          
          // For mock data, we don't have lastSeen, so keep all for now
          return true;
        });
        
        if (filteredStars.length !== prev.allStars.length) {
          const visibleStars = filteredStars.map(star => 
            convertStarToStarData(star, star.id === prev.currentUserStar.id)
          );
          
          return {
            ...prev,
            allStars: filteredStars,
            visibleStars,
            lastUpdate: now
          };
        }
        
        return prev;
      });
    }, 60000); // Check every minute

    return () => clearInterval(cleanupInterval);
  }, [autoCleanup]);

  const updateStar = useCallback((starId: string, updates: Partial<Star>) => {
    setState(prev => {
      const updatedStars = prev.allStars.map(star => 
        star.id === starId ? { ...star, ...updates } : star
      );
      
      const visibleStars = updatedStars.map(star => 
        convertStarToStarData(star, star.id === prev.currentUserStar.id)
      );
      
      return {
        ...prev,
        allStars: updatedStars,
        visibleStars,
        lastUpdate: new Date()
      };
    });
  }, []);

  const updateCurrentUserStar = useCallback((updates: Partial<Star>) => {
    setState(prev => {
      const updatedCurrentStar = { ...prev.currentUserStar, ...updates };
      const updatedStars = prev.allStars.map(star => 
        star.id === prev.currentUserStar.id ? updatedCurrentStar : star
      );
      
      const visibleStars = updatedStars.map(star => 
        convertStarToStarData(star, star.id === updatedCurrentStar.id)
      );
      
      return {
        ...prev,
        currentUserStar: updatedCurrentStar,
        allStars: updatedStars,
        visibleStars,
        lastUpdate: new Date()
      };
    });
  }, []);

  const addStar = useCallback((star: Star) => {
    setState(prev => {
      const updatedStars = [...prev.allStars, star];
      const visibleStars = updatedStars.map(s => 
        convertStarToStarData(s, s.id === prev.currentUserStar.id)
      );
      
      return {
        ...prev,
        allStars: updatedStars,
        visibleStars,
        lastUpdate: new Date()
      };
    });
  }, []);

  const removeStar = useCallback((starId: string) => {
    setState(prev => {
      const updatedStars = prev.allStars.filter(star => star.id !== starId);
      const visibleStars = updatedStars.map(star => 
        convertStarToStarData(star, star.id === prev.currentUserStar.id)
      );
      
      return {
        ...prev,
        allStars: updatedStars,
        visibleStars,
        lastUpdate: new Date()
      };
    });
  }, []);

  const refreshStars = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate refresh delay
    setTimeout(() => {
      const allStars = mockStarsWithVisitors.slice(0, maxStars);
      const visibleStars = allStars.map(star => 
        convertStarToStarData(star, star.id === state.currentUserStar.id)
      );
      
      setState(prev => ({
        ...prev,
        allStars,
        visibleStars,
        isLoading: false,
        lastUpdate: new Date()
      }));
    }, 1000);
  }, [maxStars, state.currentUserStar.id]);

  const simulateRealTime = useCallback(() => {
    setState(prev => {
      const updatedStars = simulateStarUpdates(prev.allStars);
      const visibleStars = updatedStars.map(star => 
        convertStarToStarData(star, star.id === prev.currentUserStar.id)
      );
      
      return {
        ...prev,
        allStars: updatedStars,
        visibleStars,
        lastUpdate: new Date()
      };
    });
  }, []);

  const getStarById = useCallback((starId: string): Star | undefined => {
    return state.allStars.find(star => star.id === starId);
  }, [state.allStars]);

  const getVisibleStarsForRendering = useCallback((): StarData[] => {
    return state.visibleStars;
  }, [state.visibleStars]);

  const resetState = useCallback(() => {
    setState({
      allStars: [],
      currentUserStar: getCurrentUserStar(),
      visibleStars: [],
      isLoading: true,
      error: null,
      lastUpdate: new Date()
    });
  }, []);

  return {
    ...state,
    updateStar,
    updateCurrentUserStar,
    addStar,
    removeStar,
    refreshStars,
    simulateRealTime,
    getStarById,
    getVisibleStarsForRendering,
    resetState
  };
}

// Specialized hook for current user's star management
export function useCurrentUserStar() {
  const {
    currentUserStar,
    updateCurrentUserStar,
    isLoading
  } = useStarState({ enableRealTimeUpdates: false });

  const addEmail = useCallback((email: string, name?: string) => {
    updateCurrentUserStar({
      hasEmail: true,
      name: name || 'My Star',
      status: 'falling'
    });

    // Simulate landing after falling animation
    setTimeout(() => {
      updateCurrentUserStar({ status: 'landed' });
    }, 3000);
  }, [updateCurrentUserStar]);

  const makeStarFall = useCallback((targetLocation: { lat: number; lon: number }) => {
    updateCurrentUserStar({
      status: 'falling',
      targetLocation
    });
  }, [updateCurrentUserStar]);

  const landStar = useCallback((position?: [number, number, number]) => {
    updateCurrentUserStar({
      status: 'landed',
      position: position || currentUserStar.position
    });
  }, [updateCurrentUserStar, currentUserStar.position]);

  return {
    star: currentUserStar,
    isLoading,
    addEmail,
    makeStarFall,
    landStar,
    updateStar: updateCurrentUserStar
  };
}

// Hook for star lifecycle events
export function useStarLifecycle() {
  const { allStars, updateStar } = useStarState();

  const handleStarCreated = useCallback((star: Star) => {
    console.log('Star created:', star);
    // Additional logic for star creation
  }, []);

  const handleStarFalling = useCallback((starId: string, targetLocation: { lat: number; lon: number }) => {
    updateStar(starId, {
      status: 'falling',
      targetLocation
    });
    
    // Simulate landing after animation
    setTimeout(() => {
      updateStar(starId, { status: 'landed' });
    }, 3000);
  }, [updateStar]);

  const handleStarLanded = useCallback((starId: string, position: [number, number, number]) => {
    updateStar(starId, {
      status: 'landed',
      position
    });
  }, [updateStar]);

  const handleStarDisconnected = useCallback((starId: string) => {
    // In a real app, this would remove the star
    console.log('Star disconnected:', starId);
  }, []);

  return {
    stars: allStars,
    onStarCreated: handleStarCreated,
    onStarFalling: handleStarFalling,
    onStarLanded: handleStarLanded,
    onStarDisconnected: handleStarDisconnected
  };
}