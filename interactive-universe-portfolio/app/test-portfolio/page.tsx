'use client';

import React from 'react';
import { AboutSection, ProjectsSection, SkillsSection, ContactSection } from '@/components/portfolio';

export default function TestPortfolioPage() {
  const handleEmailSubmit = async (email: string, name: string) => {
    console.log('Email submitted:', { email, name });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Page Header */}
      <div className="text-center py-16 px-6">
        <h1 className="font-display text-5xl font-bold text-text-primary mb-4">
          Portfolio Components Test
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Testing all portfolio content components with premium styling, animations, and interactions.
        </p>
      </div>

      {/* Portfolio Sections */}
      <div className="space-y-0">
        <AboutSection />
        <div className="border-t border-white/5" />
        
        <ProjectsSection />
        <div className="border-t border-white/5" />
        
        <SkillsSection />
        <div className="border-t border-white/5" />
        
        <ContactSection onEmailSubmit={handleEmailSubmit} />
      </div>

      {/* Footer */}
      <footer className="text-center py-12 px-6 border-t border-white/5">
        <p className="text-text-muted text-sm">
          Portfolio Components Test Page - All components rendered successfully
        </p>
      </footer>
    </div>
  );
}