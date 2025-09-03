import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SceneLighting = () => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    // Subtle light intensity variation for atmospheric effect
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = 1.2 + Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
    
    // Gentle rim light movement for depth
    if (rimLightRef.current) {
      const time = clock.elapsedTime * 0.3;
      rimLightRef.current.position.x = Math.cos(time) * 8;
      rimLightRef.current.position.z = Math.sin(time) * 8;
    }
  });

  return (
    <>
      {/* Ambient light for overall scene illumination */}
      <ambientLight intensity={0.2} color="#4a5568" />
      
      {/* Main directional light (sun-like) */}
      <directionalLight
        ref={directionalLightRef}
        position={[5, 3, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Rim light for atmospheric depth */}
      <directionalLight
        ref={rimLightRef}
        position={[-5, -3, -5]}
        intensity={0.8}
        color="#4a9eff"
      />
      
      {/* Point light for star-like illumination */}
      <pointLight
        position={[0, 0, 10]}
        intensity={0.5}
        color="#d4af37"
        distance={20}
        decay={2}
      />
      
      {/* Subtle fill light from below */}
      <pointLight
        position={[0, -8, 0]}
        intensity={0.3}
        color="#6366f1"
        distance={15}
        decay={2}
      />
      
      {/* Atmospheric hemisphere light */}
      <hemisphereLight
        args={["#87ceeb", "#2d3748", 0.4]}
      />
    </>
  );
};