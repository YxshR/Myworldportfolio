/**
 * Test page for mobile 3D optimizations
 * Allows testing of device detection, performance monitoring, and touch controls
 */

'use client';

import React, { useState, useEffect } from 'react';
import { MobileOptimizedCanvas } from '@/components/3d/MobileOptimizedCanvas';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { mockStars } from '@/data/mockStars';

export default function TestMobileOptimizations() {
  const { 
    optimizations, 
    updateQualityLevel, 
    enableAdaptiveQuality,
    resetPerformanceMonitoring 
  } = useMobileOptimizations();
  
  const [selectedQuality, setSelectedQuality] = useState<'auto' | 'low' | 'medium' | 'high'>('auto');
  const [showDetails, setShowDetails] = useState(false);
  
  const handleQualityChange = (quality: 'auto' | 'low' | 'medium' | 'high') => {
    setSelectedQuality(quality);
    updateQualityLevel(quality);
  };
  
  const handleEmailSubmit = (email: string, name?: string) => {
    console.log('Email submitted:', { email, name });
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="relative z-10 p-4 bg-black bg-opacity-80">
        <h1 className="text-2xl font-bold mb-4">Mobile 3D Optimizations Test</h1>
        
        {/* Device Information */}
        {optimizations.capabilities && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-800 p-3 rounded">
              <h3 className="font-semibold mb-2">Device Type</h3>
              <p className="text-sm">
                {optimizations.capabilities.isMobile ? 'Mobile' : 
                 optimizations.capabilities.isTablet ? 'Tablet' : 'Desktop'}
              </p>
              <p className="text-xs text-gray-400">
                Touch: {optimizations.capabilities.hasTouch ? 'Yes' : 'No'}
              </p>
            </div>
            
            <div className="bg-gray-800 p-3 rounded">
              <h3 className="font-semibold mb-2">Performance</h3>
              <p className="text-sm">FPS: {optimizations.currentFPS}</p>
              <p className="text-xs text-gray-400">
                GPU: {optimizations.capabilities.gpuTier}
              </p>
              <p className="text-xs text-gray-400">
                Memory: {optimizations.capabilities.memoryLevel}
              </p>
            </div>
            
            <div className="bg-gray-800 p-3 rounded">
              <h3 className="font-semibold mb-2">Display</h3>
              <p className="text-sm">
                {optimizations.capabilities.screenSize} screen
              </p>
              <p className="text-xs text-gray-400">
                Pixel Ratio: {optimizations.capabilities.pixelRatio}
              </p>
            </div>
            
            <div className="bg-gray-800 p-3 rounded">
              <h3 className="font-semibold mb-2">Quality</h3>
              <p className="text-sm">Level: {optimizations.qualityLevel}</p>
              <p className="text-xs text-gray-400">
                Stars: {optimizations.performanceSettings?.starCount || 0}
              </p>
              {optimizations.isPerformancePoor && (
                <p className="text-xs text-red-400">Performance Warning</p>
              )}
            </div>
          </div>
        )}
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex gap-2">
            <label className="text-sm font-medium">Quality:</label>
            {(['auto', 'low', 'medium', 'high'] as const).map((quality) => (
              <button
                key={quality}
                onClick={() => handleQualityChange(quality)}
                className={`px-3 py-1 text-sm rounded ${
                  selectedQuality === quality 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                }`}
              >
                {quality}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => enableAdaptiveQuality(!optimizations.adaptiveQuality)}
            className={`px-3 py-1 text-sm rounded ${
              optimizations.adaptiveQuality 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
            }`}
          >
            Adaptive Quality: {optimizations.adaptiveQuality ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={resetPerformanceMonitoring}
            className="px-3 py-1 text-sm rounded bg-yellow-600 text-white hover:bg-yellow-500"
          >
            Reset Performance
          </button>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 text-sm rounded bg-purple-600 text-white hover:bg-purple-500"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>
        
        {/* Detailed Information */}
        {showDetails && optimizations.capabilities && optimizations.performanceSettings && (
          <div className="bg-gray-900 p-4 rounded mb-4">
            <h3 className="font-semibold mb-3">Detailed Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Device Capabilities</h4>
                <pre className="text-xs bg-black p-2 rounded overflow-auto">
                  {JSON.stringify(optimizations.capabilities, null, 2)}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Performance Settings</h4>
                <pre className="text-xs bg-black p-2 rounded overflow-auto">
                  {JSON.stringify(optimizations.performanceSettings, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="bg-blue-900 bg-opacity-50 p-3 rounded mb-4">
          <h3 className="font-semibold mb-2">Test Instructions</h3>
          <ul className="text-sm space-y-1">
            <li>• On mobile: Use touch gestures to rotate and zoom the 3D scene</li>
            <li>• Try different quality levels to see performance impact</li>
            <li>• Enable adaptive quality to see automatic adjustments</li>
            <li>• Monitor FPS and performance warnings</li>
            <li>• Test on different devices to see capability detection</li>
          </ul>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <div className="h-screen">
        <MobileOptimizedCanvas
          stars={mockStars}
          myStarId="user-123"
          onEmailSubmit={handleEmailSubmit}
          forceQuality={selectedQuality}
          navigationEffects={{
            activeSection: 'universe',
            scrollProgress: 0.5,
            isScrolling: false,
            engagementLevel: 0.7,
            starEngagementLevel: 0.8,
            sectionEngagementColor: '#3b82f6',
            animationIntensity: 0.6
          }}
        />
      </div>
    </div>
  );
}