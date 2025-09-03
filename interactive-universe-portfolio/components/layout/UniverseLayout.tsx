'use client';

import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { UniverseCanvas } from '@/components/3d/UniverseCanvas';
import { Navigation } from './Navigation';
import { AboutSection } from '@/components/portfolio/AboutSection';
import { ProjectsSection } from '@/components/portfolio/ProjectsSection';
import { SkillsSection } from '@/components/portfolio/SkillsSection';
import { ContactSection } from '@/components/portfolio/ContactSection';
import { useStarData, useMockData } from '@/hooks/useMockData';

import { useEmailSubmission } from '@/hooks/useEmailSubmission';
import { useNavigationEffects } from '@/hooks/useNavigationEffects';

interface UniverseLayoutProps {
  className?: string;
}

export const UniverseLayout: React.FC<UniverseLayoutProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Data hooks
  const { stars, myStarId } = useStarData();
  const { updateCurrentUserStar } = useMockData();
  
  // Handle email submission
  const handleEmailSubmitInternal = async (email: string, name: string) => {
    // Update star to landed state
    if (myStarId) {
      updateCurrentUserStar({
        status: 'falling',
        hasEmail: true,
        name: name,
      });
      
      // Simulate falling animation, then land
      setTimeout(() => {
        updateCurrentUserStar({
          status: 'landed',
          targetLocation: { lat: 40.7128, lon: -74.0060 }, // Example: NYC
        });
      }, 3000);
    }
  };
  
  const { state, submitEmail } = useEmailSubmission(handleEmailSubmitInternal);
  const { isLoading, error, success } = state;
  
  // Navigation effects
  const {
    activeSection,
    scrollProgress,
    isScrolling,
    engagementLevel,
    getStarEngagementLevel,
    getSectionEngagementColor,
    getUniverseAnimationIntensity
  } = useNavigationEffects();

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      
      // Active section tracking can be added here if needed
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle email submission
  const handleEmailSubmit = async (email: string, name?: string) => {
    try {
      await submitEmail(email, name || 'Anonymous');
    } catch (err) {
      console.error('Email submission failed:', err);
    }
  };

  return (
    <div className={clsx('relative min-h-screen bg-bg-primary overflow-x-hidden', className)}>
      {/* Fixed 3D Universe Background */}
      <div 
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{ height: '100vh', width: '100vw' }}
      >
        <UniverseCanvas
          stars={stars}
          myStarId={myStarId}
          onEmailSubmit={handleEmailSubmit}
          navigationEffects={{
            activeSection,
            scrollProgress,
            isScrolling,
            engagementLevel,
            starEngagementLevel: getStarEngagementLevel(),
            sectionEngagementColor: getSectionEngagementColor(activeSection),
            animationIntensity: getUniverseAnimationIntensity()
          }}
        />
      </div>

      {/* Navigation */}
      <Navigation 
        variant={isMobile ? 'floating' : 'header'}
        isScrolled={isScrolled}
        className="z-40"
      />

      {/* Scrollable Content Overlay */}
      <div className="relative z-10">
        {/* Hero Section - Universe View */}
        <section 
          id="home" 
          className="min-h-screen flex items-center justify-center relative"
        >
          {/* Welcome Content */}
          <div className="text-center px-6 max-w-4xl mx-auto">
            <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-white/10">
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6">
                Welcome to My{' '}
                <span className="bg-gradient-to-r from-accent-gold to-accent-silver bg-clip-text text-transparent">
                  Universe
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
                An interactive 3D portfolio where every visitor becomes a star in the digital cosmos
              </p>
              
              {/* Scroll Indicator */}
              <div className="animate-bounce mt-12">
                <div className="w-6 h-10 border-2 border-accent-gold/50 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-accent-gold rounded-full mt-2 animate-pulse"></div>
                </div>
                <p className="text-sm text-text-muted mt-2">Scroll to explore</p>
              </div>
            </div>
          </div>

          {/* Floating Stats */}
          <div className="absolute bottom-20 left-6 right-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="backdrop-blur-sm bg-black/20 rounded-lg p-4 border border-white/10 text-center">
                  <div className="text-2xl font-bold text-accent-gold">{stars.length}</div>
                  <div className="text-sm text-text-muted">Active Stars</div>
                </div>
                <div className="backdrop-blur-sm bg-black/20 rounded-lg p-4 border border-white/10 text-center">
                  <div className="text-2xl font-bold text-accent-silver">
                    {stars.filter(s => s.status === 'landed').length}
                  </div>
                  <div className="text-sm text-text-muted">Landed</div>
                </div>
                <div className="backdrop-blur-sm bg-black/20 rounded-lg p-4 border border-white/10 text-center">
                  <div className="text-2xl font-bold text-accent-blue">Live</div>
                  <div className="text-sm text-text-muted">Real-time</div>
                </div>
                <div className="backdrop-blur-sm bg-black/20 rounded-lg p-4 border border-white/10 text-center">
                  <div className="text-2xl font-bold text-text-primary">3D</div>
                  <div className="text-sm text-text-muted">Interactive</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Content Sections */}
        <div className="relative">
          {/* Content Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/80 to-bg-primary backdrop-blur-sm" />
          
          <div className="relative z-10">
            {/* About Section */}
            <section id="about" className="min-h-screen flex items-center">
              <AboutSection className="w-full" />
            </section>

            {/* Projects Section */}
            <section id="projects" className="min-h-screen flex items-center">
              <ProjectsSection className="w-full" />
            </section>

            {/* Skills Section */}
            <section id="skills" className="min-h-screen flex items-center">
              <SkillsSection className="w-full" />
            </section>

            {/* Contact Section */}
            <section id="contact" className="min-h-screen flex items-center">
              <ContactSection 
                className="w-full"
                onEmailSubmit={handleEmailSubmit}
                isLoading={isLoading}
                error={error}
                success={success}
              />
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-bg-primary/90 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-gold to-accent-silver flex items-center justify-center">
                  <UniverseIcon className="w-6 h-6 text-bg-primary" />
                </div>
                <span className="text-xl font-display font-semibold text-text-primary">
                  Universe Portfolio
                </span>
              </div>
              
              <p className="text-text-secondary mb-6">
                Thank you for visiting my digital universe. Every star tells a story.
              </p>
              
              <div className="flex justify-center space-x-6">
                <a
                  href="https://github.com/YxshR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-accent-gold transition-colors duration-300"
                >
                  GitHub
                </a>
                <a
                  href="#contact"
                  className="text-text-muted hover:text-accent-gold transition-colors duration-300"
                >
                  Contact
                </a>
                <a
                  href="#about"
                  className="text-text-muted hover:text-accent-gold transition-colors duration-300"
                >
                  About
                </a>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-sm text-text-muted">
                  © 2024 Universe Portfolio. Built with Next.js, Three.js, and cosmic inspiration.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
          <Navigation variant="floating" />
        </div>
      )}
    </div>
  );
};

// Simple SVG Icon
const UniverseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);