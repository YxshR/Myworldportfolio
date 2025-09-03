'use client';

import { Suspense, useState } from 'react';
import { UniverseCanvas } from '@/components/3d/UniverseCanvas';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { EmailForm } from '@/components/ui/EmailForm';
import { useMockData, useVisitorStats } from '@/hooks/useMockData';

export default function UniversePage() {
  const { 
    currentUserStar, 
    isLoading, 
    error, 
    addEmailToCurrentStar,
    getStarsForRendering 
  } = useMockData();
  
  const stats = useVisitorStats();
  const [showEmailForm, setShowEmailForm] = useState(!currentUserStar.hasEmail);

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Universe</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">
      {/* Stats Overlay */}
      <div className="absolute top-6 left-6 z-20">
        <div className="glass-card p-4 text-white">
          <h3 className="text-lg font-semibold mb-2">Universe Stats</h3>
          <div className="space-y-1 text-sm">
            <p>Active Visitors: {stats.totalVisitors}</p>
            <p>Orbiting Stars: {stats.activeStars}</p>
            <p>Landed Stars: {stats.landedStars}</p>
            <p>Falling Stars: {stats.fallingStars}</p>
            <p>Countries: {stats.countries}</p>
          </div>
        </div>
      </div>

      {/* Current User Star Info */}
      <div className="absolute top-6 right-6 z-20">
        <div className="glass-card p-4 text-white">
          <h3 className="text-lg font-semibold mb-2">Your Star</h3>
          <div className="space-y-1 text-sm">
            <p>Status: <span className="capitalize text-accent-gold">{currentUserStar.status}</span></p>
            <p>Color: <span style={{ color: currentUserStar.color }}>●</span> {currentUserStar.color}</p>
            {currentUserStar.name && <p>Name: {currentUserStar.name}</p>}
            {!currentUserStar.hasEmail && (
              <button 
                onClick={() => setShowEmailForm(true)}
                className="mt-2 px-3 py-1 bg-accent-gold text-bg-primary rounded text-xs font-medium hover:bg-accent-silver transition-colors"
              >
                Claim Your Star
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3D Universe Scene */}
      <div className="absolute inset-0">
        <Suspense fallback={<LoadingScreen isLoading={true} />}>
          <UniverseCanvas 
            stars={getStarsForRendering()}
            myStarId={currentUserStar.id}
            onEmailSubmit={addEmailToCurrentStar}
          />
        </Suspense>
      </div>

      {/* Email Form Modal */}
      {showEmailForm && !currentUserStar.hasEmail && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="relative">
            <button
              onClick={() => setShowEmailForm(false)}
              className="absolute -top-4 -right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              ×
            </button>
            <EmailForm
              onSubmit={async (email, name) => {
                await addEmailToCurrentStar(email, name);
                setShowEmailForm(false);
              }}
              title="Claim Your Star"
              subtitle="Enter your details to make your star fall to Earth"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="glass-card px-6 py-3">
          <nav className="flex space-x-6 text-white">
            <a href="/landing" className="hover:text-accent-gold transition-colors">Home</a>
            <a href="#about" className="hover:text-accent-gold transition-colors">About</a>
            <a href="#projects" className="hover:text-accent-gold transition-colors">Projects</a>
            <a href="#contact" className="hover:text-accent-gold transition-colors">Contact</a>
          </nav>
        </div>
      </div>
    </div>
  );
}