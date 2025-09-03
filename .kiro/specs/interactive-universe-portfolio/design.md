# Design Document

## Overview

The Interactive Universe Portfolio is a premium 3D web application featuring a sophisticated entrance experience and rotating Earth with meteor-style stars in a luxury dark theme interface. The experience begins with an elegant landing page featuring minimal content and an "Enter to my World" button with premium Earth animations. The frontend-first approach focuses on creating a complete, interactive 3D universe experience with real-time data before backend integration. Built with Next.js, React Three Fiber, and sophisticated animations, it provides an immersive portfolio experience with professional-grade UI/UX design.

### Premium Entrance Experience

#### Landing Page Design
- **Minimal elegant layout** with dark luxury theme and premium typography
- **Centered "Enter to my World" button** as primary call-to-action with sophisticated hover effects
- **Animated Earth background** with smooth rotation and atmospheric effects
- **GitHub profile link** prominently displayed in top navigation (https://github.com/YxshR)
- **Smooth transition animation** when entering the main universe experience
- **Professional loading states** with brand-consistent animations

#### Visual Hierarchy
- **Large-scale Earth model** (2.5x standard size) for maximum visual impact
- **Crystal-clear continent details** with realistic country boundaries and topography
- **Professional lighting and shadows** for depth and realism
- **Smooth orbital animations** for meteor-style visitor representations
- **Clean, uncluttered interface** removing any square or placeholder elements

## Architecture

### Frontend-First Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                     │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Premium UI    │  │   3D Universe   │  │  Portfolio  │ │
│  │   Components    │  │     Scene       │  │   Content   │ │
│  │                 │  │                 │  │             │ │
│  │ • Glass Cards   │  │ • Earth Model   │  │ • About     │ │
│  │ • Luxury Forms  │  │ • Star System   │  │ • Projects  │ │
│  │ • Dark Theme    │  │ • Animations    │  │ • Skills    │ │
│  │ • Animations    │  │ • WebGL Canvas  │  │ • Contact   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              State Management & Mock Data               │ │
│  │                                                         │ │
│  │ • Local State (React Hooks)                            │ │
│  │ • Mock Star Data                                       │ │
│  │ • Session Management (localStorage)                    │ │
│  │ • User Interaction Handlers                            │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend Core:**
- Next.js 14+ with React 18+ and TypeScript
- React Three Fiber (@react-three/fiber) for 3D rendering
- Three.js for WebGL graphics and animations
- Tailwind CSS with custom premium dark theme
- Framer Motion for sophisticated animations

**UI/UX Libraries:**
- Lucide React for premium icons
- Custom glass morphism components
- Premium typography (Inter + Playfair Display)
- Responsive design utilities

**Development Tools:**
- TypeScript for type safety
- ESLint and Prettier for code quality
- Jest and React Testing Library for testing
- Absolute imports for clean code organization

**Mock Data System:**
- Local state management with React hooks
- Mock star and visitor data structures
- localStorage for session persistence
- Simulated real-time interactions

## Components and Interfaces

### Frontend Components

#### 1. UniverseScene Component
```typescript
interface UniverseSceneProps {
  stars: Star[];
  myStarId: string;
  onEmailSubmit: (email: string, name: string) => void;
}
```

**Responsibilities:**
- Render 3D Earth with realistic textures (day/night mapping)
- Display orbiting and landed stars
- Handle camera controls and user interactions
- Manage star animations (orbit, fall, land)

#### 2. Earth Component
```typescript
interface EarthProps {
  rotation: number;
  textures: {
    day: string;
    night: string;
    bump: string;
    clouds?: string;
  };
}
```

**Responsibilities:**
- Render textured sphere with day/night cycle
- Apply bump mapping for surface detail
- Optional cloud layer animation
- Semi-realistic styling with subtle effects

#### 3. StarMesh Component
```typescript
interface StarMeshProps {
  star: Star;
  isOwned: boolean;
  time: number;
}
```

**Responsibilities:**
- Render individual star with unique color/size
- Animate orbital motion or falling trajectory
- Show name label only for owned stars
- Handle star state transitions

#### 4. UI Overlay Components
- EmailForm: Premium glass-morphism design with elegant animations
- PrivacyBanner: Subtle dark theme compliance banner
- PortfolioNavigation: Luxury navigation with smooth transitions
- StarCounter: Elegant visitor counter with premium typography
- LoadingScreen: Sophisticated loading animation with brand elements

### Frontend API Interfaces (Ready for Backend Integration)

#### 1. Visit Tracking API Interface
```typescript
// POST /api/visit (Future Backend Endpoint)
interface VisitRequest {
  userAgent?: string;
  timestamp: Date;
}

interface VisitResponse {
  visitor: Visitor;
  star: Star;
  activeStars: PublicStar[];
  sessionId: string;
}

// Frontend Mock Implementation
const mockVisitAPI = async (): Promise<VisitResponse> => {
  // Generate mock visitor and star data
  // Return simulated response for frontend development
}
```

#### 2. Email Submission API Interface
```typescript
// POST /api/submit-email (Future Backend Endpoint)
interface EmailRequest {
  starId: string;
  email: string;
  name?: string;
  sessionId: string;
}

interface EmailResponse {
  success: boolean;
  star: Star;
  message: string;
}

// Frontend Mock Implementation
const mockEmailSubmissionAPI = async (data: EmailRequest): Promise<EmailResponse> => {
  // Simulate email validation and star update
  // Return mock success response
}
```

#### 3. Stars Data API Interface
```typescript
// GET /api/stars (Future Backend Endpoint)
interface StarsRequest {
  limit?: number;
  offset?: number;
}

interface StarsResponse {
  stars: PublicStar[];
  count: number;
  hasMore: boolean;
}

// Frontend Mock Implementation
const mockStarsAPI = async (): Promise<StarsResponse> => {
  // Return mock active stars data
  // Simulate real-time star updates
}
```

### Real-time Event System

#### Pusher Channel Events
```typescript
interface StarCreatedEvent {
  type: 'star-created';
  star: PublicStar;
}

interface StarFallEvent {
  type: 'star-fall';
  starId: string;
  targetLat: number;
  targetLon: number;
  duration: number;
}

interface StarLandedEvent {
  type: 'star-landed';
  starId: string;
  location: GeoLocation;
}

interface StarDisconnectedEvent {
  type: 'star-disconnected';
  starId: string;
}
```

## Data Models

### Database Schema

#### Visitors Table
```sql
CREATE TABLE visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL, -- Hashed IP for privacy
  country text,
  region text,
  city text,
  latitude double precision,
  longitude double precision,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### Stars Table
```sql
CREATE TABLE stars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid REFERENCES visitors(id) ON DELETE CASCADE,
  ip_hash text NOT NULL,
  status text DEFAULT 'orbiting', -- 'orbiting' | 'falling' | 'landed'
  has_email boolean DEFAULT false,
  name text, -- Only stored when email provided
  color text NOT NULL, -- Hex color code
  size real DEFAULT 1.0,
  orbit_speed real DEFAULT 1.0,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
```

#### Star Events Table
```sql
CREATE TABLE star_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  star_id uuid REFERENCES stars(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'created' | 'email_added' | 'landed' | 'disconnected'
  payload jsonb,
  created_at timestamptz DEFAULT now()
);
```

### TypeScript Interfaces

```typescript
interface Visitor {
  id: string;
  ipHash: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
}

interface Star {
  id: string;
  visitorId: string;
  ipHash: string;
  status: 'orbiting' | 'falling' | 'landed';
  hasEmail: boolean;
  name?: string;
  color: string;
  size: number;
  orbitSpeed: number;
  lastSeen: Date;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  targetLocation?: {
    lat: number;
    lon: number;
  };
}

interface PublicStar {
  id: string;
  status: string;
  color: string;
  size: number;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  hasName: boolean; // Boolean flag without revealing actual name
}

interface GeoLocation {
  country: string;
  region?: string;
  city?: string;
  latitude: number;
  longitude: number;
}
```

## Error Handling

### Client-Side Error Handling

#### WebGL Fallback
```typescript
const WebGLFallback = () => {
  if (!WebGL.isWebGLAvailable()) {
    return <Canvas2DFallback />;
  }
  return <UniverseScene />;
};
```

#### Network Error Recovery
- Automatic retry for failed API calls
- Graceful degradation when real-time connection fails
- Local state persistence during network interruptions
- User-friendly error messages for connection issues

### Server-Side Error Handling

#### API Route Error Responses
```typescript
interface APIError {
  error: string;
  code: string;
  details?: any;
}

// Standard error responses
const errors = {
  RATE_LIMITED: { error: 'Too many requests', code: 'RATE_LIMITED' },
  INVALID_INPUT: { error: 'Invalid input data', code: 'INVALID_INPUT' },
  DB_ERROR: { error: 'Database error', code: 'DB_ERROR' },
  GEO_ERROR: { error: 'Geolocation service unavailable', code: 'GEO_ERROR' }
};
```

#### Database Error Handling
- Connection retry logic with exponential backoff
- Transaction rollback on failed operations
- Graceful handling of constraint violations
- Monitoring and alerting for critical failures

### Performance Error Handling

#### 3D Scene Performance
- Automatic quality reduction on low-end devices
- Frame rate monitoring and adaptive rendering
- Memory usage tracking and cleanup
- Fallback to 2D visualization if needed

## Testing Strategy

### Unit Testing
- **Frontend Components**: Jest + React Testing Library
- **API Routes**: Jest + Supertest for endpoint testing
- **Database Models**: Unit tests for data validation and queries
- **Utility Functions**: Pure function testing for calculations

### Integration Testing
- **API Integration**: Test complete request/response cycles
- **Database Integration**: Test schema migrations and data integrity
- **Real-time Integration**: Test Pusher event publishing and receiving
- **Geolocation Integration**: Mock IP geolocation service responses

### End-to-End Testing
- **Multi-user Scenarios**: Playwright tests simulating multiple visitors
- **Star Lifecycle**: Test complete flow from visit to email to star landing
- **Real-time Synchronization**: Verify events propagate correctly
- **Mobile Compatibility**: Cross-device testing

### Performance Testing
- **3D Rendering**: Frame rate testing across devices
- **Concurrent Users**: Load testing with multiple simultaneous connections
- **Database Performance**: Query optimization and indexing validation
- **Real-time Scalability**: Pusher channel capacity testing

### Security Testing
- **Input Validation**: SQL injection and XSS prevention
- **Rate Limiting**: API endpoint abuse prevention
- **Privacy Compliance**: Data handling and retention testing
- **Authentication**: Session management and data access controls

## Security and Privacy

### Data Protection
- Hash IP addresses before storage (SHA-256 with salt)
- Encrypt email addresses in database
- Implement data retention policies (30-day cleanup)
- Provide user data deletion endpoints

### Privacy Compliance
- GDPR-compliant consent banners
- Clear privacy policy explaining data usage
- Opt-out mechanisms for tracking
- Data portability and deletion rights

### Security Measures
- Rate limiting on all API endpoints
- Input validation and sanitization
- HTTPS enforcement
- Environment variable protection
- SQL injection prevention through parameterized queries

## Deployment Architecture

### Vercel Configuration
```javascript
// vercel.json
{
  "functions": {
    "pages/api/**/*.js": {
      "maxDuration": 10
    }
  },
  "env": {
    "SUPABASE_URL": "@supabase-url",
    "SUPABASE_ANON_KEY": "@supabase-anon-key",
    "PUSHER_APP_ID": "@pusher-app-id",
    "PUSHER_KEY": "@pusher-key",
    "PUSHER_SECRET": "@pusher-secret",
    "IPINFO_TOKEN": "@ipinfo-token"
  }
}
```

### Environment Variables
- **Database**: Supabase connection strings and API keys
- **Real-time**: Pusher application credentials
- **Geolocation**: IP geolocation service API tokens
- **Security**: JWT secrets and encryption keys

### Monitoring and Analytics
- Vercel Analytics for performance monitoring
- Sentry for error tracking and alerting
- Supabase dashboard for database metrics
- Pusher dashboard for real-time connection monitoring

## Performance Optimization

### Frontend Optimization
- Code splitting for 3D components
- Lazy loading of textures and assets
- Efficient star rendering using InstancedMesh
- Adaptive quality based on device capabilities

### Backend Optimization
- Database indexing on frequently queried fields
- Connection pooling for database connections
- Caching strategies for geolocation data
- Efficient real-time event batching

### 3D Rendering Optimization
- Level of detail (LOD) for distant stars
- Frustum culling for off-screen objects
- Texture compression and optimization
- GPU-friendly rendering techniques
#
# Premium Dark Theme Design System

### Color Palette
```css
:root {
  /* Primary Dark Theme */
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-tertiary: #1a1a1a;
  
  /* Accent Colors */
  --accent-gold: #d4af37;
  --accent-silver: #c0c0c0;
  --accent-blue: #4a9eff;
  
  /* Text Colors */
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --text-muted: #666666;
  
  /* Glass Morphism */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: rgba(0, 0, 0, 0.3);
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  --gradient-accent: linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%);
  --gradient-glow: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%);
}
```

### Typography System
```css
/* Premium Font Stack */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');

.typography {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-display: 'Playfair Display', Georgia, serif;
  
  /* Heading Scale */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
}
```

### Luxury UI Components

#### Glass Morphism Cards
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: 0 8px 32px var(--glass-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
}
```

#### Premium Buttons
```css
.btn-primary {
  background: var(--gradient-accent);
  color: var(--bg-primary);
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}
```

#### Elegant Form Inputs
```css
.input-luxury {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px 20px;
  color: var(--text-primary);
  font-size: var(--text-base);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.input-luxury:focus {
  outline: none;
  border-color: var(--accent-gold);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.input-luxury::placeholder {
  color: var(--text-muted);
  font-weight: 300;
}
```

### 3D Scene Enhancements

#### Premium Earth Design
- **Large-scale Earth model** with 2.5x increased size for better visibility and impact
- **Ultra-high quality 16K Earth textures** with crystal-clear continent details and country boundaries
- **Enhanced topographical features** showing mountain ranges, ocean depths, and terrain variations
- **Realistic atmospheric layers** with subtle blue glow and light scattering effects
- **Dynamic day/night cycle** with smooth terminator line and realistic city lights on night side
- **Detailed cloud formations** with realistic weather patterns and subtle animation
- **Professional lighting setup** with rim lighting, ambient occlusion, and realistic shadows
- **Smooth rotation animation** with proper Earth rotation speed and axis tilt

#### Premium Star System
- **Realistic star appearance** with bright point lights and authentic star-like glow
- **Random twinkling effects** with natural blinking patterns and intensity variations
- **Sophisticated glow shaders** with realistic light diffusion and atmospheric scattering
- **Varied star colors** including white, blue-white, yellow, and orange tones for realism
- **Dynamic brightness levels** with subtle pulsing and random intensity changes
- **Professional lens flare effects** when stars are bright or in motion
- **Smooth orbital motion** with elegant trails that fade naturally
- **Graceful falling animations** with increasing brightness as stars approach Earth
- **Subtle particle effects** around stars for enhanced visual appeal

#### Enhanced Visual Elements
- **Remove square UI elements** that appear unprofessional or placeholder-like
- **Elegant particle systems** for space dust, cosmic rays, and atmospheric effects
- **Professional post-processing** including bloom, tone mapping, and color correction
- **Smooth camera movements** with cinematic easing and professional transitions
- **Depth of field effects** for focus and visual hierarchy
- **Lens flares and light effects** for premium visual appeal

#### Text and UI Positioning
- **Earth as central focus** - Large, detailed Earth model as the main visual centerpiece
- **Twinkling star background** - Realistic stars orbiting around Earth with natural random blinking
- **Scroll-triggered content** - "Welcome to My Universe" and other text appears on scroll
- **Layered composition** - Proper depth separation between Earth, twinkling stars, and UI elements
- **Clean typography hierarchy** - Elegant text positioning that doesn't interfere with 3D scene
- **Smooth scroll animations** with parallax effects and elegant transitions

### Animation System

#### Micro-interactions
```css
/* Smooth hover transitions */
.interactive-element {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Elegant loading animations */
@keyframes luxuryPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

/* Premium slide-in animations */
@keyframes slideInLuxury {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

#### 3D Animation Principles
- Smooth easing functions for all movements
- Elegant spring-based animations for UI elements
- Sophisticated particle systems with realistic physics
- Premium transition effects between states
- Luxury loading sequences with brand elements

### Responsive Luxury Design

#### Desktop Experience
- Full-screen immersive 3D universe
- Elegant sidebar navigation with glass morphism
- Premium typography with generous spacing
- Sophisticated hover effects and micro-interactions
- Luxury cursor effects and custom scrollbars

#### Mobile Experience
- Optimized touch interactions with haptic feedback
- Elegant bottom sheet navigation
- Premium gesture-based controls
- Sophisticated adaptive layouts
- Luxury loading states and transitions

### Brand Elements

#### Logo and Branding
- Elegant monogram or wordmark design
- Sophisticated color usage with gold accents
- Premium typography for brand consistency
- Luxury iconography with consistent style
- Elegant loading animations featuring brand elements

#### Visual Hierarchy
- Clear information architecture with luxury spacing
- Sophisticated use of contrast and emphasis
- Premium visual flow and user journey
- Elegant content organization and presentation
- Luxury attention to detail in all elements

### Scroll-Based Content Revelation System

#### Parallax Scrolling Design
```typescript
interface ScrollSection {
  id: string;
  title: string;
  content: React.ReactNode;
  triggerOffset: number; // Percentage of viewport height
  animationType: 'fadeIn' | 'slideUp' | 'slideLeft' | 'parallax';
}

const scrollSections: ScrollSection[] = [
  {
    id: 'welcome',
    title: 'Welcome to My Universe',
    content: <WelcomeContent />,
    triggerOffset: 0.2,
    animationType: 'fadeIn'
  },
  {
    id: 'about',
    title: 'About Me',
    content: <AboutSection />,
    triggerOffset: 0.3,
    animationType: 'slideUp'
  },
  // Additional sections...
];
```

#### Scroll Animation Principles
- **Smooth reveal animations** triggered at optimal scroll positions
- **Non-intrusive design** that doesn't block the 3D Earth and stars
- **Elegant typography** with high contrast against the dark space background
- **Progressive disclosure** of portfolio content as user scrolls
- **Responsive scroll behavior** optimized for both desktop and mobile

### GitHub Integration Component

#### GitHub Profile Button
```typescript
interface GitHubButtonProps {
  username: string; // "YxshR"
  variant: 'header' | 'floating' | 'footer';
  showStats?: boolean;
}

export const GitHubButton: React.FC<GitHubButtonProps> = ({ username, variant, showStats }) => {
  return (
    <a 
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`github-button github-button--${variant}`}
    >
      <GitHubIcon />
      <span>View on GitHub</span>
      {showStats && <GitHubStats username={username} />}
    </a>
  );
};
```

#### GitHub Button Styling
```css
.github-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.github-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}
```
## B
ackend Integration Preparation

### Future Backend Architecture (Phase 2)

When ready for backend integration, the system will expand to include:

#### Server Infrastructure
- **Express.js API Routes**: RESTful API endpoints with proper middleware and authentication
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Database**: PostgreSQL for persistent data storage with Prisma schema
- **Real-time**: Pusher Channels for live star synchronization
- **Geolocation**: IP geolocation service (ipinfo.io) for visitor location detection
- **File Storage**: Cloudinary for image uploads and management
- **Authentication**: JWT tokens with middleware validation

#### Prisma Schema (Ready for Implementation)
```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Visitor {
  id        String   @id @default(uuid())
  ipHash    String   @map("ip_hash")
  country   String?
  region    String?
  city      String?
  latitude  Float?
  longitude Float?
  userAgent String?  @map("user_agent")
  sessionId String?  @map("session_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  // Relations
  stars Star[]
  
  @@index([ipHash])
  @@index([sessionId])
  @@map("visitors")
}

model Star {
  id          String   @id @default(uuid())
  visitorId   String   @map("visitor_id")
  ipHash      String   @map("ip_hash")
  status      String   @default("orbiting") // orbiting | falling | landed
  hasEmail    Boolean  @default(false) @map("has_email")
  name        String?
  emailHash   String?  @map("email_hash")
  color       String
  size        Float    @default(1.0)
  orbitSpeed  Float    @default(1.0) @map("orbit_speed")
  positionX   Float?   @map("position_x")
  positionY   Float?   @map("position_y")
  positionZ   Float?   @map("position_z")
  targetLat   Float?   @map("target_lat")
  targetLon   Float?   @map("target_lon")
  lastSeen    DateTime @default(now()) @map("last_seen")
  createdAt   DateTime @default(now()) @map("created_at")
  
  // Relations
  visitor Visitor @relation(fields: [visitorId], references: [id], onDelete: Cascade)
  events  StarEvent[]
  
  @@index([ipHash])
  @@index([lastSeen])
  @@index([status])
  @@map("stars")
}

model StarEvent {
  id        String   @id @default(uuid())
  starId    String   @map("star_id")
  eventType String   @map("event_type") // created | email_added | landed | disconnected
  payload   Json?
  ipAddress String?  @map("ip_address")
  createdAt DateTime @default(now()) @map("created_at")
  
  // Relations
  star Star @relation(fields: [starId], references: [id], onDelete: Cascade)
  
  @@index([starId])
  @@index([createdAt])
  @@map("star_events")
}
```

#### Environment Variables (Backend Phase)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/universe_portfolio"

# Real-time
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster

# Geolocation
IPINFO_TOKEN=your_ipinfo_token

# Security
JWT_SECRET=your_jwt_secret_key

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (Optional)
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=your_from_email

# Server Configuration
PORT=3001
NODE_ENV=production

# Client-side (NEXT_PUBLIC_)
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Express.js Backend Architecture
```typescript
// server/index.js - Main server setup
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import visitorRoutes from './routes/visitor.js';
import starRoutes from './routes/star.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Routes
app.use('/api/visitor', visitorRoutes);
app.use('/api/star', starRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### API Endpoints Structure
```typescript
// routes/visitor.js - Visitor management
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware.js';

const router = Router();
const prisma = new PrismaClient();

// POST /api/visitor/track - Track new visitor
router.post('/track', async (req, res) => {
  // Implementation similar to your example
});

// GET /api/visitor/session - Get visitor session
router.get('/session', authMiddleware, async (req, res) => {
  // Implementation
});

export default router;
```

```typescript
// routes/star.js - Star management
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/star/active - Get all active stars
router.get('/active', async (req, res) => {
  // Implementation
});

// POST /api/star/email - Submit email for star
router.post('/email', authMiddleware, async (req, res) => {
  // Implementation with Prisma transactions
});

// POST /api/star/fall - Trigger star fall animation
router.post('/fall', authMiddleware, async (req, res) => {
  // Implementation with Pusher events
});

export default router;
```

#### Middleware Structure
```typescript
// middleware.js - Authentication and validation
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const validateInput = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: result.error.format()
      });
    }
    req.validatedData = result.data;
    next();
  };
};
```

### Frontend-Backend Integration Points

#### 1. API Service Layer
```typescript
// lib/api.ts - API service layer for backend integration
class APIService {
  private baseURL: string;
  private isProduction: boolean;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  async visit(): Promise<VisitResponse> {
    if (!this.isProduction) {
      return mockVisitAPI();
    }
    // Real API call implementation
  }

  async submitEmail(data: EmailRequest): Promise<EmailResponse> {
    if (!this.isProduction) {
      return mockEmailSubmissionAPI(data);
    }
    // Real API call implementation
  }

  async getStars(): Promise<StarsResponse> {
    if (!this.isProduction) {
      return mockStarsAPI();
    }
    // Real API call implementation
  }
}
```

#### 2. Real-time Integration
```typescript
// hooks/useRealtime.ts - Real-time connection management
export const useRealtime = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [pusher, setPusher] = useState<Pusher | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Initialize real Pusher connection
      const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      });
      setPusher(pusherInstance);
    } else {
      // Mock real-time events for development
      mockRealtimeEvents();
    }
  }, []);

  return { isConnected, pusher };
};
```

### Migration Strategy (Frontend to Full-Stack)

#### Phase 1: Frontend Complete (Current)
- ✅ All UI components and 3D scenes working with mock data
- ✅ Complete user interactions and animations
- ✅ Responsive design and mobile optimization
- ✅ Performance optimization and testing

#### Phase 2: Backend Integration
1. **Database Setup**: Create Supabase project and implement schema
2. **API Implementation**: Replace mock APIs with real endpoints
3. **Real-time Setup**: Configure Pusher/Supabase Realtime
4. **Security Implementation**: Add authentication and data protection
5. **Testing**: Integration and end-to-end testing with real backend

#### Phase 3: Production Deployment
1. **Environment Configuration**: Set up production environment variables
2. **Performance Monitoring**: Add Sentry, analytics, and monitoring
3. **Security Hardening**: Implement rate limiting, CSRF protection
4. **Scaling Preparation**: Optimize for high traffic and concurrent users

### Development Workflow

#### Frontend Development (Current Phase)
```bash
# Development commands
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run test suite
npm run lint         # Code quality checks
npm run type-check   # TypeScript validation
```

#### Backend Integration (Future Phase)
```bash
# Additional commands for backend phase
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with test data
npm run test:e2e     # End-to-end testing
npm run deploy       # Deploy to production
```

### Quality Assurance Checklist

#### Frontend Completion Criteria
- [ ] All UI components render correctly
- [ ] 3D Earth rotates smoothly with textures
- [ ] Stars orbit and fall with proper animations
- [ ] Email form captures input and triggers star fall
- [ ] Navigation works between portfolio sections
- [ ] Responsive design works on mobile and desktop
- [ ] Performance is acceptable (>30fps mobile, >60fps desktop)
- [ ] All mock data integrations function properly
- [ ] TypeScript compilation passes without errors
- [ ] All tests pass successfully

#### Backend Integration Readiness
- [ ] API interfaces are clearly defined
- [ ] Mock data structures match backend schema
- [ ] Error handling is implemented for API failures
- [ ] Loading states are implemented for async operations
- [ ] Real-time event structure is defined
- [ ] Security considerations are documented
- [ ] Performance monitoring hooks are in place
- [ ] Migration strategy is documented