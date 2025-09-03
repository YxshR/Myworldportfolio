'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointLight, Group } from 'three';
import { StarData } from '@/types';

interface StarEngagementEffectsProps {
  star: StarData;
  engagementLevel: number;
  isCurrentUser: boolean;
  sectionEngagementColor: string;
  animationIntensity: number;
}

export const StarEngagementEffects: React.FC<StarEngagementEffectsProps> = ({
  star,
  engagementLevel,
  isCurrentUser,
  sectionEngagementColor,
  animationIntensity
}) => {
  const groupRef = useRef<Group>(null);
  const lightRef = useRef<PointLight>(null);
  const pulseRef = useRef<number>(0);

  // Update star appearance based on engagement
  useFrame((state) => {
    if (!groupRef.current || !lightRef.current) return;

    const time = state.clock.getElapsedTime();
    pulseRef.current += 0.02 * animationIntensity;

    // Enhanced brightness for engaged users
    const baseBrightness = isCurrentUser ? 1.2 : 0.8;
    const engagementBonus = engagementLevel * 0.5;
    const pulseEffect = Math.sin(pulseRef.current) * 0.2 * animationIntensity;
    
    const finalBrightness = baseBrightness + engagementBonus + pulseEffect;
    lightRef.current.intensity = Math.max(0.3, finalBrightness);

    // Scale effect based on engagement
    const baseScale = isCurrentUser ? 1.2 : 1.0;
    const engagementScale = 1 + (engagementLevel * 0.3);
    const pulseScale = 1 + (Math.sin(time * 2) * 0.1 * animationIntensity);
    
    const finalScale = baseScale * engagementScale * pulseScale;
    groupRef.current.scale.setScalar(finalScale);

    // Subtle rotation for current user's star
    if (isCurrentUser) {
      groupRef.current.rotation.y += 0.01 * animationIntensity;
    }
  });

  // Update color based on section engagement
  useEffect(() => {
    if (lightRef.current && isCurrentUser) {
      lightRef.current.color.setHex(parseInt(sectionEngagementColor.replace('#', ''), 16));
    }
  }, [sectionEngagementColor, isCurrentUser]);

  return (
    <group ref={groupRef} position={star.position}>
      {/* Main star light */}
      <pointLight
        ref={lightRef}
        color={isCurrentUser ? sectionEngagementColor : star.color}
        intensity={isCurrentUser ? 1.2 : 0.8}
        distance={15}
        decay={2}
      />
      
      {/* Engagement glow effect for current user */}
      {isCurrentUser && engagementLevel > 0.3 && (
        <pointLight
          color={sectionEngagementColor}
          intensity={engagementLevel * 0.5}
          distance={25}
          decay={1}
        />
      )}
      
      {/* High engagement particle effect */}
      {isCurrentUser && engagementLevel > 0.7 && (
        <group>
          {Array.from({ length: 6 }).map((_, i) => (
            <pointLight
              key={i}
              position={[
                Math.cos((i / 6) * Math.PI * 2) * 0.5,
                Math.sin((i / 6) * Math.PI * 2) * 0.5,
                0
              ]}
              color={sectionEngagementColor}
              intensity={0.3 * animationIntensity}
              distance={8}
              decay={3}
            />
          ))}
        </group>
      )}
      
      {/* Visual star mesh */}
      <mesh>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial 
          color={isCurrentUser ? sectionEngagementColor : star.color}
          transparent
          opacity={0.8 + (engagementLevel * 0.2)}
        />
      </mesh>
      
      {/* Engagement ring effect */}
      {isCurrentUser && engagementLevel > 0.5 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.35, 16]} />
          <meshBasicMaterial
            color={sectionEngagementColor}
            transparent
            opacity={engagementLevel * 0.3}
            side={2}
          />
        </mesh>
      )}
    </group>
  );
};