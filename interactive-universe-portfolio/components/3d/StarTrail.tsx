'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface StarTrailProps {
  orbitRadius: number;
  color: string;
  opacity?: number;
}

export const StarTrail: React.FC<StarTrailProps> = ({ 
  orbitRadius, 
  color, 
  opacity = 0.03 
}) => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation to make trail feel alive
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.002;
    }
  });
  
  // Create a simple ring of small spheres to represent the orbital trail
  const trailElements = [];
  const segments = 32;
  
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    const y = Math.sin(angle * 0.3) * 0.1;
    
    trailElements.push(
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={opacity * (1 - i / segments)} // Fade out along the trail
        />
      </mesh>
    );
  }
  
  return (
    <group ref={groupRef}>
      {trailElements}
    </group>
  );
};