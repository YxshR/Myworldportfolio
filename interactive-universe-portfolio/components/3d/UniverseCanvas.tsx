import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SceneLighting } from './SceneLighting';
import { StarField } from './StarField';
import { AtmosphericEffects } from './AtmosphericEffects';
import { Earth } from './Earth';
import { StarManager } from './StarManager';
import { StarData } from '@/types';
import { UniverseNavigationEffects } from './UniverseNavigationEffects';
import { TouchControls } from './TouchControls';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { useMemo } from 'react';

interface NavigationEffects {
  activeSection: string;
  scrollProgress: number;
  isScrolling: boolean;
  engagementLevel: number;
  starEngagementLevel: number;
  sectionEngagementColor: string;
  animationIntensity: number;
}

interface UniverseCanvasProps {
  stars?: StarData[];
  myStarId?: string;
  onEmailSubmit?: (email: string, name?: string) => void;
  navigationEffects?: NavigationEffects;
}

export const UniverseCanvas: React.FC<UniverseCanvasProps> = ({ 
  stars = [], 
  myStarId,
  onEmailSubmit,
  navigationEffects
}) => {
  const { optimizations, handleTouchGesture, getRecommendedSettings } = useMobileOptimizations();
  
  // Memoized performance settings
  const performanceSettings = useMemo(() => {
    return getRecommendedSettings();
  }, [getRecommendedSettings]);
  
  // Memoized canvas configuration based on device capabilities
  const canvasConfig = useMemo(() => {
    if (!optimizations.capabilities) {
      return {
        antialias: true,
        alpha: true,
        powerPreference: "high-performance" as const
      };
    }
    
    const { isMobile, pixelRatio, gpuTier } = optimizations.capabilities;
    
    return {
      antialias: performanceSettings.antialiasing && !isMobile,
      alpha: true,
      powerPreference: (gpuTier === 'high' ? "high-performance" : 
                       gpuTier === 'low' ? "low-power" : "default") as const,
      pixelRatio: Math.min(pixelRatio, isMobile ? 2 : 3)
    };
  }, [optimizations.capabilities, performanceSettings]);
  
  // Memoized camera configuration
  const cameraConfig = useMemo(() => {
    const isMobile = optimizations.capabilities?.isMobile ?? false;
    
    return {
      position: [0, 0, 5] as [number, number, number],
      fov: isMobile ? 80 : 75
    };
  }, [optimizations.capabilities]);
  
  return (
    <Canvas 
      camera={cameraConfig}
      shadows={performanceSettings.shadowsEnabled}
      gl={canvasConfig}
    >
      {/* Enhanced lighting system with premium lighting */}
      <SceneLighting />
      
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
      
      {/* Premium Earth component with advanced features */}
      <Earth />
      
      {/* Enhanced starfield background with performance optimization */}
      <StarField 
        count={Math.floor(1500 * (performanceSettings.starCount / 300))} 
        radius={80} 
      />
      
      {/* Interactive Stars from Mock Data with performance limits */}
      {stars.length > 0 && (
        <StarManager 
          initialStars={stars.slice(0, performanceSettings.starCount)}
          currentUserId={myStarId}
          showLabels={true}
          navigationEffects={navigationEffects}
          onStarCreated={(star) => console.log('Star created:', star)}
          onStarUpdated={(star) => console.log('Star updated:', star)}
          onStarFell={(starId, location) => {
            console.log('Star fell:', starId, location);
            onEmailSubmit?.('demo@example.com', 'Demo User');
          }}
        />
      )}
      
      {/* Atmospheric effects with performance consideration */}
      {performanceSettings.particleEffects && <AtmosphericEffects />}
      
      {/* Touch controls for mobile devices or OrbitControls for desktop */}
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
  );
};