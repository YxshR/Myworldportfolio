'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Color, AmbientLight, DirectionalLight } from 'three';

interface UniverseNavigationEffectsProps {
  activeSection: string;
  scrollProgress: number;
  isScrolling: boolean;
  animationIntensity: number;
  engagementLevel: number;
}

export const UniverseNavigationEffects: React.FC<UniverseNavigationEffectsProps> = ({
  activeSection,
  scrollProgress,
  isScrolling,
  animationIntensity,
  engagementLevel
}) => {
  const effectsGroupRef = useRef<Group>(null);
  const ambientLightRef = useRef<AmbientLight>(null);
  const directionalLightRef = useRef<DirectionalLight>(null);

  // Section-based color themes
  const getSectionColor = (section: string): Color => {
    const colors = {
      home: new Color('#4a9eff'),      // Blue
      about: new Color('#d4af37'),     // Gold
      projects: new Color('#c0c0c0'),  // Silver
      skills: new Color('#ff6b6b'),    // Red
      contact: new Color('#4ecdc4')    // Teal
    };
    return colors[section as keyof typeof colors] || colors.home;
  };

  // Update lighting based on navigation
  useFrame((state) => {
    if (!effectsGroupRef.current) return;

    const time = state.clock.getElapsedTime();
    const sectionColor = getSectionColor(activeSection);

    // Ambient light intensity based on engagement
    if (ambientLightRef.current) {
      const baseIntensity = 0.3;
      const engagementBonus = engagementLevel * 0.2;
      const scrollBonus = isScrolling ? 0.1 : 0;
      
      ambientLightRef.current.intensity = baseIntensity + engagementBonus + scrollBonus;
      
      // Subtle color tinting based on active section
      ambientLightRef.current.color.lerp(sectionColor, 0.1 * animationIntensity);
    }

    // Directional light effects
    if (directionalLightRef.current) {
      const baseIntensity = 1.0;
      const pulseEffect = Math.sin(time * 2) * 0.1 * animationIntensity;
      const sectionBonus = activeSection !== 'home' ? 0.2 : 0;
      
      directionalLightRef.current.intensity = baseIntensity + pulseEffect + sectionBonus;
      
      // Rotate light based on scroll progress
      const rotationY = scrollProgress * Math.PI * 0.5;
      directionalLightRef.current.position.x = Math.cos(rotationY) * 5;
      directionalLightRef.current.position.z = Math.sin(rotationY) * 5;
    }

    // Group rotation for subtle universe movement
    if (isScrolling) {
      effectsGroupRef.current.rotation.y += 0.001 * animationIntensity;
    }
  });

  return (
    <group ref={effectsGroupRef}>
      {/* Enhanced ambient lighting */}
      <ambientLight
        ref={ambientLightRef}
        intensity={0.3}
        color="#ffffff"
      />
      
      {/* Dynamic directional light */}
      <directionalLight
        ref={directionalLightRef}
        position={[5, 3, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Section-specific accent lights */}
      {activeSection !== 'home' && (
        <pointLight
          position={[0, 0, 8]}
          color={getSectionColor(activeSection)}
          intensity={0.5 * animationIntensity}
          distance={20}
          decay={1}
        />
      )}
      
      {/* Scrolling particle effects */}
      {isScrolling && (
        <group>
          {Array.from({ length: 12 }).map((_, i) => (
            <pointLight
              key={i}
              position={[
                Math.cos((i / 12) * Math.PI * 2) * 15,
                Math.sin((i / 12) * Math.PI * 2) * 15,
                Math.sin(i) * 5
              ]}
              color={getSectionColor(activeSection)}
              intensity={0.1 * animationIntensity}
              distance={10}
              decay={2}
            />
          ))}
        </group>
      )}
      
      {/* High engagement cosmic effects */}
      {engagementLevel > 0.8 && (
        <group>
          {/* Cosmic ring effect */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[12, 12.5, 32]} />
            <meshBasicMaterial
              color={getSectionColor(activeSection)}
              transparent
              opacity={0.1 * animationIntensity}
              side={2}
            />
          </mesh>
          
          {/* Outer cosmic ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[18, 18.5, 32]} />
            <meshBasicMaterial
              color={getSectionColor(activeSection)}
              transparent
              opacity={0.05 * animationIntensity}
              side={2}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};