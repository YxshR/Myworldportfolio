'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';
import { StarLabel, StarLabelManager } from '@/components/3d/StarLabel';
import { Earth, SceneLighting } from '@/components/3d';
import { Vector3 } from 'three';
import { Button } from '@/components/ui/Button';

export default function TestStarLabelsPage() {
  const [showLabels, setShowLabels] = useState(true);
  const [labelDistance, setLabelDistance] = useState(12);

  // Test stars with different ownership states
  const testStars = [
    {
      id: 'owned-star-1',
      position: new Vector3(4, 1, 0),
      name: 'My First Star',
      isOwned: true,
      color: '#d4af37',
    },
    {
      id: 'owned-star-2',
      position: new Vector3(-3, -1, 2),
      name: 'Golden Star',
      isOwned: true,
      color: '#ffcc66',
    },
    {
      id: 'unowned-star-1',
      position: new Vector3(0, 2, -4),
      name: 'Hidden Star',
      isOwned: false,
      color: '#ffffff',
    },
    {
      id: 'unowned-star-2',
      position: new Vector3(2, -2, 3),
      name: 'Another Hidden',
      isOwned: false,
      color: '#aabbff',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <SceneLighting />
          <Earth />
          
          {/* Individual star labels for testing */}
          {testStars.map((star) => (
            <group key={star.id}>
              {/* Star representation */}
              <mesh position={star.position}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color={star.color} />
              </mesh>
              
              {/* Individual star label */}
              <StarLabel
                position={star.position}
                name={star.name}
                isVisible={showLabels}
                isOwned={star.isOwned}
                color={star.color}
                distance={labelDistance}
                className={star.isOwned ? 'star-label-owned' : ''}
              />
            </group>
          ))}
          
          {/* Test StarLabelManager */}
          <StarLabelManager
            stars={testStars}
            maxDistance={labelDistance}
            className="star-label-premium"
          />
          
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      </div>

      {/* Control Panel */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-sm">
        <h2 className="text-lg font-bold mb-4">Star Labels Test</h2>
        
        <div className="space-y-3 mb-4">
          <div>
            <Button 
              variant={showLabels ? "primary" : "secondary"} 
              size="sm" 
              onClick={() => setShowLabels(!showLabels)}
            >
              {showLabels ? 'Hide Labels' : 'Show Labels'}
            </Button>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Label Distance: {labelDistance}</label>
            <input
              type="range"
              min="5"
              max="20"
              value={labelDistance}
              onChange={(e) => setLabelDistance(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="text-xs">
          <h3 className="font-semibold mb-2">Test Stars:</h3>
          <div className="space-y-1">
            {testStars.map((star) => (
              <div key={star.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: star.color }}
                />
                <span className={star.isOwned ? 'text-blue-300' : 'text-gray-400'}>
                  {star.name} {star.isOwned ? '(Owned)' : '(Hidden)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-xs">
        <h3 className="font-semibold mb-2">Label Testing:</h3>
        <ul className="text-xs space-y-1 text-gray-300">
          <li>• Zoom close to stars to see labels</li>
          <li>• Only owned stars (blue) show labels</li>
          <li>• Hidden stars (gray) never show labels</li>
          <li>• Labels fade based on distance</li>
          <li>• Adjust distance slider to test visibility</li>
          <li>• Toggle labels on/off</li>
        </ul>
      </div>
    </div>
  );
}