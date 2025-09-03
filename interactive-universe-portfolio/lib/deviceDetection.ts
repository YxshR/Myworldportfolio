/**
 * Device Detection and Capability Assessment for Mobile 3D Optimizations
 * Provides utilities to detect device capabilities and optimize 3D performance accordingly
 */

export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  screenSize: 'small' | 'medium' | 'large';
  pixelRatio: number;
  memoryLevel: 'low' | 'medium' | 'high';
  gpuTier: 'low' | 'medium' | 'high';
  maxTextureSize: number;
  supportsWebGL2: boolean;
  batteryLevel?: number;
  isLowPowerMode?: boolean;
}

export interface PerformanceSettings {
  starCount: number;
  earthQuality: 'low' | 'medium' | 'high';
  shadowsEnabled: boolean;
  antialiasing: boolean;
  postProcessing: boolean;
  particleEffects: boolean;
  animationQuality: 'low' | 'medium' | 'high';
  frameRateTarget: number;
}

/**
 * Detects if the current device is mobile
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android', 'webos', 'iphone', 'ipad', 'ipod', 
    'blackberry', 'windows phone', 'mobile'
  ];
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
         window.innerWidth <= 768 ||
         ('ontouchstart' in window);
};

/**
 * Detects if the current device is a tablet
 */
export const isTabletDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
  const hasTabletDimensions = window.innerWidth >= 768 && window.innerWidth <= 1024;
  
  return isTablet || (hasTabletDimensions && 'ontouchstart' in window);
};

/**
 * Detects touch capability
 */
export const hasTouchSupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || 
         navigator.maxTouchPoints > 0 ||
         // @ts-ignore - Legacy support
         navigator.msMaxTouchPoints > 0;
};

/**
 * Gets screen size category
 */
export const getScreenSize = (): 'small' | 'medium' | 'large' => {
  if (typeof window === 'undefined') return 'medium';
  
  const width = window.innerWidth;
  if (width < 768) return 'small';
  if (width < 1200) return 'medium';
  return 'large';
};

/**
 * Estimates device memory level
 */
export const getMemoryLevel = (): 'low' | 'medium' | 'high' => {
  if (typeof window === 'undefined') return 'medium';
  
  // @ts-ignore - deviceMemory is experimental
  const deviceMemory = navigator.deviceMemory;
  
  if (deviceMemory) {
    if (deviceMemory <= 2) return 'low';
    if (deviceMemory <= 4) return 'medium';
    return 'high';
  }
  
  // Fallback based on device type
  if (isMobileDevice()) return 'low';
  if (isTabletDevice()) return 'medium';
  return 'high';
};

/**
 * Estimates GPU performance tier
 */
export const getGPUTier = async (): Promise<'low' | 'medium' | 'high'> => {
  if (typeof window === 'undefined') return 'medium';
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'low';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
      
      // High-end GPUs
      if (renderer.includes('nvidia') && (renderer.includes('rtx') || renderer.includes('gtx'))) {
        return 'high';
      }
      
      // Medium-end GPUs
      if (renderer.includes('intel') || renderer.includes('amd')) {
        return 'medium';
      }
    }
    
    // Fallback based on device type
    if (isMobileDevice()) return 'low';
    return 'medium';
  } catch {
    return 'medium';
  }
};

/**
 * Gets maximum texture size supported
 */
export const getMaxTextureSize = (): number => {
  if (typeof window === 'undefined') return 2048;
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 2048;
    
    return gl.getParameter(gl.MAX_TEXTURE_SIZE);
  } catch {
    return 2048;
  }
};

/**
 * Checks WebGL2 support
 */
export const supportsWebGL2 = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    return !!(context && context instanceof WebGL2RenderingContext);
  } catch {
    return false;
  }
};

/**
 * Gets battery information if available
 */
export const getBatteryInfo = async (): Promise<{ level?: number; isLowPowerMode?: boolean }> => {
  if (typeof window === 'undefined' || !('getBattery' in navigator)) {
    return {};
  }
  
  try {
    // @ts-ignore - Battery API is experimental
    const battery = await navigator.getBattery();
    return {
      level: battery.level,
      isLowPowerMode: battery.level < 0.2 && !battery.charging
    };
  } catch {
    return {};
  }
};

/**
 * Comprehensive device capability assessment
 */
export const assessDeviceCapabilities = async (): Promise<DeviceCapabilities> => {
  const batteryInfo = await getBatteryInfo();
  const gpuTier = await getGPUTier();
  
  return {
    isMobile: isMobileDevice(),
    isTablet: isTabletDevice(),
    isDesktop: !isMobileDevice() && !isTabletDevice(),
    hasTouch: hasTouchSupport(),
    screenSize: getScreenSize(),
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    memoryLevel: getMemoryLevel(),
    gpuTier,
    maxTextureSize: getMaxTextureSize(),
    supportsWebGL2: supportsWebGL2(),
    batteryLevel: batteryInfo.level,
    isLowPowerMode: batteryInfo.isLowPowerMode
  };
};

/**
 * Generates optimal performance settings based on device capabilities
 */
export const getOptimalPerformanceSettings = (capabilities: DeviceCapabilities): PerformanceSettings => {
  const { isMobile, gpuTier, memoryLevel, screenSize, isLowPowerMode } = capabilities;
  
  // Base settings for different device tiers
  const baseSettings: Record<string, PerformanceSettings> = {
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
  
  // Determine performance tier
  let tier: 'low' | 'medium' | 'high' = 'medium';
  
  if (isMobile || isLowPowerMode || memoryLevel === 'low' || gpuTier === 'low') {
    tier = 'low';
  } else if (gpuTier === 'high' && memoryLevel === 'high' && screenSize === 'large') {
    tier = 'high';
  }
  
  const settings = { ...baseSettings[tier] };
  
  // Fine-tune based on specific conditions
  if (screenSize === 'small') {
    settings.starCount = Math.floor(settings.starCount * 0.7);
    settings.frameRateTarget = 30;
  }
  
  if (capabilities.pixelRatio > 2) {
    settings.antialiasing = false; // High DPI screens don't need as much AA
  }
  
  return settings;
};

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private frameTimeHistory: number[] = [];
  private readonly maxHistoryLength = 60;
  
  public getCurrentFPS(): number {
    return this.fps;
  }
  
  public getAverageFrameTime(): number {
    if (this.frameTimeHistory.length === 0) return 16.67; // 60fps baseline
    
    const sum = this.frameTimeHistory.reduce((a, b) => a + b, 0);
    return sum / this.frameTimeHistory.length;
  }
  
  public isPerformancePoor(): boolean {
    return this.fps < 30 || this.getAverageFrameTime() > 33.33;
  }
  
  public update(currentTime: number): void {
    this.frameCount++;
    
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
      return;
    }
    
    const deltaTime = currentTime - this.lastTime;
    this.frameTimeHistory.push(deltaTime);
    
    if (this.frameTimeHistory.length > this.maxHistoryLength) {
      this.frameTimeHistory.shift();
    }
    
    // Calculate FPS every second
    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }
  
  public reset(): void {
    this.frameCount = 0;
    this.lastTime = 0;
    this.fps = 60;
    this.frameTimeHistory = [];
  }
}