'use client';

import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { StarData, REALISTIC_STAR_COLORS } from '@/types/star';
import { TwinklingStar } from './TwinklingStar';
import { StarLabelManager } from './StarLabel';

interface NavigationEffects {
  activeSection: string;
  scrollProgress: number;
  isScrolling: boolean;
  engagementLevel: number;
  starEngagementLevel: number;
  sectionEngagementColor: string;
  animationIntensity: number;
}

export interface StarManagerProps {
  initialStars?: StarData[];
  currentUserId?: string;
  showLabels?: boolean;
  labelDistance?: number;
  navigationEffects?: NavigationEffects;
  onStarCreated?: (star: StarData) => void;
  onStarUpdated?: (star: StarData) => void;
  onStarRemoved?: (starId: string) => void;
  onStarFell?: (starId: string, location: { lat: number; lon: number }) => void;
}

export interface StarManagerState {
  stars: Map<string, StarData>;
  ownedStarId?: string;
  lastUpdateTime: number;
}

/**
 * StarManager component handles all star lifecycle operations:
 * - Star creation, updating, and removal
 * - Star state management (orbiting, falling, landed)
 * - Star identification and ownership tracking
 * - Real-time synchronization of star states
 */
export const StarManager = forwardRef<StarManagerMethods, StarManagerProps>(({
  initialStars = [],
  currentUserId,
  showLabels = true,
  labelDistance = 12,
  navigationEffects,
  onStarCreated,
  onStarUpdated,
  onStarRemoved,
  onStarFell,
}, ref) => {
  const timeRef = useRef(0);
  const [starState, setStarState] = useState<StarManagerState>({
    stars: new Map(),
    ownedStarId: undefined,
    lastUpdateTime: Date.now(),
  });

  // Initialize stars from props
  useEffect(() => {
    if (initialStars.length > 0) {
      const starMap = new Map<string, StarData>();
      let ownedId: string | undefined;

      initialStars.forEach(star => {
        starMap.set(star.id, star);
        if (star.isOwned && currentUserId) {
          ownedId = star.id;
        }
      });

      setStarState(prev => ({
        ...prev,
        stars: starMap,
        ownedStarId: ownedId,
      }));
    }
  }, [initialStars, currentUserId]);

  // Create a new star
  const createStar = useCallback((starData: Partial<StarData> = {}): StarData => {
    const colors = Object.values(REALISTIC_STAR_COLORS);
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Generate orbital position
    const angle = Math.random() * Math.PI * 2;
    const radius = 3.5 + Math.random() * 1.0;
    const height = (Math.random() - 0.5) * 1.0;

    const newStar: StarData = {
      id: starData.id || `star-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      color: starData.color || randomColor,
      size: starData.size || (0.6 + Math.random() * 0.8),
      position: starData.position || [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ],
      status: starData.status || 'orbiting',
      orbitSpeed: starData.orbitSpeed || (0.08 + Math.random() * 0.15),
      isOwned: starData.isOwned || false,
      name: starData.name,
      twinkleSpeed: starData.twinkleSpeed || (0.5 + Math.random() * 2.0),
      baseIntensity: starData.baseIntensity || (0.4 + Math.random() * 0.5),
      targetLocation: starData.targetLocation,
    };

    setStarState(prev => {
      const newStars = new Map(prev.stars);
      newStars.set(newStar.id, newStar);
      
      return {
        ...prev,
        stars: newStars,
        ownedStarId: newStar.isOwned ? newStar.id : prev.ownedStarId,
        lastUpdateTime: Date.now(),
      };
    });

    onStarCreated?.(newStar);
    return newStar;
  }, [onStarCreated]);

  // Update an existing star
  const updateStar = useCallback((starId: string, updates: Partial<StarData>): boolean => {
    setStarState(prev => {
      const star = prev.stars.get(starId);
      if (!star) return prev;

      const updatedStar = { ...star, ...updates };
      const newStars = new Map(prev.stars);
      newStars.set(starId, updatedStar);

      // Handle star falling event
      if (star.status !== 'falling' && updatedStar.status === 'falling' && updatedStar.targetLocation) {
        onStarFell?.(starId, updatedStar.targetLocation);
      }

      onStarUpdated?.(updatedStar);

      return {
        ...prev,
        stars: newStars,
        lastUpdateTime: Date.now(),
      };
    });

    return true;
  }, [onStarUpdated, onStarFell]);

  // Remove a star
  const removeStar = useCallback((starId: string): boolean => {
    setStarState(prev => {
      if (!prev.stars.has(starId)) return prev;

      const newStars = new Map(prev.stars);
      newStars.delete(starId);

      onStarRemoved?.(starId);

      return {
        ...prev,
        stars: newStars,
        ownedStarId: prev.ownedStarId === starId ? undefined : prev.ownedStarId,
        lastUpdateTime: Date.now(),
      };
    });

    return true;
  }, [onStarRemoved]);

  // Get star by ID
  const getStar = useCallback((starId: string): StarData | undefined => {
    return starState.stars.get(starId);
  }, [starState.stars]);

  // Get all stars as array
  const getAllStars = useCallback((): StarData[] => {
    return Array.from(starState.stars.values());
  }, [starState.stars]);

  // Get owned star
  const getOwnedStar = useCallback((): StarData | undefined => {
    return starState.ownedStarId ? starState.stars.get(starState.ownedStarId) : undefined;
  }, [starState.stars, starState.ownedStarId]);

  // Get stars by status
  const getStarsByStatus = useCallback((status: StarData['status']): StarData[] => {
    return Array.from(starState.stars.values()).filter(star => star.status === status);
  }, [starState.stars]);

  // Set star as owned (for current user)
  const setStarAsOwned = useCallback((starId: string, name?: string): boolean => {
    return updateStar(starId, { isOwned: true, name });
  }, [updateStar]);

  // Make star fall to location
  const makeStarFall = useCallback((starId: string, targetLocation: { lat: number; lon: number }): boolean => {
    return updateStar(starId, { 
      status: 'falling', 
      targetLocation 
    });
  }, [updateStar]);

  // Land star at location
  const landStar = useCallback((starId: string): boolean => {
    const star = getStar(starId);
    if (!star || !star.targetLocation) return false;

    // Convert lat/lon to 3D position on Earth surface (simplified)
    const lat = (star.targetLocation.lat * Math.PI) / 180;
    const lon = (star.targetLocation.lon * Math.PI) / 180;
    const earthRadius = 2.5; // Match Earth component scale

    const x = earthRadius * Math.cos(lat) * Math.cos(lon);
    const y = earthRadius * Math.sin(lat);
    const z = earthRadius * Math.cos(lat) * Math.sin(lon);

    return updateStar(starId, {
      status: 'landed',
      position: [x, y, z],
      orbitSpeed: 0,
    });
  }, [getStar, updateStar]);

  // Clean up inactive stars (for performance)
  const cleanupInactiveStars = useCallback((_maxAge: number = 300000): number => { // 5 minutes
    // For demo purposes, we'll keep all stars
    // In real implementation, this would check last activity timestamp
    const removedCount = 0;

    // starState.stars.forEach((star, starId) => {
    //   // Don't remove owned stars or recently active stars
    //   if (star.isOwned) return;
    //   // Check timestamp and remove if too old
    // });

    return removedCount;
  }, []);

  // Update time for animations
  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime;
  });

  // Expose manager methods via ref (for parent components)
  useImperativeHandle(ref, () => ({
    createStar,
    updateStar,
    removeStar,
    getStar,
    getAllStars,
    getOwnedStar,
    getStarsByStatus,
    setStarAsOwned,
    makeStarFall,
    landStar,
    cleanupInactiveStars,
    getStarCount: () => starState.stars.size,
    getState: () => starState,
  }), [
    createStar,
    updateStar,
    removeStar,
    getStar,
    getAllStars,
    getOwnedStar,
    getStarsByStatus,
    setStarAsOwned,
    makeStarFall,
    landStar,
    cleanupInactiveStars,
    starState,
  ]);

  // Prepare star data for labels
  const starLabels = Array.from(starState.stars.values()).map(star => ({
    id: star.id,
    position: new Vector3(...star.position),
    name: star.name,
    isOwned: star.isOwned,
    color: star.color,
  }));

  return (
    <group name="star-manager">
      {/* Render all stars */}
      {Array.from(starState.stars.values()).map((star) => (
        <TwinklingStar
          key={star.id}
          star={star}
          time={timeRef.current}
          navigationEffects={navigationEffects}
          isCurrentUser={star.id === currentUserId}
        />
      ))}
      
      {/* Render star labels (only for owned stars) */}
      {showLabels && (
        <StarLabelManager
          stars={starLabels}
          maxDistance={labelDistance}
          className="star-label-premium"
        />
      )}
    </group>
  );
});

StarManager.displayName = 'StarManager';

// Export manager methods type for parent components
export type StarManagerMethods = {
  createStar: (starData?: Partial<StarData>) => StarData;
  updateStar: (starId: string, updates: Partial<StarData>) => boolean;
  removeStar: (starId: string) => boolean;
  getStar: (starId: string) => StarData | undefined;
  getAllStars: () => StarData[];
  getOwnedStar: () => StarData | undefined;
  getStarsByStatus: (status: StarData['status']) => StarData[];
  setStarAsOwned: (starId: string, name?: string) => boolean;
  makeStarFall: (starId: string, targetLocation: { lat: number; lon: number }) => boolean;
  landStar: (starId: string) => boolean;
  cleanupInactiveStars: (maxAge?: number) => number;
  getStarCount: () => number;
  getState: () => StarManagerState;
};

export default StarManager;