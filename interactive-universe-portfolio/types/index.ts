export interface Visitor {
  id: string;
  ipHash: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
}

export interface Star {
  id: string;
  visitorId: string;
  status: 'orbiting' | 'falling' | 'landed';
  color: string;
  size: number;
  orbitSpeed: number;
  hasEmail: boolean;
  name?: string;
  position?: [number, number, number];
  targetLocation?: { lat: number; lon: number };
  isOwned?: boolean;
  twinkleSpeed?: number;
  baseIntensity?: number;
}

export interface StarData {
  id: string;
  color: string;
  size: number;
  position: [number, number, number];
  status: 'orbiting' | 'falling' | 'landed';
  orbitSpeed: number;
  isOwned: boolean;
  name?: string;
  twinkleSpeed: number;
  baseIntensity: number;
}

export interface GeoLocation {
  country: string;
  region?: string;
  city?: string;
  latitude: number;
  longitude: number;
}

export interface PublicStar {
  id: string;
  status: string;
  color: string;
  size: number;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  hasName: boolean;
}