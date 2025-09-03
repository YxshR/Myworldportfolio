'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Html } from '@react-three/drei';

export interface StarLabelProps {
  position: Vector3 | [number, number, number];
  name: string;
  isVisible: boolean;
  isOwned: boolean;
  color?: string;
  distance?: number;
  className?: string;
}

/**
 * StarLabel component creates HTML overlay labels for 3D stars
 * - Only shows names for owned stars
 * - Positions labels relative to 3D star positions
 * - Elegant typography and styling
 * - Automatic visibility management based on distance and ownership
 */
export const StarLabel: React.FC<StarLabelProps> = ({
  position,
  name,
  isVisible,
  isOwned,
  color = '#ffffff',
  distance = 10,
  className = '',
}) => {
  const labelRef = useRef<HTMLDivElement>(null);
  const [shouldShow, setShouldShow] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const { camera } = useThree();

  // Convert position to Vector3 if it's an array
  const pos = Array.isArray(position) ? new Vector3(...position) : position;

  useFrame(() => {
    if (!isVisible || !isOwned) {
      setShouldShow(false);
      setOpacity(0);
      return;
    }

    // Calculate distance from camera to star
    const distanceToCamera = camera.position.distanceTo(pos);
    
    // Show label only if star is close enough and owned
    const shouldDisplay = distanceToCamera < distance && isOwned;
    setShouldShow(shouldDisplay);

    // Fade in/out based on distance
    if (shouldDisplay) {
      const fadeDistance = distance * 0.8;
      const fadeOpacity = distanceToCamera < fadeDistance 
        ? 1.0 
        : Math.max(0, 1.0 - (distanceToCamera - fadeDistance) / (distance - fadeDistance));
      setOpacity(fadeOpacity);
    } else {
      setOpacity(0);
    }
  });

  if (!shouldShow || !isOwned || !name) {
    return null;
  }

  return (
    <Html
      position={pos}
      center
      distanceFactor={8}
      occlude
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div
        ref={labelRef}
        className={`star-label ${className}`}
        style={{
          opacity,
          transition: 'opacity 0.3s ease-in-out',
          transform: 'translate(-50%, -100%)',
          marginBottom: '20px',
        }}
      >
        <div className="star-label-content">
          <div className="star-label-name">
            {name}
          </div>
          <div className="star-label-indicator">
            <div 
              className="star-label-dot"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      </div>
    </Html>
  );
};

/**
 * StarLabelManager handles multiple star labels
 */
export interface StarLabelManagerProps {
  stars: Array<{
    id: string;
    position: Vector3 | [number, number, number];
    name?: string;
    isOwned: boolean;
    color: string;
  }>;
  maxDistance?: number;
  className?: string;
}

export const StarLabelManager: React.FC<StarLabelManagerProps> = ({
  stars,
  maxDistance = 12,
  className = '',
}) => {
  return (
    <group name="star-labels">
      {stars.map((star) => (
        <StarLabel
          key={star.id}
          position={star.position}
          name={star.name || ''}
          isVisible={true}
          isOwned={star.isOwned}
          color={star.color}
          distance={maxDistance}
          className={className}
        />
      ))}
    </group>
  );
};

export default StarLabel;