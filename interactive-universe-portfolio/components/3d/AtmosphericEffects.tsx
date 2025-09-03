import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const AtmosphericEffects = () => {
  const dustRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    
    // Animate cosmic dust
    if (dustRef.current) {
      dustRef.current.rotation.y = time * 0.02;
      dustRef.current.rotation.x = time * 0.01;
    }
    
    // Animate nebula-like background
    if (nebulaRef.current) {
      nebulaRef.current.rotation.z = time * 0.005;
      const material = nebulaRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(time * 0.3) * 0.05;
    }
  });
  
  // Generate cosmic dust particles
  const dustCount = 200;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustSizes = new Float32Array(dustCount);
  
  for (let i = 0; i < dustCount; i++) {
    // Random positions in a large sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 50 + Math.random() * 100;
    
    dustPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    dustPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    dustPositions[i * 3 + 2] = r * Math.cos(phi);
    
    dustSizes[i] = Math.random() * 0.5 + 0.1;
  }
  
  return (
    <>
      {/* Cosmic dust particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[dustSizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1}
          sizeAttenuation={true}
          color="#666666"
          transparent={true}
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Nebula-like background sphere */}
      <mesh ref={nebulaRef} scale={[200, 200, 200]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#1a1a2e"
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Subtle cosmic rays */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
          ]}
          rotation={[
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          ]}
        >
          <cylinderGeometry args={[0.01, 0.01, 20, 8]} />
          <meshBasicMaterial
            color="#4a9eff"
            transparent={true}
            opacity={0.2}
          />
        </mesh>
      ))}
    </>
  );
};