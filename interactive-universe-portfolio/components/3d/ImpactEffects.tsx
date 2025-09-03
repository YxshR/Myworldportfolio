'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh, MeshBasicMaterial } from 'three';

interface ImpactEffectsProps {
  position: Vector3;
  color: string;
  intensity?: number;
  duration?: number;
  onComplete?: () => void;
}

export const ImpactEffects: React.FC<ImpactEffectsProps> = ({
  position,
  color,
  intensity = 1.0,
  duration = 2.0,
  onComplete
}) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);
  const ringRef = useRef<Mesh>(null);
  const particlesRef = useRef<Mesh>(null);

  useEffect(() => {
    setStartTime(Date.now() / 1000);
  }, []);

  useFrame((state) => {
    if (!startTime || !isActive) return;

    const elapsed = state.clock.elapsedTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    if (progress >= 1) {
      setIsActive(false);
      onComplete?.();
      return;
    }

    // Animate expanding ring
    if (ringRef.current) {
      const scale = progress * 2;
      const opacity = (1 - progress) * intensity;
      ringRef.current.scale.setScalar(scale);
      if (ringRef.current.material && 'opacity' in ringRef.current.material) {
        (ringRef.current.material as MeshBasicMaterial).opacity = opacity;
      }
    }

    // Animate particles
    if (particlesRef.current) {
      const particleScale = 1 + progress * 0.5;
      const particleOpacity = (1 - progress) * intensity * 0.7;
      particlesRef.current.scale.setScalar(particleScale);
      if (particlesRef.current.material && 'opacity' in particlesRef.current.material) {
        (particlesRef.current.material as MeshBasicMaterial).opacity = particleOpacity;
      }
    }
  });

  if (!isActive) return null;

  return (
    <group position={position}>
      {/* Expanding ring effect */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.3, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={intensity}
        />
      </mesh>

      {/* Particle burst effect */}
      <group ref={particlesRef}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 0.2;
          const z = Math.sin(angle) * 0.2;
          
          return (
            <mesh key={i} position={[x, 0.1, z]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial 
                color={color} 
                transparent 
                opacity={intensity * 0.8}
              />
            </mesh>
          );
        })}
      </group>

      {/* Central glow */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={intensity * 0.6}
        />
      </mesh>
    </group>
  );
};

/**
 * Simple impact flash effect
 */
export const ImpactFlash: React.FC<ImpactEffectsProps> = ({
  position,
  color,
  intensity = 1.0,
  duration = 1.0,
  onComplete
}) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);
  const flashRef = useRef<Mesh>(null);

  useEffect(() => {
    setStartTime(Date.now() / 1000);
  }, []);

  useFrame((state) => {
    if (!startTime || !isActive) return;

    const elapsed = state.clock.elapsedTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    if (progress >= 1) {
      setIsActive(false);
      onComplete?.();
      return;
    }

    if (flashRef.current) {
      // Quick flash that fades out
      const opacity = Math.max(0, (1 - progress * 2) * intensity);
      const scale = 1 + progress * 3;
      
      flashRef.current.scale.setScalar(scale);
      if (flashRef.current.material && 'opacity' in flashRef.current.material) {
        (flashRef.current.material as MeshBasicMaterial).opacity = opacity;
      }
    }
  });

  if (!isActive) return null;

  return (
    <mesh ref={flashRef} position={position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={intensity}
      />
    </mesh>
  );
};