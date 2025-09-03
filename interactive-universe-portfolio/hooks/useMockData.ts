import { useState, useEffect, useCallback } from 'react';
import { Star, Visitor, StarData } from '@/types';
import { mockStarsWithVisitors, getCurrentUserStar, convertToStarData } from '@/data/mockStars';
import { mockVisitors, getCurrentVisitor } from '@/data/mockVisitors';
import { generateMockDataset, convertStarToStarData, simulateStarUpdates } from '@/lib/mockDataGenerator';
import { useUserSession } from './useUserSession';

interface MockDataState {
  visitors: Visitor[];
  stars: Star[];
  currentUser: Visitor;
  currentUserStar: Star;
  isLoading: boolean;
  error: string | null;
  isReturningVisitor: boolean;
  sessionId: string | null;
}

interface MockDataActions {
  refreshData: () => void;
  updateCurrentUserStar: (updates: Partial<Star>) => void;
  addEmailToCurrentStar: (email: string, name?: string) => void;
  simulateRealTimeUpdates: () => void;
  getStarsForRendering: () => StarData[];
}

export function useMockData(): MockDataState & MockDataActions {
  const { 
    session, 
    isLoading: sessionLoading, 
    isReturningVisitor, 
    createSession, 
    addEmailToSession 
  } = useUserSession();
  
  const [state, setState] = useState<MockDataState>({
    visitors: [],
    stars: [],
    currentUser: getCurrentVisitor(),
    currentUserStar: getCurrentUserStar(),
    isLoading: true,
    error: null,
    isReturningVisitor: false,
    sessionId: null
  });

  // Initialize mock data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Wait for session to load
        if (sessionLoading) return;
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use predefined mock data
        const visitors = mockVisitors;
        let stars = mockStarsWithVisitors;
        let currentUser = getCurrentVisitor();
        let currentUserStar = getCurrentUserStar();
        
        // If we have a session, restore the user's star state
        if (session) {
          currentUserStar = {
            ...currentUserStar,
            id: session.starId,
            hasEmail: session.hasEmail,
            name: session.name,
          };
          
          // Update the star in the stars array
          stars = stars.map(star => 
            star.id === session.starId ? currentUserStar : star
          );
          
          // If session doesn't exist in stars array, add it
          if (!stars.find(star => star.id === session.starId)) {
            stars.push(currentUserStar);
          }
        } else {
          // Create new session for new visitor
          createSession(currentUserStar.id, `ip_${Math.random().toString(36).substr(2, 16)}`);
        }
        
        setState({
          visitors,
          stars,
          currentUser,
          currentUserStar,
          isLoading: false,
          error: null,
          isReturningVisitor,
          sessionId: session?.sessionId || null
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load mock data'
        }));
      }
    };

    initializeData();
  }, [session, sessionLoading, createSession]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        stars: simulateStarUpdates(prev.stars)
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshData = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Generate new random dataset
    const dataset = generateMockDataset(15, 'current-visitor');
    
    setState({
      visitors: [...mockVisitors, ...dataset.visitors],
      stars: [...mockStarsWithVisitors, ...dataset.stars],
      currentUser: getCurrentVisitor(),
      currentUserStar: getCurrentUserStar(),
      isLoading: false,
      error: null,
      isReturningVisitor: false,
      sessionId: null
    });
  }, []);

  const updateCurrentUserStar = useCallback((updates: Partial<Star>) => {
    setState(prev => {
      const updatedCurrentStar = { ...prev.currentUserStar, ...updates };
      const updatedStars = prev.stars.map(star => 
        star.id === prev.currentUserStar.id ? updatedCurrentStar : star
      );
      
      return {
        ...prev,
        currentUserStar: updatedCurrentStar,
        stars: updatedStars
      };
    });
  }, []);

  const addEmailToCurrentStar = useCallback((email: string, name?: string) => {
    const updates: Partial<Star> = {
      hasEmail: true,
      name: name || 'My Star',
      status: 'falling',
      targetLocation: {
        lat: state.currentUser.latitude || 37.7749,
        lon: state.currentUser.longitude || -122.4194
      }
    };
    
    // Update the star state
    updateCurrentUserStar(updates);
    
    // Update the session
    addEmailToSession(email, name || 'My Star');
    
    // Simulate star landing after falling animation
    setTimeout(() => {
      updateCurrentUserStar({ status: 'landed' });
    }, 3000);
  }, [state.currentUser, updateCurrentUserStar, addEmailToSession]);

  const simulateRealTimeUpdates = useCallback(() => {
    setState(prev => ({
      ...prev,
      stars: simulateStarUpdates(prev.stars)
    }));
  }, []);

  const getStarsForRendering = useCallback((): StarData[] => {
    return state.stars.map(star => 
      convertStarToStarData(star, star.id === state.currentUserStar.id)
    );
  }, [state.stars, state.currentUserStar.id]);

  return {
    ...state,
    refreshData,
    updateCurrentUserStar,
    addEmailToCurrentStar,
    simulateRealTimeUpdates,
    getStarsForRendering
  };
}

// Hook for getting just the star data for 3D rendering
export function useStarData() {
  const { stars, currentUserStar, isLoading } = useMockData();
  
  const starData = stars.map(star => 
    convertStarToStarData(star, star.id === currentUserStar.id)
  );
  
  return {
    stars: starData,
    isLoading,
    myStarId: currentUserStar.id
  };
}

// Hook for visitor statistics
export function useVisitorStats() {
  const { visitors, stars } = useMockData();
  
  const stats = {
    totalVisitors: visitors.length,
    activeStars: stars.filter(s => s.status === 'orbiting').length,
    landedStars: stars.filter(s => s.status === 'landed').length,
    fallingStars: stars.filter(s => s.status === 'falling').length,
    starsWithEmail: stars.filter(s => s.hasEmail).length,
    countries: [...new Set(visitors.map(v => v.country).filter(Boolean))].length
  };
  
  return stats;
}