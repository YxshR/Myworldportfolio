/**
 * Enhanced Star interface for premium twinkling star system
 */

export interface StarData {
  id: string;
  color: string; // Realistic star colors: white, blue-white, yellow, orange
  size: number;
  position: [number, number, number];
  status: 'orbiting' | 'falling' | 'landed';
  orbitSpeed: number;
  isOwned: boolean;
  name?: string;
  twinkleSpeed: number; // Random twinkling rate
  baseIntensity: number; // Base brightness level
  targetLocation?: { lat: number; lon: number }; // Target coordinates for falling stars
}

interface NavigationEffects {
  activeSection: string;
  scrollProgress: number;
  isScrolling: boolean;
  engagementLevel: number;
  starEngagementLevel: number;
  sectionEngagementColor: string;
  animationIntensity: number;
}

export interface TwinklingStarProps {
  star: StarData;
  time: number;
  navigationEffects?: NavigationEffects;
  isCurrentUser?: boolean;
}

// Realistic star colors based on stellar classification
export const REALISTIC_STAR_COLORS = {
  WHITE: '#ffffff',        // O-type stars (hottest)
  BLUE_WHITE: '#aabbff',   // B-type stars
  WHITE_MAIN: '#f8f8ff',   // A-type stars
  YELLOW_WHITE: '#fff2e0', // F-type stars
  YELLOW: '#ffff99',       // G-type stars (like our Sun)
  ORANGE: '#ffcc66',       // K-type stars
  RED_ORANGE: '#ff9966',   // M-type stars (coolest)
  GOLD: '#d4af37',         // Special gold for premium effect
} as const;

export type StarColor = typeof REALISTIC_STAR_COLORS[keyof typeof REALISTIC_STAR_COLORS];