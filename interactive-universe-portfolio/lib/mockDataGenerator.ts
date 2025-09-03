import { Star, Visitor } from '@/types';
import { StarData, REALISTIC_STAR_COLORS } from '@/types/star';

/**
 * Generate random mock visitors with realistic geographic distribution
 */
export function generateRandomVisitors(count: number = 10): Visitor[] {
  const countries = [
    { name: 'United States', lat: 39.8283, lon: -98.5795 },
    { name: 'United Kingdom', lat: 55.3781, lon: -3.4360 },
    { name: 'Germany', lat: 51.1657, lon: 10.4515 },
    { name: 'France', lat: 46.2276, lon: 2.2137 },
    { name: 'Japan', lat: 36.2048, lon: 138.2529 },
    { name: 'Australia', lat: -25.2744, lon: 133.7751 },
    { name: 'Canada', lat: 56.1304, lon: -106.3468 },
    { name: 'Brazil', lat: -14.2350, lon: -51.9253 },
    { name: 'India', lat: 20.5937, lon: 78.9629 },
    { name: 'South Korea', lat: 35.9078, lon: 127.7669 },
    { name: 'Mexico', lat: 23.6345, lon: -102.5528 },
    { name: 'Italy', lat: 41.8719, lon: 12.5674 },
    { name: 'Spain', lat: 40.4637, lon: -3.7492 },
    { name: 'Netherlands', lat: 52.1326, lon: 5.2913 },
    { name: 'Sweden', lat: 60.1282, lon: 18.6435 }
  ];

  const visitors: Visitor[] = [];

  for (let i = 0; i < count; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const timeOffset = Math.random() * 24 * 60 * 60 * 1000; // Random time within last 24 hours
    
    visitors.push({
      id: `generated-visitor-${i + 1}`,
      ipHash: `generated-hash-${i + 1}`,
      country: country.name,
      latitude: country.lat + (Math.random() - 0.5) * 10, // Add some variation
      longitude: country.lon + (Math.random() - 0.5) * 10,
      createdAt: new Date(Date.now() - timeOffset)
    });
  }

  return visitors;
}

/**
 * Generate random mock stars with realistic properties
 */
export function generateRandomStars(visitors: Visitor[], currentUserId?: string): Star[] {
  const colors = Object.values(REALISTIC_STAR_COLORS);
  const statuses: Array<'orbiting' | 'falling' | 'landed'> = ['orbiting', 'falling', 'landed'];
  const stars: Star[] = [];

  visitors.forEach((visitor, index) => {
    const hasEmail = Math.random() > 0.4; // 60% chance of having email
    const status = hasEmail ? 
      statuses[Math.floor(Math.random() * statuses.length)] : 
      'orbiting'; // Only orbiting if no email

    // Generate orbital position
    const angle = (index / visitors.length) * Math.PI * 2;
    const radius = 3.5 + Math.random() * 1.5;
    const height = (Math.random() - 0.5) * 2.0;

    let position: [number, number, number];
    let targetLocation: { lat: number; lon: number } | undefined;

    if (status === 'landed' && visitor.latitude && visitor.longitude) {
      // Convert lat/lon to 3D position on Earth surface (simplified)
      const lat = (visitor.latitude * Math.PI) / 180;
      const lon = (visitor.longitude * Math.PI) / 180;
      const earthRadius = 1.0;
      
      position = [
        earthRadius * Math.cos(lat) * Math.cos(lon),
        earthRadius * Math.sin(lat),
        earthRadius * Math.cos(lat) * Math.sin(lon)
      ];
      targetLocation = { lat: visitor.latitude, lon: visitor.longitude };
    } else {
      // Orbital position
      position = [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ];
      if (hasEmail && visitor.latitude && visitor.longitude) {
        targetLocation = { lat: visitor.latitude, lon: visitor.longitude };
      }
    }

    const star: Star = {
      id: `generated-star-${visitor.id}`,
      visitorId: visitor.id,
      status,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 0.6 + Math.random() * 0.8,
      orbitSpeed: 0.05 + Math.random() * 0.15,
      hasEmail,
      position,
      targetLocation
    };

    // Add name if has email and not current user
    if (hasEmail && visitor.id !== currentUserId) {
      const names = [
        'Cosmic Explorer', 'Star Wanderer', 'Galaxy Traveler', 'Space Visitor',
        'Stellar Observer', 'Universe Walker', 'Astro Nomad', 'Celestial Guest',
        'Orbit Dancer', 'Starlight Seeker', 'Cosmic Drifter', 'Space Pioneer'
      ];
      star.name = `${names[Math.floor(Math.random() * names.length)]} ${index + 1}`;
    }

    stars.push(star);
  });

  return stars;
}

/**
 * Convert geographic coordinates to 3D Earth surface position
 */
export function latLonToPosition(lat: number, lon: number, radius: number = 1.0): [number, number, number] {
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  
  return [
    radius * Math.cos(latRad) * Math.cos(lonRad),
    radius * Math.sin(latRad),
    radius * Math.cos(latRad) * Math.sin(lonRad)
  ];
}

/**
 * Generate a complete mock dataset with visitors and stars
 */
export function generateMockDataset(visitorCount: number = 15, currentUserId?: string) {
  const visitors = generateRandomVisitors(visitorCount);
  const stars = generateRandomStars(visitors, currentUserId);
  
  return {
    visitors,
    stars,
    currentUser: currentUserId ? visitors.find(v => v.id === currentUserId) : null,
    currentUserStar: currentUserId ? stars.find(s => s.visitorId === currentUserId) : null
  };
}

/**
 * Convert Star to StarData for 3D rendering
 */
export function convertStarToStarData(star: Star, isOwned: boolean = false): StarData {
  return {
    id: star.id,
    color: star.color,
    size: star.size,
    position: star.position || [0, 0, 0],
    status: star.status,
    orbitSpeed: star.orbitSpeed,
    isOwned: isOwned,
    name: star.name,
    twinkleSpeed: Math.random() * 2 + 0.8, // Random between 0.8-2.8
    baseIntensity: Math.random() * 0.4 + 0.6, // Random between 0.6-1.0
    targetLocation: star.targetLocation
  };
}

/**
 * Simulate real-time star updates
 */
export function simulateStarUpdates(stars: Star[]): Star[] {
  return stars.map(star => {
    // Simulate occasional status changes
    if (Math.random() < 0.05) { // 5% chance of status change
      if (star.status === 'orbiting' && star.hasEmail) {
        return { ...star, status: 'falling' as const };
      } else if (star.status === 'falling') {
        return { ...star, status: 'landed' as const };
      }
    }
    
    // Simulate position updates for orbiting stars
    if (star.status === 'orbiting' && star.position) {
      const [x, y, z] = star.position;
      const angle = star.orbitSpeed * 0.1;
      const newX = x * Math.cos(angle) - z * Math.sin(angle);
      const newZ = x * Math.sin(angle) + z * Math.cos(angle);
      
      return {
        ...star,
        position: [newX, y, newZ] as [number, number, number]
      };
    }
    
    return star;
  });
}