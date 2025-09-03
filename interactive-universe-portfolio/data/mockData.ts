import { Star, Visitor, PublicStar } from '@/types';
import { 
  generateId, 
  generateStarColor, 
  generateOrbitSpeed, 
  generateTwinkleSpeed, 
  generateBaseIntensity,
  generateOrbitPosition,
  hashIP 
} from '@/lib/utils';

// Mock visitor data
export const mockVisitors: Visitor[] = [
  {
    id: generateId(),
    ipHash: hashIP('192.168.1.1'),
    country: 'United States',
    region: 'California',
    city: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: generateId(),
    ipHash: hashIP('10.0.0.1'),
    country: 'United Kingdom',
    region: 'England',
    city: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
  },
  {
    id: generateId(),
    ipHash: hashIP('172.16.0.1'),
    country: 'Japan',
    region: 'Tokyo',
    city: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: generateId(),
    ipHash: hashIP('203.0.113.1'),
    country: 'Australia',
    region: 'New South Wales',
    city: 'Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
    createdAt: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
  },
  {
    id: generateId(),
    ipHash: hashIP('198.51.100.1'),
    country: 'Germany',
    region: 'Berlin',
    city: 'Berlin',
    latitude: 52.5200,
    longitude: 13.4050,
    createdAt: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
  },
];

// Generate mock stars based on visitors
export const mockStars: Star[] = mockVisitors.map((visitor, index) => ({
  id: generateId(),
  visitorId: visitor.id,
  color: generateStarColor(),
  size: 0.8 + Math.random() * 0.4, // Between 0.8 and 1.2
  position: generateOrbitPosition(),
  status: index < 2 ? 'orbiting' : (index < 4 ? 'falling' : 'landed'),
  orbitSpeed: generateOrbitSpeed(),
  isOwned: false, // Will be set to true for current user's star
  twinkleSpeed: generateTwinkleSpeed(),
  baseIntensity: generateBaseIntensity(),
  hasEmail: index >= 2, // Some stars have email, some don't
  name: index >= 2 ? `Visitor ${index + 1}` : undefined,
  targetLocation: visitor.latitude && visitor.longitude ? {
    lat: visitor.latitude,
    lon: visitor.longitude
  } : undefined,
}));

// Create public stars (without personal information)
export const mockPublicStars: PublicStar[] = mockStars.map(star => ({
  id: star.id,
  status: star.status,
  color: star.color,
  size: star.size,
  position: star.position ? {
    x: star.position[0],
    y: star.position[1],
    z: star.position[2],
  } : undefined,
  hasName: star.hasEmail,
}));

// Sample countries for random generation
export const sampleCountries = [
  { name: 'United States', lat: 39.8283, lon: -98.5795 },
  { name: 'United Kingdom', lat: 55.3781, lon: -3.4360 },
  { name: 'Germany', lat: 51.1657, lon: 10.4515 },
  { name: 'France', lat: 46.2276, lon: 2.2137 },
  { name: 'Japan', lat: 36.2048, lon: 138.2529 },
  { name: 'Australia', lat: -25.2744, lon: 133.7751 },
  { name: 'Canada', lat: 56.1304, lon: -106.3468 },
  { name: 'Brazil', lat: -14.2350, lon: -51.9253 },
  { name: 'India', lat: 20.5937, lon: 78.9629 },
  { name: 'China', lat: 35.8617, lon: 104.1954 },
  { name: 'Russia', lat: 61.5240, lon: 105.3188 },
  { name: 'South Korea', lat: 35.9078, lon: 127.7669 },
  { name: 'Italy', lat: 41.8719, lon: 12.5674 },
  { name: 'Spain', lat: 40.4637, lon: -3.7492 },
  { name: 'Netherlands', lat: 52.1326, lon: 5.2913 },
];

/**
 * Generate a random visitor
 */
export function generateRandomVisitor(): Visitor {
  const country = sampleCountries[Math.floor(Math.random() * sampleCountries.length)];
  const randomIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  
  return {
    id: generateId(),
    ipHash: hashIP(randomIP),
    country: country.name,
    latitude: country.lat + (Math.random() - 0.5) * 10, // Add some randomness
    longitude: country.lon + (Math.random() - 0.5) * 10,
    createdAt: new Date(),
  };
}

/**
 * Generate a random star for a visitor
 */
export function generateRandomStar(visitorId: string, hasEmail: boolean = false): Star {
  return {
    id: generateId(),
    visitorId,
    color: generateStarColor(),
    size: 0.8 + Math.random() * 0.4,
    position: generateOrbitPosition(),
    status: 'orbiting',
    orbitSpeed: generateOrbitSpeed(),
    isOwned: false,
    twinkleSpeed: generateTwinkleSpeed(),
    baseIntensity: generateBaseIntensity(),
    hasEmail,
    name: hasEmail ? `Visitor ${Math.floor(Math.random() * 1000)}` : undefined,
  };
}

/**
 * Get current user's star (mock)
 */
export function getCurrentUserStar(): Star {
  return {
    id: 'current-user-star',
    visitorId: 'current-user',
    color: '#d4af37', // Gold color for current user
    size: 1.2,
    position: generateOrbitPosition(),
    status: 'orbiting',
    orbitSpeed: generateOrbitSpeed(),
    isOwned: true,
    twinkleSpeed: generateTwinkleSpeed(),
    baseIntensity: 1.0,
    hasEmail: false,
  };
}

/**
 * Mock API response for visit tracking
 */
export function mockVisitResponse(): {
  visitor: Visitor;
  star: Star;
  activeStars: PublicStar[];
  sessionId: string;
} {
  const visitor = generateRandomVisitor();
  const star = generateRandomStar(visitor.id);
  
  return {
    visitor,
    star,
    activeStars: mockPublicStars,
    sessionId: generateId(),
  };
}

/**
 * Mock API response for email submission
 */
export function mockEmailSubmissionResponse(email: string, name?: string): {
  success: boolean;
  star: Star;
  message: string;
} {
  const updatedStar = getCurrentUserStar();
  updatedStar.hasEmail = true;
  updatedStar.name = name || email.split('@')[0];
  updatedStar.status = 'falling';
  
  return {
    success: true,
    star: updatedStar,
    message: 'Email submitted successfully! Your star is now falling to Earth.',
  };
}

/**
 * Mock API response for active stars
 */
export function mockActiveStarsResponse(): {
  stars: PublicStar[];
  count: number;
  hasMore: boolean;
} {
  return {
    stars: mockPublicStars,
    count: mockPublicStars.length,
    hasMore: false,
  };
}