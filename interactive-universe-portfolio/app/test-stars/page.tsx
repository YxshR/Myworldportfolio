'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { TwinklingStar } from '@/components/3d';
import { mockStars } from '@/data/mockStars';
import { useState, useEffect } from 'react';

export default function TestStarsPage() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.016); // ~60fps
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Twinkling Stars Test</h1>
        <p className="text-gray-300 mb-6">
          Testing premium twinkling star system with realistic colors and natural blinking patterns.
        </p>
      </div>
      
      <div className="h-[80vh]">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          {/* Basic lighting */}
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          
          {/* Render all mock stars */}
          {mockStars.map((star) => (
            <TwinklingStar key={star.id} star={star} time={time} />
          ))}
          
          {/* Controls for testing */}
          <OrbitControls enableZoom={true} enablePan={true} />
          
          {/* Reference sphere to show scale */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[2.5, 32, 32]} />
            <meshBasicMaterial color="#333333" wireframe />
          </mesh>
        </Canvas>
      </div>
      
      <div className="p-6">
        <div className="text-white">
          <h2 className="text-lg font-semibold mb-2">Star Information:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockStars.slice(0, 6).map((star) => (
              <div key={star.id} className="bg-gray-800 p-3 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: star.color }}
                  />
                  <span className="font-medium">{star.id}</span>
                </div>
                <div className="text-sm text-gray-300">
                  <p>Status: {star.status}</p>
                  <p>Twinkle Speed: {star.twinkleSpeed.toFixed(1)}</p>
                  <p>Base Intensity: {star.baseIntensity.toFixed(1)}</p>
                  {star.name && <p>Name: {star.name}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}