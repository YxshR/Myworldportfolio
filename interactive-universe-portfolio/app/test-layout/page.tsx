'use client';

import React, { useState } from 'react';
import { Navigation } from '../../components/layout/Navigation';
import { LoadingScreen, LoadingSpinner, LoadingDots, ProgressBar } from '../../components/ui/LoadingScreen';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function TestLayoutPage() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleShowLoading = () => {
    setShowLoadingScreen(true);
    setLoadingProgress(0);
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowLoadingScreen(false), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Navigation Component Test */}
      <Navigation variant="header" isScrolled={isScrolled} />
      
      {/* Main Content */}
      <div className="pt-20 px-4 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-display font-bold text-text-primary">
            Layout Components Test
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Testing the Navigation and LoadingScreen components with luxury styling and animations.
          </p>
        </div>

        {/* Navigation Variants */}
        <Card variant="elevated" className="p-8">
          <h2 className="text-2xl font-display font-semibold text-text-primary mb-6">
            Navigation Component
          </h2>
          <div className="space-y-4">
            <p className="text-text-secondary">
              The navigation component is currently displayed at the top of this page in header variant.
              It includes smooth transitions, glass morphism effects, and responsive mobile menu.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="text-sm text-text-muted">
                ✓ Responsive design (desktop & mobile)
              </div>
              <div className="text-sm text-text-muted">
                ✓ Glass morphism effects
              </div>
              <div className="text-sm text-text-muted">
                ✓ Smooth transitions
              </div>
              <div className="text-sm text-text-muted">
                ✓ Active section detection
              </div>
              <div className="text-sm text-text-muted">
                ✓ GitHub integration
              </div>
            </div>
          </div>
        </Card>

        {/* Loading Screen Tests */}
        <Card variant="elevated" className="p-8">
          <h2 className="text-2xl font-display font-semibold text-text-primary mb-6">
            Loading Screen Component
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Full Screen Loading
              </h3>
              <Button 
                variant="primary"
                size="md"
                onClick={handleShowLoading}
                disabled={showLoadingScreen}
              >
                {showLoadingScreen ? 'Loading...' : 'Test Full Screen Loading'}
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Loading Spinners
              </h3>
              <div className="flex items-center space-x-8">
                <div className="text-center space-y-2">
                  <LoadingSpinner size="sm" color="gold" />
                  <div className="text-xs text-text-muted">Small Gold</div>
                </div>
                <div className="text-center space-y-2">
                  <LoadingSpinner size="md" color="silver" />
                  <div className="text-xs text-text-muted">Medium Silver</div>
                </div>
                <div className="text-center space-y-2">
                  <LoadingSpinner size="lg" color="blue" />
                  <div className="text-xs text-text-muted">Large Blue</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Loading Dots
              </h3>
              <div className="flex items-center space-x-8">
                <div className="text-center space-y-2">
                  <LoadingDots size="sm" color="gold" />
                  <div className="text-xs text-text-muted">Small Gold</div>
                </div>
                <div className="text-center space-y-2">
                  <LoadingDots size="md" color="silver" />
                  <div className="text-xs text-text-muted">Medium Silver</div>
                </div>
                <div className="text-center space-y-2">
                  <LoadingDots size="lg" color="blue" />
                  <div className="text-xs text-text-muted">Large Blue</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Progress Bars
              </h3>
              <div className="space-y-4 max-w-md">
                <ProgressBar progress={25} color="gold" size="sm" />
                <ProgressBar progress={50} color="silver" size="md" />
                <ProgressBar progress={75} color="blue" size="lg" />
                <ProgressBar progress={100} color="gold" size="md" showPercentage={false} />
              </div>
            </div>
          </div>
        </Card>

        {/* Floating Navigation Test */}
        <Card variant="elevated" className="p-8">
          <h2 className="text-2xl font-display font-semibold text-text-primary mb-6">
            Floating Navigation
          </h2>
          <p className="text-text-secondary mb-4">
            The floating navigation variant appears at the bottom of the screen.
          </p>
          <div className="relative h-64 bg-bg-secondary rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 to-accent-silver/5" />
            <Navigation variant="floating" className="relative" />
          </div>
        </Card>

        {/* Sections for scroll testing */}
        {['About', 'Projects', 'Skills', 'Contact'].map((section) => (
          <section key={section} id={section.toLowerCase()}>
            <Card variant="default" className="p-8">
              <h2 className="text-2xl font-display font-semibold text-text-primary mb-4">
                {section} Section
              </h2>
              <p className="text-text-secondary">
                This is the {section.toLowerCase()} section. The navigation should highlight this section
                when it&apos;s in view and provide smooth scrolling when clicked.
              </p>
              <div className="mt-6 h-32 bg-gradient-to-r from-accent-gold/10 to-accent-silver/10 rounded-lg flex items-center justify-center">
                <span className="text-text-muted">
                  {section} content area
                </span>
              </div>
            </Card>
          </section>
        ))}

        {/* Spacer for scroll testing */}
        <div className="h-96" />
      </div>

      {/* Loading Screen Overlay */}
      <LoadingScreen
        isLoading={showLoadingScreen}
        progress={loadingProgress}
        variant="full"
        showProgress={true}
        showMessage={true}
        onComplete={() => setShowLoadingScreen(false)}
      />
    </div>
  );
}