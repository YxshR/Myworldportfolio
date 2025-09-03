import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, MathUtils } from 'three';

export interface FallingAnimationConfig {
  startPosition: Vector3;
  targetPosition: Vector3;
  duration: number; // Animation duration in seconds
  gravity?: number; // Gravity effect strength
  bounce?: boolean; // Whether star bounces on impact
  impactRadius?: number; // Radius for impact effects
}

export interface FallingState {
  position: Vector3;
  velocity: Vector3;
  progress: number; // 0 to 1
  isComplete: boolean;
  impactTime?: number;
}

/**
 * Hook for physics-based star falling animation
 */
export function useStarFalling(config: FallingAnimationConfig) {
  const {
    startPosition,
    targetPosition,
    duration,
    gravity = 9.8,
    bounce = false,
    impactRadius = 0.5
  } = config;

  const animationRef = useRef({
    startTime: 0,
    isAnimating: false,
    hasImpacted: false,
    bounceHeight: 0,
    bounceCount: 0
  });

  const stateRef = useRef<FallingState>({
    position: startPosition.clone(),
    velocity: new Vector3(),
    progress: 0,
    isComplete: false
  });

  const calculateTrajectory = useCallback((t: number): Vector3 => {
    // Normalize time (0 to 1)
    const normalizedTime = Math.min(t / duration, 1);
    
    // Calculate parabolic trajectory with gravity
    const startPos = startPosition;
    const endPos = targetPosition;
    
    // Linear interpolation for X and Z
    const x = MathUtils.lerp(startPos.x, endPos.x, normalizedTime);
    const z = MathUtils.lerp(startPos.z, endPos.z, normalizedTime);
    
    // Parabolic trajectory for Y with gravity effect
    const initialHeight = startPos.y;
    const finalHeight = endPos.y;
    const peakHeight = Math.max(initialHeight, finalHeight) + 2; // Add some height for arc
    
    // Quadratic interpolation for natural falling motion
    const heightProgress = normalizedTime;
    const y = initialHeight + 
              (peakHeight - initialHeight) * (1 - Math.pow(1 - heightProgress, 2)) +
              (finalHeight - peakHeight) * Math.pow(heightProgress, 2);
    
    return new Vector3(x, y, z);
  }, [startPosition, targetPosition, duration]);

  const calculateVelocity = useCallback((currentPos: Vector3, previousPos: Vector3, deltaTime: number): Vector3 => {
    if (deltaTime === 0) return new Vector3();
    
    return currentPos.clone().sub(previousPos).divideScalar(deltaTime);
  }, []);

  const startFalling = useCallback(() => {
    animationRef.current.startTime = Date.now() / 1000;
    animationRef.current.isAnimating = true;
    animationRef.current.hasImpacted = false;
    animationRef.current.bounceCount = 0;
    stateRef.current.isComplete = false;
    stateRef.current.progress = 0;
  }, []);

  const updateAnimation = useCallback((currentTime: number, deltaTime: number) => {
    if (!animationRef.current.isAnimating) return stateRef.current;

    const elapsedTime = currentTime - animationRef.current.startTime;
    const previousPosition = stateRef.current.position.clone();
    
    if (elapsedTime >= duration && !animationRef.current.hasImpacted) {
      // Animation complete - star has landed
      stateRef.current.position.copy(targetPosition);
      stateRef.current.progress = 1;
      stateRef.current.isComplete = true;
      stateRef.current.impactTime = currentTime;
      animationRef.current.hasImpacted = true;
      animationRef.current.isAnimating = false;
      
      // Calculate final velocity for impact effects
      stateRef.current.velocity = calculateVelocity(
        stateRef.current.position,
        previousPosition,
        deltaTime
      );
    } else if (elapsedTime < duration) {
      // Calculate current position along trajectory
      const newPosition = calculateTrajectory(elapsedTime);
      stateRef.current.position.copy(newPosition);
      stateRef.current.progress = elapsedTime / duration;
      
      // Calculate velocity
      stateRef.current.velocity = calculateVelocity(
        newPosition,
        previousPosition,
        deltaTime
      );
    }

    // Handle bounce effect if enabled
    if (bounce && animationRef.current.hasImpacted && animationRef.current.bounceCount < 2) {
      const timeSinceImpact = currentTime - (stateRef.current.impactTime || 0);
      const bounceHeight = Math.max(0, 0.5 * Math.sin(timeSinceImpact * 10) * Math.exp(-timeSinceImpact * 3));
      
      if (bounceHeight > 0.01) {
        stateRef.current.position.y = targetPosition.y + bounceHeight;
      } else {
        animationRef.current.bounceCount++;
        if (animationRef.current.bounceCount >= 2) {
          stateRef.current.position.copy(targetPosition);
        }
      }
    }

    return stateRef.current;
  }, [duration, targetPosition, bounce, calculateTrajectory, calculateVelocity]);

  const reset = useCallback(() => {
    animationRef.current.isAnimating = false;
    animationRef.current.hasImpacted = false;
    animationRef.current.bounceCount = 0;
    stateRef.current.position.copy(startPosition);
    stateRef.current.velocity.set(0, 0, 0);
    stateRef.current.progress = 0;
    stateRef.current.isComplete = false;
    stateRef.current.impactTime = undefined;
  }, [startPosition]);

  return {
    startFalling,
    updateAnimation,
    reset,
    getCurrentState: () => ({ ...stateRef.current }),
    isAnimating: () => animationRef.current.isAnimating,
    hasImpacted: () => animationRef.current.hasImpacted,
    getImpactRadius: () => impactRadius
  };
}

/**
 * Hook that automatically updates falling animation using useFrame
 */
export function useAutoStarFalling(config: FallingAnimationConfig) {
  const falling = useStarFalling(config);
  const currentState = useRef<FallingState>({
    position: config.startPosition.clone(),
    velocity: new Vector3(),
    progress: 0,
    isComplete: false
  });

  useFrame((state, delta) => {
    const newState = falling.updateAnimation(state.clock.elapsedTime, delta);
    currentState.current = newState;
  });

  return {
    ...falling,
    currentState: currentState.current
  };
}

/**
 * Calculate Earth surface position from latitude/longitude
 */
export function latLonToVector3(lat: number, lon: number, radius: number = 2.5): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new Vector3(x, y, z);
}

/**
 * Generate falling animation config for a star landing at specific coordinates
 */
export function createFallingConfig(
  startPosition: Vector3,
  targetLat: number,
  targetLon: number,
  earthRadius: number = 2.5,
  animationDuration: number = 3.0
): FallingAnimationConfig {
  const targetPosition = latLonToVector3(targetLat, targetLon, earthRadius);
  
  return {
    startPosition,
    targetPosition,
    duration: animationDuration,
    gravity: 9.8,
    bounce: true,
    impactRadius: 0.3
  };
}