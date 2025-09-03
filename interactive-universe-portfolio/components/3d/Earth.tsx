'use client';

import { useRef, useMemo, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, CanvasTexture } from 'three';
import * as THREE from 'three';

// Create high-quality procedural Earth texture
function createPremiumEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext('2d')!;
  
  // Create realistic Earth base
  const gradient = context.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
  gradient.addColorStop(0, '#1e40af'); // Deep ocean blue
  gradient.addColorStop(0.4, '#0369a1'); // Ocean blue
  gradient.addColorStop(0.6, '#059669'); // Land green
  gradient.addColorStop(0.8, '#d97706'); // Desert brown
  gradient.addColorStop(1, '#1e40af'); // Ocean blue
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add detailed continent shapes
  context.fillStyle = '#065f46'; // Dark green for land
  
  // North America
  context.beginPath();
  context.ellipse(300, 300, 120, 80, -0.3, 0, 2 * Math.PI);
  context.fill();
  
  // South America
  context.beginPath();
  context.ellipse(400, 600, 60, 120, 0.2, 0, 2 * Math.PI);
  context.fill();
  
  // Europe/Africa
  context.beginPath();
  context.ellipse(1000, 350, 80, 140, 0, 0, 2 * Math.PI);
  context.fill();
  
  // Asia
  context.beginPath();
  context.ellipse(1400, 280, 140, 100, 0.1, 0, 2 * Math.PI);
  context.fill();
  
  // Australia
  context.beginPath();
  context.ellipse(1500, 650, 60, 40, 0, 0, 2 * Math.PI);
  context.fill();
  
  return new CanvasTexture(canvas);
}

// Create premium bump texture
function createPremiumBumpTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d')!;
  
  // Create detailed noise for topography
  const imageData = context.createImageData(canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const x = (i / 4) % canvas.width;
    const y = Math.floor((i / 4) / canvas.width);
    
    // Create mountain ranges and ocean depths
    const noise1 = Math.sin(x * 0.01) * Math.cos(y * 0.01) * 127 + 128;
    const noise2 = Math.sin(x * 0.02) * Math.sin(y * 0.02) * 64 + 128;
    const combined = (noise1 + noise2) / 2;
    
    imageData.data[i] = combined;     // R
    imageData.data[i + 1] = combined; // G
    imageData.data[i + 2] = combined; // B
    imageData.data[i + 3] = 255;      // A
  }
  context.putImageData(imageData, 0, 0);
  
  return new CanvasTexture(canvas);
}

// Create night texture for day/night blending
function createPremiumNightTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext('2d')!;
  
  // Create dark base for night
  context.fillStyle = '#0a0a0a';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add city lights as small bright spots
  context.fillStyle = '#ffeb3b';
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 3 + 1;
    
    context.beginPath();
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.fill();
  }
  
  // Add concentrated light areas for major cities
  const cities = [
    { x: 300, y: 300, intensity: 0.8 }, // North America
    { x: 1000, y: 350, intensity: 0.6 }, // Europe
    { x: 1400, y: 280, intensity: 0.7 }, // Asia
    { x: 400, y: 600, intensity: 0.4 }, // South America
  ];
  
  cities.forEach(city => {
    const gradient = context.createRadialGradient(city.x, city.y, 0, city.x, city.y, 50);
    gradient.addColorStop(0, `rgba(255, 235, 59, ${city.intensity})`);
    gradient.addColorStop(1, 'rgba(255, 235, 59, 0)');
    context.fillStyle = gradient;
    context.fillRect(city.x - 50, city.y - 50, 100, 100);
  });
  
  return new CanvasTexture(canvas);
}

// Create realistic cloud texture
function createCloudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d')!;
  
  // Create transparent base
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Generate cloud patterns using noise
  const imageData = context.createImageData(canvas.width, canvas.height);
  
  for (let i = 0; i < imageData.data.length; i += 4) {
    const x = (i / 4) % canvas.width;
    const y = Math.floor((i / 4) / canvas.width);
    
    // Multi-octave noise for realistic cloud patterns
    const noise1 = Math.sin(x * 0.01) * Math.cos(y * 0.01);
    const noise2 = Math.sin(x * 0.02) * Math.sin(y * 0.02) * 0.5;
    const noise3 = Math.sin(x * 0.04) * Math.cos(y * 0.04) * 0.25;
    
    const combined = (noise1 + noise2 + noise3) * 0.5 + 0.5;
    const cloudDensity = Math.pow(combined, 2); // Make clouds more sparse
    
    // Create cloud color (white with varying opacity)
    const alpha = cloudDensity > 0.3 ? (cloudDensity - 0.3) * 255 : 0;
    
    imageData.data[i] = 255;     // R - white
    imageData.data[i + 1] = 255; // G - white
    imageData.data[i + 2] = 255; // B - white
    imageData.data[i + 3] = alpha; // A - transparency
  }
  
  context.putImageData(imageData, 0, 0);
  return new CanvasTexture(canvas);
}

// Advanced Earth component with cloud layers and atmospheric effects
const EarthMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const outerAtmosphereRef = useRef<THREE.Mesh>(null);
  
  // Create fallback textures
  const fallbackDayTexture = useMemo(() => createPremiumEarthTexture(), []);
  const fallbackNightTexture = useMemo(() => createPremiumNightTexture(), []);
  const fallbackBumpTexture = useMemo(() => createPremiumBumpTexture(), []);
  const cloudTexture = useMemo(() => createCloudTexture(), []);
  
  // Try to load high-quality textures, fall back to procedural if they fail
  let dayTexture, nightTexture, bumpTexture;
  
  try {
    [dayTexture, nightTexture, bumpTexture] = useLoader(TextureLoader, [
      '/textures/earth-day-16k.jpg',
      '/textures/earth-night-16k.jpg',
      '/textures/earth-bump-8k.jpg'
    ]);
  } catch {
    // Use fallback textures if loading fails
    dayTexture = fallbackDayTexture;
    nightTexture = fallbackNightTexture;
    bumpTexture = fallbackBumpTexture;
  }

  // Custom shader material for day/night blending
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTexture || fallbackDayTexture },
        nightTexture: { value: nightTexture || fallbackNightTexture },
        bumpTexture: { value: bumpTexture || fallbackBumpTexture },
        lightDirection: { value: new THREE.Vector3(1, 0, 0) },
        bumpScale: { value: 0.15 },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform sampler2D bumpTexture;
        uniform float bumpScale;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // Apply bump mapping to vertex position
          float height = texture2D(bumpTexture, uv).r;
          vec3 newPosition = position + normal * height * bumpScale;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 lightDirection;
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 dayColor = texture2D(dayTexture, vUv).rgb;
          vec3 nightColor = texture2D(nightTexture, vUv).rgb;
          
          // Calculate lighting based on surface normal and light direction
          float lightIntensity = max(dot(vNormal, normalize(lightDirection)), 0.0);
          
          // Add subtle time-based variation for dynamic lighting
          float dynamicLight = lightIntensity + sin(time * 0.5) * 0.1;
          dynamicLight = clamp(dynamicLight, 0.0, 1.0);
          
          // Blend day and night textures based on lighting
          vec3 finalColor = mix(nightColor * 2.0, dayColor, dynamicLight);
          
          // Add atmospheric scattering effect
          float fresnel = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
          finalColor += vec3(0.2, 0.4, 0.8) * fresnel * 0.3;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });
  }, [dayTexture, nightTexture, bumpTexture, fallbackDayTexture, fallbackNightTexture, fallbackBumpTexture]);

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation with realistic Earth speed
      meshRef.current.rotation.y += 0.001;
      
      // Update shader uniforms for dynamic lighting
      if (earthMaterial.uniforms) {
        earthMaterial.uniforms.time.value = state.clock.elapsedTime;
        earthMaterial.uniforms.lightDirection.value.set(
          Math.cos(state.clock.elapsedTime * 0.1),
          0,
          Math.sin(state.clock.elapsedTime * 0.1)
        );
      }
    }
    
    // Cloud layer animation with subtle movement
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0008; // Slightly faster than Earth for realistic cloud movement
      cloudsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.01; // Subtle wobble
      
      const cloudMaterial = cloudsRef.current.material as THREE.MeshBasicMaterial;
      cloudMaterial.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1; // Dynamic cloud density
    }
    
    // Enhanced atmospheric glow animation
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.0005; // Slower counter-rotation
      const material = atmosphereRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
    
    // Outer atmosphere scattering effects
    if (outerAtmosphereRef.current) {
      outerAtmosphereRef.current.rotation.y -= 0.0003; // Counter-rotation for depth
      const outerMaterial = outerAtmosphereRef.current.material as THREE.MeshBasicMaterial;
      outerMaterial.opacity = 0.03 + Math.sin(state.clock.elapsedTime * 1.2) * 0.02;
    }
  });

  return (
    <group>
      {/* Main Earth mesh with advanced shader materials */}
      <mesh ref={meshRef} scale={2.5}>
        <sphereGeometry args={[1, 128, 128]} />
        <primitive object={earthMaterial} />
      </mesh>
      
      {/* Cloud layer with realistic movement */}
      <mesh ref={cloudsRef} scale={2.52}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial 
          map={cloudTexture}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Inner atmospheric glow effect */}
      <mesh ref={atmosphereRef} scale={2.7}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial 
          color="#4a9eff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer atmospheric scattering layer */}
      <mesh ref={outerAtmosphereRef} scale={2.9}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#87ceeb"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Atmospheric rim lighting effect */}
      <mesh scale={3.1}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial 
          color="#b8e6ff"
          transparent
          opacity={0.02}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// Enhanced fallback component with cloud layer and atmospheric effects
const EarthFallback = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const outerAtmosphereRef = useRef<THREE.Mesh>(null);
  
  const fallbackTexture = useMemo(() => createPremiumEarthTexture(), []);
  const fallbackBump = useMemo(() => createPremiumBumpTexture(), []);
  const cloudTexture = useMemo(() => createCloudTexture(), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    
    // Cloud animation
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0008;
      cloudsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.01;
      
      const cloudMaterial = cloudsRef.current.material as THREE.MeshBasicMaterial;
      cloudMaterial.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    
    // Enhanced atmospheric animation
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.0005;
      const material = atmosphereRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
    
    // Outer atmosphere animation
    if (outerAtmosphereRef.current) {
      outerAtmosphereRef.current.rotation.y -= 0.0003;
      const outerMaterial = outerAtmosphereRef.current.material as THREE.MeshBasicMaterial;
      outerMaterial.opacity = 0.03 + Math.sin(state.clock.elapsedTime * 1.2) * 0.02;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} scale={2.5}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial 
          map={fallbackTexture}
          bumpMap={fallbackBump}
          bumpScale={0.15}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Cloud layer */}
      <mesh ref={cloudsRef} scale={2.52}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial 
          map={cloudTexture}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Enhanced atmospheric layers */}
      <mesh ref={atmosphereRef} scale={2.7}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial 
          color="#4a9eff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh ref={outerAtmosphereRef} scale={2.9}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#87ceeb"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh scale={3.1}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial 
          color="#b8e6ff"
          transparent
          opacity={0.02}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export const Earth = () => {
  return (
    <Suspense fallback={<EarthFallback />}>
      <EarthMesh />
    </Suspense>
  );
};