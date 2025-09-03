/**
 * Mobile Optimizations Hook
 * Manages device-specific 3D performance optimizations and touch controls
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  DeviceCapabilities, 
  PerformanceSettings, 
  assessDeviceCapabilities, 
  getOptimalPerformanceSettings,
  PerformanceMonitor
} from '@/lib/deviceDetection';

export interface TouchGesture {
  type: 'tap' | 'pinch' | 'pan' | 'rotate';
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  scale?: number;
  rotation?: number;
  velocity?: { x: number; y: number };
}

export interface MobileOptimizations {
  capabilities: DeviceCapabilities | null;
  performanceSettings: PerformanceSettings | null;
  currentFPS: number;
  isPerformancePoor: boolean;
  adaptiveQuality: boolean;
  touchControls: {
    isEnabled: boolean;
    sensitivity: number;
    gestureThreshold: number;
  };
  qualityLevel: 'auto' | 'low' | 'medium' | 'high';
}

export interface UseMobileOptimizationsReturn {
  optimizations: MobileOptimizations;
  updateQualityLevel: (level: 'auto' | 'low' | 'medium' | 'high') => void;
  handleTouchGesture: (gesture: TouchGesture) => void;
  enableAdaptiveQuality: (enabled: boolean) => void;
  resetPerformanceMonitoring: () => void;
  getRecommendedSettings: () => PerformanceSettings;
}

export const useMobileOptimizations = (): UseMobileOptimizationsReturn => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null);
  const [performanceSettings, setPerformanceSettings] = useState<PerformanceSettings | null>(null);
  const [qualityLevel, setQualityLevel] = useState<'auto' | 'low' | 'medium' | 'high'>('auto');
  const [adaptiveQuality, setAdaptiveQuality] = useState(true);
  const [currentFPS, setCurrentFPS] = useState(60);
  const [isPerformancePoor, setIsPerformancePoor] = useState(false);
  
  const performanceMonitor = useRef(new PerformanceMonitor());
  const animationFrameRef = useRef<number>();
  
  // Initialize device capabilities assessment
  useEffect(() => {
    const initializeCapabilities = async () => {
      try {
        const deviceCapabilities = await assessDeviceCapabilities();
        setCapabilities(deviceCapabilities);
        
        const optimalSettings = getOptimalPerformanceSettings(deviceCapabilities);
        setPerformanceSettings(optimalSettings);
        
        console.log('Device capabilities assessed:', deviceCapabilities);
        console.log('Optimal performance settings:', optimalSettings);
      } catch (error) {
        console.error('Failed to assess device capabilities:', error);
        
        // Fallback to conservative settings
        const fallbackSettings: PerformanceSettings = {
          starCount: 100,
          earthQuality: 'medium',
          shadowsEnabled: false,
          antialiasing: false,
          postProcessing: false,
          particleEffects: false,
          animationQuality: 'medium',
          frameRateTarget: 30
        };
        setPerformanceSettings(fallbackSettings);
      }
    };
    
    initializeCapabilities();
  }, []);
  
  // Performance monitoring loop
  useEffect(() => {
    if (!capabilities) return;
    
    const monitorPerformance = (currentTime: number) => {
      performanceMonitor.current.update(currentTime);
      
      const fps = performanceMonitor.current.getCurrentFPS();
      const poorPerformance = performanceMonitor.current.isPerformancePoor();
      
      setCurrentFPS(fps);
      setIsPerformancePoor(poorPerformance);
      
      // Adaptive quality adjustment
      if (adaptiveQuality && performanceSettings) {
        if (poorPerformance && qualityLevel !== 'low') {
          console.log('Poor performance detected, reducing quality');
          adjustQualityForPerformance('down');
        } else if (!poorPerformance && fps > 50 && qualityLevel === 'low') {
          console.log('Good performance detected, increasing quality');
          adjustQualityForPerformance('up');
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(monitorPerformance);
    };
    
    animationFrameRef.current = requestAnimationFrame(monitorPerformance);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [capabilities, adaptiveQuality, performanceSettings, qualityLevel]);
  
  // Adjust quality based on performance
  const adjustQualityForPerformance = useCallback((direction: 'up' | 'down') => {
    if (!capabilities || !performanceSettings) return;
    
    const newSettings = { ...performanceSettings };
    
    if (direction === 'down') {
      // Reduce quality
      newSettings.starCount = Math.max(20, Math.floor(newSettings.starCount * 0.7));
      newSettings.shadowsEnabled = false;
      newSettings.antialiasing = false;
      newSettings.postProcessing = false;
      newSettings.particleEffects = false;
      newSettings.animationQuality = 'low';
      newSettings.frameRateTarget = 30;
    } else {
      // Increase quality gradually
      newSettings.starCount = Math.min(300, Math.floor(newSettings.starCount * 1.2));
      if (capabilities.gpuTier !== 'low') {
        newSettings.shadowsEnabled = true;
        newSettings.antialiasing = true;
      }
      if (capabilities.gpuTier === 'high') {
        newSettings.postProcessing = true;
        newSettings.particleEffects = true;
        newSettings.animationQuality = 'high';
      }
    }
    
    setPerformanceSettings(newSettings);
  }, [capabilities, performanceSettings]);
  
  // Update quality level manually
  const updateQualityLevel = useCallback((level: 'auto' | 'low' | 'medium' | 'high') => {
    setQualityLevel(level);
    
    if (!capabilities) return;
    
    if (level === 'auto') {
      const optimalSettings = getOptimalPerformanceSettings(capabilities);
      setPerformanceSettings(optimalSettings);
    } else {
      // Manual quality settings
      const manualSettings: Record<string, Partial<PerformanceSettings>> = {
        low: {
          starCount: 50,
          earthQuality: 'low',
          shadowsEnabled: false,
          antialiasing: false,
          postProcessing: false,
          particleEffects: false,
          animationQuality: 'low',
          frameRateTarget: 30
        },
        medium: {
          starCount: 150,
          earthQuality: 'medium',
          shadowsEnabled: true,
          antialiasing: true,
          postProcessing: false,
          particleEffects: true,
          animationQuality: 'medium',
          frameRateTarget: 60
        },
        high: {
          starCount: 300,
          earthQuality: 'high',
          shadowsEnabled: true,
          antialiasing: true,
          postProcessing: true,
          particleEffects: true,
          animationQuality: 'high',
          frameRateTarget: 60
        }
      };
      
      if (performanceSettings) {
        setPerformanceSettings({
          ...performanceSettings,
          ...manualSettings[level]
        });
      }
    }
  }, [capabilities, performanceSettings]);
  
  // Handle touch gestures for mobile controls
  const handleTouchGesture = useCallback((gesture: TouchGesture) => {
    if (!capabilities?.hasTouch) return;
    
    switch (gesture.type) {
      case 'tap':
        // Handle tap interactions (e.g., star selection)
        console.log('Touch tap detected:', gesture.currentPosition);
        break;
        
      case 'pinch':
        // Handle zoom gestures
        if (gesture.scale) {
          console.log('Pinch gesture detected, scale:', gesture.scale);
          // This would be handled by the 3D scene controls
        }
        break;
        
      case 'pan':
        // Handle camera rotation
        if (gesture.velocity) {
          console.log('Pan gesture detected, velocity:', gesture.velocity);
          // This would be handled by the 3D scene controls
        }
        break;
        
      case 'rotate':
        // Handle rotation gestures
        if (gesture.rotation) {
          console.log('Rotation gesture detected, angle:', gesture.rotation);
        }
        break;
    }
  }, [capabilities]);
  
  // Enable/disable adaptive quality
  const enableAdaptiveQuality = useCallback((enabled: boolean) => {
    setAdaptiveQuality(enabled);
    console.log('Adaptive quality', enabled ? 'enabled' : 'disabled');
  }, []);
  
  // Reset performance monitoring
  const resetPerformanceMonitoring = useCallback(() => {
    performanceMonitor.current.reset();
    setCurrentFPS(60);
    setIsPerformancePoor(false);
    console.log('Performance monitoring reset');
  }, []);
  
  // Get current recommended settings
  const getRecommendedSettings = useCallback((): PerformanceSettings => {
    if (!performanceSettings || !capabilities) {
      return {
        starCount: 100,
        earthQuality: 'medium',
        shadowsEnabled: false,
        antialiasing: false,
        postProcessing: false,
        particleEffects: false,
        animationQuality: 'medium',
        frameRateTarget: 30
      };
    }
    
    return performanceSettings;
  }, [performanceSettings, capabilities]);
  
  // Prepare optimizations object
  const optimizations: MobileOptimizations = {
    capabilities,
    performanceSettings,
    currentFPS,
    isPerformancePoor,
    adaptiveQuality,
    touchControls: {
      isEnabled: capabilities?.hasTouch ?? false,
      sensitivity: capabilities?.isMobile ? 1.5 : 1.0,
      gestureThreshold: capabilities?.isMobile ? 10 : 5
    },
    qualityLevel
  };
  
  return {
    optimizations,
    updateQualityLevel,
    handleTouchGesture,
    enableAdaptiveQuality,
    resetPerformanceMonitoring,
    getRecommendedSettings
  };
};