import { StarData, REALISTIC_STAR_COLORS } from '@/types/star';
import { Star } from '@/types';
import { mockVisitors } from './mockVisitors';

/**
 * Mock star data with varied colors and twinkling rates for testing
 */

export const mockStars: StarData[] = [
  {
    id: 'star-1',
    color: REALISTIC_STAR_COLORS.WHITE,
    size: 1.0,
    position: [4.5, 0, 0],
    status: 'orbiting',
    orbitSpeed: 0.15,
    isOwned: false,
    twinkleSpeed: 1.2,
    baseIntensity: 0.8,
  },
  {
    id: 'star-2',
    color: REALISTIC_STAR_COLORS.BLUE_WHITE,
    size: 0.8,
    position: [0, 0, 4.5],
    status: 'orbiting',
    orbitSpeed: 0.12,
    isOwned: false,
    twinkleSpeed: 0.9,
    baseIntensity: 0.7,
  },
  {
    id: 'star-3',
    color: REALISTIC_STAR_COLORS.YELLOW,
    size: 1.2,
    position: [-4.5, 0, 0],
    status: 'orbiting',
    orbitSpeed: 0.18,
    isOwned: true,
    name: 'My Star',
    twinkleSpeed: 1.5,
    baseIntensity: 0.9,
  },
  {
    id: 'star-4',
    color: REALISTIC_STAR_COLORS.ORANGE,
    size: 0.9,
    position: [0, 0, -4.5],
    status: 'orbiting',
    orbitSpeed: 0.10,
    isOwned: false,
    twinkleSpeed: 0.7,
    baseIntensity: 0.6,
  },
  {
    id: 'star-5',
    color: REALISTIC_STAR_COLORS.RED_ORANGE,
    size: 0.7,
    position: [3.2, 1.5, 3.2],
    status: 'orbiting',
    orbitSpeed: 0.20,
    isOwned: false,
    twinkleSpeed: 1.8,
    baseIntensity: 0.5,
  },
  {
    id: 'star-6',
    color: REALISTIC_STAR_COLORS.GOLD,
    size: 1.1,
    position: [-3.2, -1.5, 3.2],
    status: 'landed',
    orbitSpeed: 0,
    isOwned: false,
    twinkleSpeed: 1.0,
    baseIntensity: 0.8,
  },
  {
    id: 'star-7',
    color: REALISTIC_STAR_COLORS.WHITE_MAIN,
    size: 0.6,
    position: [2.8, 2.0, -2.8],
    status: 'orbiting',
    orbitSpeed: 0.25,
    isOwned: false,
    twinkleSpeed: 2.0,
    baseIntensity: 0.4,
  },
  {
    id: 'star-8',
    color: REALISTIC_STAR_COLORS.YELLOW_WHITE,
    size: 0.8,
    position: [-2.8, 1.0, -2.8],
    status: 'falling',
    orbitSpeed: 0.08,
    isOwned: false,
    twinkleSpeed: 1.3,
    baseIntensity: 0.7,
    targetLocation: { lat: 40.7128, lon: -74.0060 }, // New York coordinates
  },
];

/**
 * Generate additional random mock stars
 */
export function generateRandomMockStars(count: number = 5): StarData[] {
  const colors = Object.values(REALISTIC_STAR_COLORS);
  const stars: StarData[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 4.0 + Math.random() * 2.0;
    const height = (Math.random() - 0.5) * 3.0;

    stars.push({
      id: `random-star-${i + 9}`,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 0.5 + Math.random() * 0.8,
      position: [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ],
      status: Math.random() > 0.8 ? 'landed' : 'orbiting',
      orbitSpeed: 0.05 + Math.random() * 0.2,
      isOwned: false,
      twinkleSpeed: 0.5 + Math.random() * 2.0,
      baseIntensity: 0.3 + Math.random() * 0.6,
    });
  }

  return stars;
}

/**
 * Comprehensive mock stars with visitor relationships
 */
export const mockStarsWithVisitors: Star[] = [
  {
    id: 'star-1',
    visitorId: 'visitor-1',
    status: 'orbiting',
    color: REALISTIC_STAR_COLORS.WHITE,
    size: 1.0,
    orbitSpeed: 0.15,
    hasEmail: false,
    position: [4.5, 0, 0]
  },
  {
    id: 'star-2',
    visitorId: 'visitor-2',
    status: 'landed',
    color: REALISTIC_STAR_COLORS.BLUE_WHITE,
    size: 0.8,
    orbitSpeed: 0.12,
    hasEmail: true,
    name: 'London Explorer',
    position: [0.8, 0.3, 1.1],
    targetLocation: { lat: 51.5074, lon: -0.1278 }
  },
  {
    id: 'star-3',
    visitorId: 'visitor-3',
    status: 'landed',
    color: REALISTIC_STAR_COLORS.YELLOW,
    size: 1.2,
    orbitSpeed: 0.18,
    hasEmail: true,
    name: 'Tokyo Wanderer',
    position: [0.9, 0.2, 0.8],
    targetLocation: { lat: 35.6762, lon: 139.6503 }
  },
  {
    id: 'star-4',
    visitorId: 'visitor-4',
    status: 'orbiting',
    color: REALISTIC_STAR_COLORS.ORANGE,
    size: 0.9,
    orbitSpeed: 0.10,
    hasEmail: false,
    position: [0, 0, -4.5]
  },
  {
    id: 'star-5',
    visitorId: 'visitor-5',
    status: 'falling',
    color: REALISTIC_STAR_COLORS.RED_ORANGE,
    size: 0.7,
    orbitSpeed: 0.20,
    hasEmail: true,
    name: 'Berlin Visitor',
    position: [3.2, 1.5, 3.2],
    targetLocation: { lat: 52.5200, lon: 13.4050 }
  },
  {
    id: 'star-6',
    visitorId: 'visitor-6',
    status: 'orbiting',
    color: REALISTIC_STAR_COLORS.GOLD,
    size: 1.1,
    orbitSpeed: 0.14,
    hasEmail: false,
    position: [-3.2, -1.5, 3.2]
  },
  {
    id: 'star-7',
    visitorId: 'visitor-7',
    status: 'landed',
    color: REALISTIC_STAR_COLORS.WHITE_MAIN,
    size: 0.6,
    orbitSpeed: 0.25,
    hasEmail: true,
    name: 'São Paulo Star',
    position: [-0.4, -0.7, 0.9],
    targetLocation: { lat: -23.5505, lon: -46.6333 }
  },
  {
    id: 'star-8',
    visitorId: 'visitor-8',
    status: 'falling',
    color: REALISTIC_STAR_COLORS.YELLOW_WHITE,
    size: 0.8,
    orbitSpeed: 0.08,
    hasEmail: true,
    name: 'Delhi Light',
    position: [-2.8, 1.0, -2.8],
    targetLocation: { lat: 28.7041, lon: 77.1025 }
  },
  {
    id: 'star-9',
    visitorId: 'visitor-9',
    status: 'orbiting',
    color: REALISTIC_STAR_COLORS.BLUE_WHITE,
    size: 1.15,
    orbitSpeed: 0.16,
    hasEmail: true,
    name: 'Paris Light',
    position: [2.5, -2.0, 1.8],
    targetLocation: { lat: 48.8566, lon: 2.3522 }
  },
  {
    id: 'star-10',
    visitorId: 'visitor-10',
    status: 'landed',
    color: REALISTIC_STAR_COLORS.ORANGE,
    size: 0.95,
    orbitSpeed: 0.13,
    hasEmail: true,
    name: 'Seoul Spark',
    position: [0.7, 0.4, 0.9],
    targetLocation: { lat: 37.5665, lon: 126.9780 }
  },
  {
    id: 'star-11',
    visitorId: 'visitor-11',
    status: 'orbiting',
    color: REALISTIC_STAR_COLORS.RED_ORANGE,
    size: 1.05,
    orbitSpeed: 0.11,
    hasEmail: false,
    position: [1.8, -3.2, 2.1]
  },
  {
    id: 'star-12',
    visitorId: 'visitor-12',
    status: 'falling',
    color: REALISTIC_STAR_COLORS.GOLD,
    size: 0.9,
    orbitSpeed: 0.09,
    hasEmail: true,
    name: 'Roma Stella',
    position: [-1.5, 2.8, -2.0],
    targetLocation: { lat: 41.9028, lon: 12.4964 }
  }
];

// Convert Star to StarData for 3D rendering
export const convertToStarData = (star: Star, isOwned: boolean = false): StarData => {
  return {
    id: star.id,
    color: star.color,
    size: star.size,
    position: star.position || [0, 0, 0],
    status: star.status,
    orbitSpeed: star.orbitSpeed,
    isOwned: isOwned,
    name: star.name,
    twinkleSpeed: Math.random() * 2 + 1, // Random between 1-3
    baseIntensity: Math.random() * 0.5 + 0.8, // Random between 0.8-1.3
    targetLocation: star.targetLocation
  };
};

// Get current user's star
export const getCurrentUserStar = (): Star => {
  return {
    id: 'current-user-star',
    visitorId: 'current-visitor',
    status: 'orbiting',
    color: REALISTIC_STAR_COLORS.GOLD,
    size: 1.3,
    orbitSpeed: 0.11,
    hasEmail: false,
    position: [1, 1, 2]
  };
};

/**
 * Get all mock stars for testing
 */
export function getAllMockStars(): StarData[] {
  return [...mockStars, ...generateRandomMockStars(7)];
}