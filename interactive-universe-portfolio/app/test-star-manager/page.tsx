'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useRef } from 'react';
import { StarManager, StarManagerMethods } from '@/components/3d/StarManager';
import { Earth, SceneLighting } from '@/components/3d';
import { getAllMockStars } from '@/data/mockStars';
import { StarData } from '@/types/star';
import { Button } from '@/components/ui/Button';

export default function TestStarManagerPage() {
  const [stars] = useState<StarData[]>(getAllMockStars());
  const [currentUserId] = useState('test-user-123');
  const [logs, setLogs] = useState<string[]>([]);
  const starManagerRef = useRef<StarManagerMethods>(null);

  const addLog = (message: string) => {
    setLogs(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 9)]);
  };

  const handleStarCreated = (star: StarData) => {
    addLog(`Star created: ${star.id} (${star.color})`);
  };

  const handleStarUpdated = (star: StarData) => {
    addLog(`Star updated: ${star.id} - Status: ${star.status}`);
  };

  const handleStarRemoved = (starId: string) => {
    addLog(`Star removed: ${starId}`);
  };

  const handleStarFell = (starId: string, location: { lat: number; lon: number }) => {
    addLog(`Star fell: ${starId} to ${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`);
  };

  const createRandomStar = () => {
    if (starManagerRef.current) {
      const newStar = starManagerRef.current.createStar();
      addLog(`Created random star: ${newStar.id}`);
    }
  };

  const makeRandomStarFall = () => {
    if (starManagerRef.current) {
      const orbitingStars = starManagerRef.current.getStarsByStatus('orbiting');
      if (orbitingStars.length > 0) {
        const randomStar = orbitingStars[Math.floor(Math.random() * orbitingStars.length)];
        const randomLat = (Math.random() - 0.5) * 180;
        const randomLon = (Math.random() - 0.5) * 360;
        
        starManagerRef.current.makeStarFall(randomStar.id, { lat: randomLat, lon: randomLon });
        addLog(`Made star fall: ${randomStar.id}`);
      }
    }
  };

  const removeRandomStar = () => {
    if (starManagerRef.current) {
      const allStars = starManagerRef.current.getAllStars();
      const nonOwnedStars = allStars.filter(star => !star.isOwned);
      
      if (nonOwnedStars.length > 0) {
        const randomStar = nonOwnedStars[Math.floor(Math.random() * nonOwnedStars.length)];
        starManagerRef.current.removeStar(randomStar.id);
        addLog(`Removed star: ${randomStar.id}`);
      }
    }
  };

  const claimRandomStar = () => {
    if (starManagerRef.current) {
      const allStars = starManagerRef.current.getAllStars();
      const unownedStars = allStars.filter(star => !star.isOwned);
      
      if (unownedStars.length > 0) {
        const randomStar = unownedStars[Math.floor(Math.random() * unownedStars.length)];
        starManagerRef.current.setStarAsOwned(randomStar.id, 'My Test Star');
        addLog(`Claimed star: ${randomStar.id}`);
      }
    }
  };

  const getStats = () => {
    if (starManagerRef.current) {
      const state = starManagerRef.current.getState();
      const orbitingCount = starManagerRef.current.getStarsByStatus('orbiting').length;
      const fallingCount = starManagerRef.current.getStarsByStatus('falling').length;
      const landedCount = starManagerRef.current.getStarsByStatus('landed').length;
      const ownedStar = starManagerRef.current.getOwnedStar();
      
      addLog(`Stats - Total: ${state.stars.size}, Orbiting: ${orbitingCount}, Falling: ${fallingCount}, Landed: ${landedCount}, Owned: ${ownedStar ? 'Yes' : 'No'}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <SceneLighting />
          <Earth />
          <StarManager
            ref={starManagerRef}
            initialStars={stars}
            currentUserId={currentUserId}
            showLabels={true}
            labelDistance={15}
            onStarCreated={handleStarCreated}
            onStarUpdated={handleStarUpdated}
            onStarRemoved={handleStarRemoved}
            onStarFell={handleStarFell}
          />
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      </div>

      {/* Control Panel */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-sm">
        <h2 className="text-lg font-bold mb-4">Star Manager Test</h2>
        
        <div className="space-y-2 mb-4">
          <Button variant="primary" size="sm" onClick={createRandomStar}>
            Create Star
          </Button>
          <Button variant="secondary" size="sm" onClick={makeRandomStarFall}>
            Make Star Fall
          </Button>
          <Button variant="secondary" size="sm" onClick={removeRandomStar}>
            Remove Star
          </Button>
          <Button variant="ghost" size="sm" onClick={claimRandomStar}>
            Claim Star
          </Button>
          <Button variant="ghost" size="sm" onClick={getStats}>
            Get Stats
          </Button>
          <Button variant="ghost" size="sm" onClick={() => addLog('Zoom in close to owned stars to see labels!')}>
            Label Help
          </Button>
        </div>

        <div className="text-xs">
          <h3 className="font-semibold mb-2">Activity Log:</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-gray-300">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-xs">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="text-xs space-y-1 text-gray-300">
          <li>• Use mouse to orbit around Earth</li>
          <li>• Create Star: Adds a new random star</li>
          <li>• Make Star Fall: Random orbiting star falls</li>
          <li>• Remove Star: Removes a non-owned star</li>
          <li>• Claim Star: Sets a star as owned</li>
          <li>• Get Stats: Shows current star counts</li>
          <li>• Zoom close to owned stars to see labels</li>
          <li>• Only owned stars show name labels</li>
        </ul>
      </div>
    </div>
  );
}