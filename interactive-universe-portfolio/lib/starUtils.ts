/**
 * Utility functions for star generation and animation
 */

import { StarData } from '@/types';

/**
 * Generate realistic twinkling intensity using multiple sine waves
 */
export function calculateTwinkleIntensity(
  baseIntensity: number,
  twinkleSpeed: number,
  time: number,
  starId: string
): number {
  // Use star ID to create unique phase offsets
  const phase1 = starId.length * 0.1;
  const phase2 = starId.length * 0.2;
  const phase3 = starId.length * 0.3;
  
  // Multiple sine waves for complex twinkling
  const twinkle1 = Math.sin(time * twinkleSpeed + phase1) * 0.3;
  const twinkle2 = Math.sin(time * twinkleSpeed * 1.7 + phase2) * 0.2;
  const twinkle3 = Math.sin(time * twinkleSpeed * 0.5 + phase3) * 0.1;
  const twinkle4 = Math.sin(time * twinkleSpeed * 2.3 + phase1) * 0.05;
  
  // Combine all twinkling effects
  const totalTwinkle = twinkle1 + twinkle2 + twinkle3 + twinkle4;
  
  // Ensure minimum brightness
  return Math.max(0.1, baseIntensity + totalTwinkle);
}

/**
 * Calculate orbital position for a star
 */
export function calculateOrbitPosition(
  orbitSpeed: number,
  time: number,
  radius: number = 4.5,
  starId: string
): [number, number, number] {
  // Use star ID for unique orbital characteristics
  const phaseOffset = starId.length * 0.1;
  const inclination = (starId.length % 10) * 0.1; // Orbital inclination
  
  const angle = time * orbitSpeed + phaseOffset;
  
  // Calculate position with slight inclination
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = Math.sin(angle * 0.3 + phaseOffset) * 0.8 * inclination;
  
  return [x, y, z];
}

/**
 * Generate atmospheric scintillation effect (stars twinkling more near horizon)
 */
export function calculateScintillation(
  position: [number, number, number],
  cameraPosition: [number, number, number] = [0, 0, 8]
): number {
  // Calculate angle from camera to star
  const dx = position[0] - cameraPosition[0];
  const dy = position[1] - cameraPosition[1];
  const dz = position[2] - cameraPosition[2];
  
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const angle = Math.acos(Math.abs(dy) / distance);
  
  // Stars near the "horizon" twinkle more
  const scintillationFactor = 1 + Math.sin(angle) * 0.5;
  
  return scintillationFactor;
}

/**
 * Generate star color based on temperature (stellar classification)
 */
export function getStarColorByTemperature(temperature: number): string {
  if (temperature > 30000) return '#9bb0ff'; // O-type (blue)
  if (temperature > 10000) return '#aabfff'; // B-type (blue-white)
  if (temperature > 7500) return '#cad7ff';  // A-type (white)
  if (temperature > 6000) return '#f8f7ff';  // F-type (yellow-white)
  if (temperature > 5200) return '#fff4ea';  // G-type (yellow, like Sun)
  if (temperature > 3700) return '#ffd2a1';  // K-type (orange)
  return '#ffad51'; // M-type (red)
}

/**
 * Generate random star temperature
 */
export function generateStarTemperature(): number {
  // Most stars are M-type (cool), fewer are hot
  const rand = Math.random();
  if (rand < 0.7) return 2500 + Math.random() * 1200; // M-type
  if (rand < 0.85) return 3700 + Math.random() * 1500; // K-type
  if (rand < 0.92) return 5200 + Math.random() * 800;  // G-type
  if (rand < 0.96) return 6000 + Math.random() * 1500; // F-type
  if (rand < 0.98) return 7500 + Math.random() * 2500; // A-type
  if (rand < 0.995) return 10000 + Math.random() * 20000; // B-type
  return 30000 + Math.random() * 20000; // O-type
}

/**
 * Create a realistic star with proper stellar properties
 */
export function createRealisticStar(
  id: string,
  orbitRadius: number = 4.5,
  temperature?: number
): StarData {
  const starTemp = temperature || generateStarTemperature();
  const color = getStarColorByTemperature(starTemp);
  
  // Hotter stars are generally larger and brighter
  const sizeFactor = Math.log(starTemp / 3000) * 0.2;
  const intensityFactor = Math.log(starTemp / 3000) * 0.3;
  
  return {
    id,
    color,
    size: Math.max(0.3, 0.7 + sizeFactor + Math.random() * 0.3),
    position: [0, 0, orbitRadius], // Will be updated by orbital motion
    status: 'orbiting',
    orbitSpeed: 0.05 + Math.random() * 0.2,
    isOwned: false,
    twinkleSpeed: 0.5 + Math.random() * 1.5,
    baseIntensity: Math.max(0.2, 0.5 + intensityFactor + Math.random() * 0.3),
  };
}

/**
 * Generate a field of realistic stars
 */
export function generateRealisticStarField(count: number = 15): StarData[] {
  const stars: StarData[] = [];
  
  for (let i = 0; i < count; i++) {
    const orbitRadius = 4.5 + Math.random() * 3; // Vary orbital distance
    const star = createRealisticStar(`realistic-star-${i}`, orbitRadius);
    stars.push(star);
  }
  
  return stars;
}