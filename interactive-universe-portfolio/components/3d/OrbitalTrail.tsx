'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Vector3, Float32BufferAttribute } from 'three';

interface OrbitalTrailProps {
  positions: Vector3[];
  color: string;
  opacity?: number;
  maxPoints?: number;
}

export const OrbitalTrail: React.FC<OrbitalTrailProps> = ({
  positions,
  color,
  opacity = 0.6,
  maxPoints = 50
}) => {
  const geometryRef = useRef<BufferGeometry>(null);
  const trailPositions = useRef<Vector3[]>([]);



  useFrame(() => {
    if (positions.length > 0) {
      // Add new position to trail
      const latestPosition = positions[positions.length - 1];
      if (latestPosition) {
        trailPositions.current.push(latestPosition.clone());
      }

      // Limit trail length
      if (trailPositions.current.length > maxPoints) {
        trailPositions.current.shift();
      }

      // Update geometry
      if (trailPositions.current.length > 1 && geometryRef.current) {
        const points = trailPositions.current.flatMap(pos => [pos.x, pos.y, pos.z]);
        geometryRef.current.setAttribute('position', new Float32BufferAttribute(points, 3));
        geometryRef.current.attributes.position.needsUpdate = true;
      }
    }
  });

  if (trailPositions.current.length < 2) {
    return null;
  }

  return (
    <line>
      <bufferGeometry ref={geometryRef} attach="geometry" />
      <lineBasicMaterial 
        color={color} 
        transparent 
        opacity={opacity}
        attach="material"
      />
    </line>
  );
};

/**
 * Simplified orbital trail using basic Line geometry for better performance
 */
export const SimpleOrbitalTrail: React.FC<OrbitalTrailProps> = ({
  positions,
  color,
  opacity = 0.4,
  maxPoints = 30
}) => {
  // For now, just use the main OrbitalTrail component
  return (
    <OrbitalTrail
      positions={positions}
      color={color}
      opacity={opacity}
      maxPoints={maxPoints}
    />
  );
};