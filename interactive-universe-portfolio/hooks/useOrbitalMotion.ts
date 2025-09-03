import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

export interface OrbitalMotionConfig {
  radius: number;
  speed: number;
  inclination?: number; // Orbital inclination in radians
  eccentricity?: number; // Elliptical orbit (0 = circular, 0.9 = very elliptical)
  phaseOffset?: number; // Starting angle offset
  verticalAmplitude?: number; // Vertical oscillation amplitude
}

export interface OrbitalPosition {
  position: Vector3;
  velocity: Vector3;
  angle: number;
}

/**
 * Hook for calculating smooth orbital motion with elliptical orbits and variations
 */
export function useOrbitalMotion(config: OrbitalMotionConfig) {
  const {
    radius,
    speed,
    inclination = 0,
    eccentricity = 0,
    phaseOffset = 0,
    verticalAmplitude = 0.5
  } = config;

  const angleRef = useRef(phaseOffset);
  const positionRef = useRef(new Vector3());
  const velocityRef = useRef(new Vector3());
  const previousPositionRef = useRef(new Vector3());

  const calculatePosition = useCallback((angle: number): Vector3 => {
    // Calculate elliptical orbit
    const semiMajorAxis = radius;
    const semiMinorAxis = radius * Math.sqrt(1 - eccentricity * eccentricity);
    
    // Elliptical coordinates
    const x = semiMajorAxis * Math.cos(angle);
    const z = semiMinorAxis * Math.sin(angle);
    
    // Apply orbital inclination
    const inclinedX = x * Math.cos(inclination) - z * Math.sin(inclination);
    const inclinedZ = x * Math.sin(inclination) + z * Math.cos(inclination);
    
    // Add vertical oscillation for more natural movement
    const y = Math.sin(angle * 0.7 + phaseOffset) * verticalAmplitude;
    
    return new Vector3(inclinedX, y, inclinedZ);
  }, [radius, inclination, eccentricity, phaseOffset, verticalAmplitude]);

  const updateMotion = useCallback((delta: number) => {
    // Store previous position for velocity calculation
    previousPositionRef.current.copy(positionRef.current);
    
    // Update angle based on speed and delta time
    angleRef.current += speed * delta;
    
    // Calculate new position
    const newPosition = calculatePosition(angleRef.current);
    positionRef.current.copy(newPosition);
    
    // Calculate velocity (change in position over time)
    velocityRef.current.subVectors(positionRef.current, previousPositionRef.current);
    if (delta > 0) {
      velocityRef.current.divideScalar(delta);
    }
    
    return {
      position: positionRef.current.clone(),
      velocity: velocityRef.current.clone(),
      angle: angleRef.current
    };
  }, [speed, calculatePosition]);

  // Initialize position
  if (positionRef.current.length() === 0) {
    positionRef.current.copy(calculatePosition(angleRef.current));
    previousPositionRef.current.copy(positionRef.current);
  }

  return {
    updateMotion,
    getCurrentPosition: () => positionRef.current.clone(),
    getCurrentVelocity: () => velocityRef.current.clone(),
    getCurrentAngle: () => angleRef.current,
    resetAngle: (newAngle: number = phaseOffset) => {
      angleRef.current = newAngle;
    }
  };
}

/**
 * Hook that automatically updates orbital motion using useFrame
 */
export function useAutoOrbitalMotion(config: OrbitalMotionConfig) {
  const orbital = useOrbitalMotion(config);
  const currentState = useRef<OrbitalPosition>({
    position: new Vector3(),
    velocity: new Vector3(),
    angle: 0
  });

  useFrame((state, delta) => {
    const newState = orbital.updateMotion(delta);
    currentState.current = newState;
  });

  return {
    ...orbital,
    currentPosition: currentState.current.position,
    currentVelocity: currentState.current.velocity,
    currentAngle: currentState.current.angle
  };
}

/**
 * Generate orbital configuration with realistic variations
 */
export function generateOrbitalConfig(
  baseRadius: number = 4.5,
  baseSpeed: number = 0.1,
  starId: string = ''
): OrbitalMotionConfig {
  // Use star ID to generate consistent but varied parameters
  const seed = starId.length + starId.charCodeAt(0) || Math.random();
  const random1 = (Math.sin(seed * 12.9898) * 43758.5453) % 1;
  const random2 = (Math.sin(seed * 78.233) * 43758.5453) % 1;
  const random3 = (Math.sin(seed * 37.719) * 43758.5453) % 1;
  const random4 = (Math.sin(seed * 93.989) * 43758.5453) % 1;

  return {
    radius: baseRadius + (random1 - 0.5) * 2, // ±1 unit variation
    speed: baseSpeed + (random2 - 0.5) * 0.1, // ±0.05 speed variation
    inclination: (random3 - 0.5) * 0.5, // ±0.25 radian inclination
    eccentricity: Math.abs(random4) * 0.3, // 0-0.3 eccentricity
    phaseOffset: random1 * Math.PI * 2, // Random starting position
    verticalAmplitude: 0.3 + Math.abs(random2) * 0.4 // 0.3-0.7 vertical movement
  };
}