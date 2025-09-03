import { Visitor } from '@/types';

export const mockVisitors: Visitor[] = [
  {
    id: 'visitor-1',
    ipHash: 'hash-us-1',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.0060,
    createdAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: 'visitor-2',
    ipHash: 'hash-uk-1',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    createdAt: new Date('2024-01-15T11:15:00Z')
  },
  {
    id: 'visitor-3',
    ipHash: 'hash-jp-1',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    createdAt: new Date('2024-01-15T12:00:00Z')
  },
  {
    id: 'visitor-4',
    ipHash: 'hash-au-1',
    country: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
    createdAt: new Date('2024-01-15T13:45:00Z')
  },
  {
    id: 'visitor-5',
    ipHash: 'hash-de-1',
    country: 'Germany',
    latitude: 52.5200,
    longitude: 13.4050,
    createdAt: new Date('2024-01-15T14:20:00Z')
  },
  {
    id: 'visitor-6',
    ipHash: 'hash-ca-1',
    country: 'Canada',
    latitude: 43.6532,
    longitude: -79.3832,
    createdAt: new Date('2024-01-15T15:10:00Z')
  },
  {
    id: 'visitor-7',
    ipHash: 'hash-br-1',
    country: 'Brazil',
    latitude: -23.5505,
    longitude: -46.6333,
    createdAt: new Date('2024-01-15T16:30:00Z')
  },
  {
    id: 'visitor-8',
    ipHash: 'hash-in-1',
    country: 'India',
    latitude: 28.7041,
    longitude: 77.1025,
    createdAt: new Date('2024-01-15T17:00:00Z')
  },
  {
    id: 'visitor-9',
    ipHash: 'hash-fr-1',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    createdAt: new Date('2024-01-15T18:15:00Z')
  },
  {
    id: 'visitor-10',
    ipHash: 'hash-kr-1',
    country: 'South Korea',
    latitude: 37.5665,
    longitude: 126.9780,
    createdAt: new Date('2024-01-15T19:45:00Z')
  },
  {
    id: 'visitor-11',
    ipHash: 'hash-mx-1',
    country: 'Mexico',
    latitude: 19.4326,
    longitude: -99.1332,
    createdAt: new Date('2024-01-15T20:30:00Z')
  },
  {
    id: 'visitor-12',
    ipHash: 'hash-it-1',
    country: 'Italy',
    latitude: 41.9028,
    longitude: 12.4964,
    createdAt: new Date('2024-01-15T21:00:00Z')
  }
];

export const getCurrentVisitor = (): Visitor => {
  return {
    id: 'current-visitor',
    ipHash: 'current-hash',
    country: 'United States',
    latitude: 37.7749,
    longitude: -122.4194,
    createdAt: new Date()
  };
};