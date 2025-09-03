/**
 * Mobile Optimized Canvas Component
 * Provides device-specific optimizations for 3D scene rendering on mobile devices
 */

import React, { useMemo, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SceneLighting } from './SceneLighting';
import { StarField } from './StarField';
import { AtmosphericEffects } from './AtmosphericEffects';
import { Earth } from './Earth';
import { StarManager } from './StarManager';
import { UniverseNavigationEffects } from './UniverseNavigationEffects';
import { TouchControls } from './TouchControls';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { StarData } from '@/types';

interface NavigationEffects {
  activeSection: string;
  scrollProgress: number;
  isScrolling: boolean;
  engagementLevel: number;
  starEngagementLevel: number;
  sectionEngagementColor: string;
  animationIntensity: number;
}

interface MobileOptimizedCanvasProps {
  stars?: StarData[];
  myStarId?: string;
  onEmailSubmit?: (email: string, name?: string) => void;
  navigationEffects?: NavigationEffects;
  forceQuality?: 'auto' | 'low' | 'medium' | 'high';
}

export const MobileOptimizedCanvas: React.FC<MobileOptimizedCanvasProps> = ({ 
  stars = [], 
  myStarId,
  onEmailSubmit,
  navigationEffects,
  forceQuality
}) => {
  const { 
    optimizations, 
    updateQualityLevel, 
    handleTouchGesture,
    getRecommendedSettings 
  } = useMobileOptimizations();
  
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Apply forced quality level if provided
  useEffect(() => {
    if (forceQuality && optimizations.capabilities) {
      updateQualityLevel(forceQuality);
    }
  }, [forceQuality, optimizations.capabilities, updateQualityLevel]);
  
  // Wait for capabilities to be assessed
  useEffect(() => {
    if (optimizations.capabilities && optimizations.performanceSettings) {
      setIsInitialized(true);
    }
  }, [optimizations.capabilities, optimizations.performanceSettings]);
  
  // Memoized performance settings
  const performanceSettings = useMemo(() => {
    return getRecommendedSettings();
  }, [getRecommendedSettings]);
  
  // Memoized canvas configuration based on device capabilities
  const canvasConfig = useMemo(() => {
    if (!optimizations.capabilities) {
      return {
        antialias: false,
        alpha: true,
        powerPreference: "default" as const,
        pixelRatio: 1
      };
    }
    
    const { isMobile, pixelRatio, gpuTier } = optimizations.capabilities;
    
    return {
      antialias: performanceSettings.antialiasing && !isMobile,
      alpha: true,
      powerPreference: (gpuTier === 'high' ? "high-performance" : 
                       gpuTier === 'low' ? "low-power" : "default") as const,
      pixelRatio: Math.min(pixelRatio, isMobile ? 2 : 3), // Limit pixel ratio on mobile
      shadowMap: performanceSettings.shadowsEnabled,
      toneMapping: gpuTier !== 'low'
    };
  }, [optimizations.capabilities, performanceSettings]);
  
  // Memoized camera configuration
  const cameraConfig = useMemo(() => {
    const isMobile = optimizations.capabilities?.isMobile ?? false;
    
    return {
      position: [0, 0, 5] as [number, number, number],
      fov: isMobile ? 80 : 75, // Slightly wider FOV on mobile
      near: 0.1,
      far: 1000
    };
  }, [optimizations.capabilities]);
  
  // Memoized star count based on performance settings
  const optimizedStarCount = useMemo(() => {
    return Math.min(stars.length, performanceSettings.starCount);
  }, [stars.length, performanceSettings.starCount]);
  
  // Show loading state while capabilities are being assessed
  if (!isInitialized) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p>Optimizing for your device...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full">
      {/* Performance indicator for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded text-xs">
          <div>FPS: {optimizations.currentFPS}</div>
          <div>Quality: {optimizations.qualityLevel}</div>
          <div>Stars: {performanceSettings.starCount}</div>
          <div>Device: {optimizations.capabilities?.isMobile ? 'Mobile' : 'Desktop'}</div>
          {optimizations.isPerformancePoor && (
            <div className="text-red-400">Performance Warning</div>
          )}
        </div>
      )}
      
      <Canvas 
        camera={cameraConfig}
        shadows={performanceSettings.shadowsEnabled}
        gl={canvasConfig}
        dpr={canvasConfig.pixelRatio}
      >
        {/* Lighting system with performance-based quality */}
        <SceneLighting 
          quality={performanceSettings.earthQuality}
          shadowsEnabled={performanceSettings.shadowsEnabled}
        />
        
        {/* Navigation-based universe effects */}
        {navigationEffects && performanceSettings.particleEffects && (
          <UniverseNavigationEffects
            activeSection={navigationEffects.activeSection}
            scrollProgress={navigationEffects.scrollProgress}
            isScrolling={navigationEffects.isScrolling}
            animationIntensity={navigationEffects.animationIntensity}
            engagementLevel={navigationEffects.engagementLevel}
          />
        )}
        
        {/* Earth component with quality settings */}
        <Earth quality={performanceSettings.earthQuality} />
        
        {/* Optimized starfield background */}
        <StarField 
          count={Math.floor(1500 * (performanceSettings.starCount / 300))} 
          radius={80}
          quality={performanceSettings.animationQuality}
        />
        
        {/* Interactive Stars with performance limits */}
        {stars.length > 0 && (
          <StarManager 
            initialStars={stars.slice(0, optimizedStarCount)}
            currentUserId={myStarId}
            showLabels={true}
            navigationEffects={navigationEffects}
            performanceMode={optimizations.capabilities?.isMobile}
            onStarCreated={(star) => console.log('Star created:', star)}
            onStarUpdated={(star) => console.log('Star updated:', star)}
            onStarFell={(starId, location) => {
              console.log('Star fell:', starId, location);
              onEmailSubmit?.('demo@example.com', 'Demo User');
            }}
          />
        )}
        
        {/* Atmospheric effects with performance consideration */}
        {performanceSettings.particleEffects && (
          <AtmosphericEffects 
            quality={performanceSettings.animationQuality}
          />
        )}
        
        {/* Touch controls for mobile devices */}
        {optimizations.touchControls.isEnabled ? (
          <TouchControls
            enabled={true}
            sensitivity={optimizations.touchControls.sensitivity}
            gestureThreshold={optimizations.touchControls.gestureThreshold}
            onGesture={handleTouchGesture}
            enableZoom={true}
            enableRotation={true}
            enablePan={false}
            minDistance={3}
            maxDistance={15}
            rotationSpeed={0.5}
            zoomSpeed={0.1}
          />
        ) : (
          // Fallback to OrbitControls for desktop
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            minDistance={3}
            maxDistance={15}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
          />
        )}
      </Canvas>
      
      {/* Quality control overlay for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded">
          <div className="text-xs mb-2">Quality Control</div>
          <div className="flex gap-1">
            {(['auto', 'low', 'medium', 'high'] as const).map((quality) => (
              <button
                key={quality}
                onClick={() => updateQualityLevel(quality)}
                className={`px-2 py-1 text-xs rounded ${
                  optimizations.qualityLevel === quality 
                    ? 'bg-blue-500' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              >
                {quality}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedCanvas;