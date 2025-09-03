import { StarData } from '@/types';
import { generateRealisticStarField, createRealisticStar } from '@/lib/starUtils';

// Realistic star colors based on stellar classification
export const STAR_COLORS = {
  WHITE: '#ffffff',        // O-type stars (hottest)
  BLUE_WHITE: '#aabbff',   // B-type stars
  WHITE_MAIN: '#f8f8ff',   // A-type stars
  YELLOW_WHITE: '#fff2e0', // F-type stars
  YELLOW: '#ffff99',       // G-type stars (like our Sun)
  ORANGE: '#ffcc66',       // K-type stars
  RED_ORANGE: '#ff9966',   // M-type stars (coolest)
  GOLD: '#d4af37',         // Special gold for premium effect
};

/**
 * Generate premium twinkling stars with varied colors and properties
 */
export function generateTwinklingStars(count: number = 12): StarData[] {
  const colors = Object.values(STAR_COLORS);
  const stars: StarData[] = [];

  for (let i = 0; i < count; i++) {
    // Generate orbital position
    const angle = (i / count) * Math.PI * 2;
    const radius = 5 + Math.random() * 2; // Vary orbital distance
    const height = (Math.random() - 0.5) * 2; // Vary height

    const star: StarData = {
      id: `twinkling-star-${i}`,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 0.5 + Math.random() * 1.0, // Vary size between 0.5 and 1.5
      position: [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ],
      status: 'orbiting',
      orbitSpeed: 0.1 + Math.random() * 0.3, // Vary orbit speed
      isOwned: false,
      twinkleSpeed: 0.5 + Math.random() * 2.0, // Vary twinkling speed
      baseIntensity: 0.3 + Math.random() * 0.7, // Vary base brightness
    };

    stars.push(star);
  }

  return stars;
}

/**
 * Generate a constellation pattern of stars
 */
export function generateConstellation(): StarData[] {
  // Create a simple constellation pattern (like Big Dipper)
  const constellationPositions: [number, number, number][] = [
    [6, 2, 1],
    [5, 1.5, 2],
    [4, 1, 1.5],
    [3, 0.5, 1],
    [2, 0, 0.5],
    [1.5, -0.5, 0],
    [1, -1, -0.5],
  ];

  return constellationPositions.map((position, i) => ({
    id: `constellation-star-${i}`,
    color: i === 0 ? STAR_COLORS.GOLD : STAR_COLORS.WHITE,
    size: i === 0 ? 1.2 : 0.8,
    position,
    status: 'orbiting' as const,
    orbitSpeed: 0.05 + i * 0.01, // Slightly different speeds
    isOwned: false,
    twinkleSpeed: 1.0 + Math.random() * 0.5,
    baseIntensity: i === 0 ? 1.0 : 0.6,
  }));
}

/**
 * Generate visitor stars (stars representing actual visitors)
 */
export function generateVisitorStars(visitorCount: number = 5): StarData[] {
  const stars: StarData[] = [];

  for (let i = 0; i < visitorCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 4.5 + Math.random() * 1.5;
    const height = (Math.random() - 0.5) * 1.5;

    const star: StarData = {
      id: `visitor-star-${i}`,
      color: i === 0 ? STAR_COLORS.GOLD : STAR_COLORS.BLUE_WHITE, // First star is current user
      size: i === 0 ? 1.0 : 0.7 + Math.random() * 0.3,
      position: [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ],
      status: Math.random() > 0.7 ? 'landed' : 'orbiting', // Some stars have landed
      orbitSpeed: 0.2 + Math.random() * 0.2,
      isOwned: i === 0, // First star belongs to current user
      name: i === 0 ? undefined : `Visitor ${i}`, // Only show names for other users' stars
      twinkleSpeed: 0.8 + Math.random() * 1.0,
      baseIntensity: i === 0 ? 0.9 : 0.4 + Math.random() * 0.4,
    };

    stars.push(star);
  }

  return stars;
}

/**
 * Get all premium twinkling stars for the scene
 */
export function getAllTwinklingStars(): StarData[] {
  return [
    ...generateRealisticStarField(10), // Realistic background stars
    ...generateVisitorStars(4),        // Visitor stars
    ...generateConstellation(),        // Constellation pattern
  ];
}

/**
 * Generate a single premium star with specific properties
 */
export function generatePremiumStar(
  id: string,
  color: string = STAR_COLORS.WHITE,
  position: [number, number, number] = [0, 0, 5]
): StarData {
  return {
    id,
    color,
    size: 0.8 + Math.random() * 0.4,
    position,
    status: 'orbiting',
    orbitSpeed: 0.1 + Math.random() * 0.2,
    isOwned: false,
    twinkleSpeed: 0.5 + Math.random() * 1.5,
    baseIntensity: 0.4 + Math.random() * 0.6,
  };
}