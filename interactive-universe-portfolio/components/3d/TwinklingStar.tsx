'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointLight, Vector3 } from 'three';
import { TwinklingStarProps } from '@/types/star';
import { StarEngagementEffects } from './StarEngagementEffects';
import { useOrbitalMotion, generateOrbitalConfig } from '@/hooks/useOrbitalMotion';
import { useStarFalling, createFallingConfig } from '@/hooks/useStarFalling';
import { SimpleOrbitalTrail } from './OrbitalTrail';
import { ImpactFlash } from './ImpactEffects';

export const TwinklingStar: React.FC<TwinklingStarProps> = ({ 
  star, 
  time, 
  navigationEffects,
  isCurrentUser = false 
}) => {
  const lightRef = useRef<PointLight>(null);
  const [intensity, setIntensity] = useState(star.baseIntensity);
  const [trailPositions, setTrailPositions] = useState<Vector3[]>([]);
  const [showImpact, setShowImpact] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(new Vector3(...star.position));

  // Generate orbital configuration for this star
  const orbitalConfig = generateOrbitalConfig(3.5, star.orbitSpeed, star.id);
  const orbital = useOrbitalMotion(orbitalConfig);

  // Set up falling animation (always create, but only use when needed)
  const fallingConfig = createFallingConfig(
    currentPosition,
    star.targetLocation?.lat || 0,
    star.targetLocation?.lon || 0,
    2.5, // Earth radius
    3.0  // Animation duration
  );

  const falling = useStarFalling(fallingConfig);

  // Start falling animation when star status changes to falling
  useEffect(() => {
    if (star.status === 'falling') {
      falling.startFalling();
    }
  }, [star.status, falling]);

  useFrame((state, delta) => {
    if (lightRef.current) {
      // Random twinkling effect with natural variations
      const twinkle = Math.sin(time * star.twinkleSpeed + star.id.length) * 0.3 +
                     Math.sin(time * star.twinkleSpeed * 1.7 + star.id.length * 2) * 0.2;
      setIntensity(star.baseIntensity + twinkle);
      
      if (star.status === 'orbiting') {
        // Use sophisticated orbital motion
        const motionState = orbital.updateMotion(delta);
        lightRef.current.position.copy(motionState.position);
        setCurrentPosition(motionState.position.clone());
        
        // Update trail positions for orbital trail effect
        setTrailPositions(prev => {
          const newPositions = [...prev, motionState.position.clone()];
          // Keep only last 30 positions for performance
          return newPositions.slice(-30);
        });
      } else if (star.status === 'falling') {
        // Use falling animation
        const fallingState = falling.updateAnimation(state.clock.elapsedTime, delta);
        lightRef.current.position.copy(fallingState.position);
        setCurrentPosition(fallingState.position.clone());
        
        // Show impact effect when star lands
        if (fallingState.isComplete && !showImpact) {
          setShowImpact(true);
        }
      } else {
        // Use fixed position for landed stars
        lightRef.current.position.set(...star.position);
        setCurrentPosition(new Vector3(...star.position));
      }
    }
  });

  return (
    <group>
      {/* Orbital trail for orbiting stars */}
      {star.status === 'orbiting' && trailPositions.length > 1 && (
        <SimpleOrbitalTrail
          positions={trailPositions}
          color={star.color}
          opacity={0.3}
          maxPoints={25}
        />
      )}
      
      {/* Impact effect when star lands */}
      {showImpact && (
        <ImpactFlash
          position={currentPosition}
          color={star.color}
          intensity={0.8}
          duration={1.5}
          onComplete={() => setShowImpact(false)}
        />
      )}
      
      <pointLight 
        ref={lightRef}
        position={star.position}
        color={star.color}
        intensity={intensity}
        distance={15}
        decay={2}
      />
      
      {/* Core star sprite */}
      <sprite 
        position={star.status === 'orbiting' ? [0, 0, 0] : star.position} 
        scale={[star.size * 0.15, star.size * 0.15, star.size * 0.15]}
      >
        <spriteMaterial 
          color={star.color} 
          transparent 
          opacity={intensity * 0.9}
          sizeAttenuation={false}
        />
      </sprite>
      
      {/* Outer glow */}
      <sprite 
        position={star.status === 'orbiting' ? [0, 0, 0] : star.position}
        scale={[star.size * 0.3, star.size * 0.3, star.size * 0.3]}
      >
        <spriteMaterial 
          color={star.color} 
          transparent 
          opacity={intensity * 0.4}
          sizeAttenuation={false}
        />
      </sprite>
      
      {/* Navigation-based engagement effects */}
      {navigationEffects && (
        <StarEngagementEffects
          star={star}
          engagementLevel={navigationEffects.starEngagementLevel}
          isCurrentUser={isCurrentUser}
          sectionEngagementColor={navigationEffects.sectionEngagementColor}
          animationIntensity={navigationEffects.animationIntensity}
        />
      )}
    </group>
  );
};