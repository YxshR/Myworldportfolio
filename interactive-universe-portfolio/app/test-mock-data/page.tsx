'use client';

import { useMockData, useVisitorStats } from '@/hooks/useMockData';
import { useStarState, useCurrentUserStar } from '@/hooks/useStarState';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TestMockDataPage() {
  const mockData = useMockData();
  const stateManagement = useStarState();
  const currentUserStar = useCurrentUserStar();
  const stats = useVisitorStats();

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-white mb-8">Mock Data System Test</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Visitor Stats</h3>
            <div className="space-y-2 text-sm text-text-secondary">
              <p>Total Visitors: {stats.totalVisitors}</p>
              <p>Active Stars: {stats.activeStars}</p>
              <p>Landed Stars: {stats.landedStars}</p>
              <p>Falling Stars: {stats.fallingStars}</p>
              <p>Countries: {stats.countries}</p>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Mock Data State</h3>
            <div className="space-y-2 text-sm text-text-secondary">
              <p>Loading: {mockData.isLoading ? 'Yes' : 'No'}</p>
              <p>Error: {mockData.error || 'None'}</p>
              <p>Total Stars: {mockData.stars.length}</p>
              <p>Current User Star: {mockData.currentUserStar.id}</p>
              <p>Has Email: {mockData.currentUserStar.hasEmail ? 'Yes' : 'No'}</p>
            </div>
            <div className="mt-4 space-y-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={mockData.refreshData}
                disabled={mockData.isLoading}
              >
                Refresh Data
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={mockData.simulateRealTimeUpdates}
              >
                Simulate Update
              </Button>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">State Management</h3>
            <div className="space-y-2 text-sm text-text-secondary">
              <p>Loading: {stateManagement.isLoading ? 'Yes' : 'No'}</p>
              <p>All Stars: {stateManagement.allStars.length}</p>
              <p>Visible Stars: {stateManagement.visibleStars.length}</p>
              <p>Last Update: {stateManagement.lastUpdate.toLocaleTimeString()}</p>
            </div>
            <div className="mt-4 space-y-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={stateManagement.refreshStars}
                disabled={stateManagement.isLoading}
              >
                Refresh Stars
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={stateManagement.simulateRealTime}
              >
                Simulate Real-time
              </Button>
            </div>
          </Card>
        </div>

        {/* Current User Star */}
        <Card variant="elevated" className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Current User Star</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-sm text-text-secondary">
              <p>ID: {currentUserStar.star.id}</p>
              <p>Status: <span className="capitalize text-accent-gold">{currentUserStar.star.status}</span></p>
              <p>Color: <span style={{ color: currentUserStar.star.color }}>●</span> {currentUserStar.star.color}</p>
              <p>Size: {currentUserStar.star.size}</p>
              <p>Orbit Speed: {currentUserStar.star.orbitSpeed}</p>
              <p>Has Email: {currentUserStar.star.hasEmail ? 'Yes' : 'No'}</p>
              {currentUserStar.star.name && <p>Name: {currentUserStar.star.name}</p>}
            </div>
            <div className="space-y-2">
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => currentUserStar.addEmail('test@example.com', 'Test User')}
                disabled={currentUserStar.star.hasEmail}
              >
                Add Email (Demo)
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => currentUserStar.makeStarFall({ lat: 37.7749, lon: -122.4194 })}
                disabled={currentUserStar.star.status !== 'orbiting'}
              >
                Make Star Fall
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => currentUserStar.landStar()}
                disabled={currentUserStar.star.status !== 'falling'}
              >
                Land Star
              </Button>
            </div>
          </div>
        </Card>

        {/* Stars List */}
        <Card variant="elevated" className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">All Stars ({mockData.stars.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {mockData.stars.map((star) => (
              <div key={star.id} className="glass-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    {star.name || `Star ${star.id.slice(-4)}`}
                  </span>
                  <span style={{ color: star.color }}>●</span>
                </div>
                <div className="text-xs text-text-secondary space-y-1">
                  <p>Status: <span className="capitalize">{star.status}</span></p>
                  <p>Size: {star.size.toFixed(1)}</p>
                  <p>Email: {star.hasEmail ? 'Yes' : 'No'}</p>
                  {star.targetLocation && (
                    <p>Target: {star.targetLocation.lat.toFixed(2)}, {star.targetLocation.lon.toFixed(2)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Rendered Stars Data */}
        <Card variant="elevated" className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Stars for 3D Rendering</h3>
          <div className="text-sm text-text-secondary">
            <p className="mb-2">Ready for 3D rendering: {mockData.getStarsForRendering().length} stars</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {mockData.getStarsForRendering().slice(0, 12).map((star) => (
                <div key={star.id} className="bg-white/5 p-2 rounded text-xs">
                  <p className="font-medium">{star.isOwned ? 'MY STAR' : `Star ${star.id.slice(-4)}`}</p>
                  <p>Status: {star.status}</p>
                  <p>Twinkle: {star.twinkleSpeed.toFixed(1)}</p>
                  <p>Intensity: {star.baseIntensity.toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}