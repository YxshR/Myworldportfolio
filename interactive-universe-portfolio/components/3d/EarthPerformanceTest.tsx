'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
}

interface PerformanceMemory {
  usedJSHeapSize: number;
}

export const EarthPerformanceTest = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    drawCalls: 0
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const { gl } = useThree();

  useFrame(() => {
    frameCount.current++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime.current;
    
    // Update metrics every second
    if (deltaTime >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / deltaTime);
      const frameTime = deltaTime / frameCount.current;
      
      // Get WebGL info for draw calls (approximation)
      const info = gl.info;
      
      // Check if performance.memory is available (Chrome only)
      const perfMemory = (performance as unknown as { memory?: PerformanceMemory }).memory;
      const memoryUsage = perfMemory ? 
        Math.round(perfMemory.usedJSHeapSize / 1024 / 1024) : 0;
      
      setMetrics({
        fps,
        frameTime: Math.round(frameTime * 100) / 100,
        memoryUsage,
        drawCalls: info.render.calls
      });
      
      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  });

  return (
    <div className="absolute top-4 right-4 bg-black/50 text-white p-4 rounded-lg text-sm font-mono z-20">
      <div className="text-accent-gold font-bold mb-2">Earth Performance</div>
      <div>FPS: <span className={metrics.fps >= 60 ? 'text-green-400' : metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'}>{metrics.fps}</span></div>
      <div>Frame Time: {metrics.frameTime}ms</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
      <div>Draw Calls: {metrics.drawCalls}</div>
      <div className="mt-2 text-xs text-gray-400">
        Status: {metrics.fps >= 60 ? '✅ Excellent' : metrics.fps >= 30 ? '⚠️ Good' : '❌ Poor'}
      </div>
    </div>
  );
};