import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarFieldProps {
  count?: number;
  radius?: number;
}

export const StarField: React.FC<StarFieldProps> = ({ count = 1000, radius = 100 }) => {
  const meshRef = useRef<THREE.Points>(null);
  
  // Generate star positions and properties
  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Star color variations
    const starColors = [
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#aabbff'), // Blue-white
      new THREE.Color('#ffddaa'), // Yellow
      new THREE.Color('#ffaa77'), // Orange
      new THREE.Color('#ff7777'), // Red
    ];
    
    for (let i = 0; i < count; i++) {
      // Random spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + Math.random() * radius * 0.5;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Random star color
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Random star size
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    return [positions, colors, sizes];
  }, [count, radius]);
  
  // Subtle twinkling animation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.elapsedTime;
      const geometry = meshRef.current.geometry;
      const sizeAttribute = geometry.attributes.size as THREE.BufferAttribute;
      
      // Update star sizes for twinkling effect
      for (let i = 0; i < count; i++) {
        const originalSize = sizes[i];
        const twinkle = Math.sin(time * (0.5 + Math.random() * 2) + i * 0.1) * 0.3 + 1;
        sizeAttribute.array[i] = originalSize * twinkle;
      }
      
      sizeAttribute.needsUpdate = true;
      
      // Slow rotation for depth
      meshRef.current.rotation.y = time * 0.01;
      meshRef.current.rotation.x = time * 0.005;
    }
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};