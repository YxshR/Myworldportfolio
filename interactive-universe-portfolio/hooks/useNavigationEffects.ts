'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface NavigationEffectsState {
  activeSection: string;
  scrollProgress: number;
  isScrolling: boolean;
  sectionProgress: Record<string, number>;
  engagementLevel: number;
}

export interface NavigationEffectsActions {
  updateEngagement: (section: string, timeSpent: number) => void;
  triggerSectionEffect: (section: string) => void;
  resetEffects: () => void;
}

export interface UseNavigationEffectsReturn extends NavigationEffectsState, NavigationEffectsActions {
  getStarEngagementLevel: () => number;
  getSectionEngagementColor: (section: string) => string;
  getUniverseAnimationIntensity: () => number;
}

const SECTIONS = ['home', 'about', 'projects', 'skills', 'contact'];

export const useNavigationEffects = (): UseNavigationEffectsReturn => {
  const [state, setState] = useState<NavigationEffectsState>({
    activeSection: 'home',
    scrollProgress: 0,
    isScrolling: false,
    sectionProgress: {},
    engagementLevel: 0
  });

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionTimeRef = useRef<Record<string, number>>({});
  const lastSectionRef = useRef<string>('home');
  const sectionStartTimeRef = useRef<number>(Date.now());

  // Track scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollTop / documentHeight, 1);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set scrolling state
      setState(prev => ({ ...prev, isScrolling: true, scrollProgress }));

      // Find active section
      let activeSection = 'home';
      let maxVisibility = 0;

      SECTIONS.forEach(section => {
        const element = document.getElementById(section);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the section is visible
        const visibleTop = Math.max(0, -rect.top);
        const visibleBottom = Math.min(rect.height, viewportHeight - rect.top);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibility = visibleHeight / viewportHeight;

        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          activeSection = section;
        }

        // Update section progress
        setState(prev => ({
          ...prev,
          sectionProgress: {
            ...prev.sectionProgress,
            [section]: Math.min(visibility, 1)
          }
        }));
      });

      // Track time spent in sections
      if (activeSection !== lastSectionRef.current) {
        const timeSpent = Date.now() - sectionStartTimeRef.current;
        if (lastSectionRef.current && timeSpent > 1000) { // Only count if spent more than 1 second
          sectionTimeRef.current[lastSectionRef.current] = 
            (sectionTimeRef.current[lastSectionRef.current] || 0) + timeSpent;
        }
        lastSectionRef.current = activeSection;
        sectionStartTimeRef.current = Date.now();
      }

      setState(prev => ({ ...prev, activeSection }));

      // Set timeout to clear scrolling state
      scrollTimeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, isScrolling: false }));
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Calculate engagement level based on time spent and interactions
  useEffect(() => {
    const totalTime = Object.values(sectionTimeRef.current).reduce((sum, time) => sum + time, 0);
    const engagementLevel = Math.min(totalTime / 60000, 1); // Max engagement after 1 minute
    
    setState(prev => ({ ...prev, engagementLevel }));
  }, [state.activeSection]);

  const updateEngagement = useCallback((section: string, timeSpent: number) => {
    sectionTimeRef.current[section] = (sectionTimeRef.current[section] || 0) + timeSpent;
    
    const totalTime = Object.values(sectionTimeRef.current).reduce((sum, time) => sum + time, 0);
    const engagementLevel = Math.min(totalTime / 60000, 1);
    
    setState(prev => ({ ...prev, engagementLevel }));
  }, []);

  const triggerSectionEffect = useCallback((section: string) => {
    // This can be used to trigger specific effects when entering a section
    console.log(`Triggered effect for section: ${section}`);
  }, []);

  const resetEffects = useCallback(() => {
    sectionTimeRef.current = {};
    setState({
      activeSection: 'home',
      scrollProgress: 0,
      isScrolling: false,
      sectionProgress: {},
      engagementLevel: 0
    });
  }, []);

  const getStarEngagementLevel = useCallback(() => {
    // Return a value between 0 and 1 representing how engaged the user is
    const baseEngagement = state.engagementLevel;
    const scrollBonus = state.scrollProgress * 0.3;
    const sectionBonus = Object.keys(state.sectionProgress).length * 0.1;
    
    return Math.min(baseEngagement + scrollBonus + sectionBonus, 1);
  }, [state.engagementLevel, state.scrollProgress, state.sectionProgress]);

  const getSectionEngagementColor = useCallback((section: string) => {
    const timeSpent = sectionTimeRef.current[section] || 0;
    const progress = state.sectionProgress[section] || 0;
    
    if (timeSpent > 10000 || progress > 0.8) return '#d4af37'; // Gold for high engagement
    if (timeSpent > 5000 || progress > 0.5) return '#4a9eff'; // Blue for medium engagement
    if (timeSpent > 2000 || progress > 0.2) return '#c0c0c0'; // Silver for low engagement
    return '#666666'; // Default gray
  }, [state.sectionProgress]);

  const getUniverseAnimationIntensity = useCallback(() => {
    // Return animation intensity based on user engagement and scroll activity
    let intensity = 0.5; // Base intensity
    
    if (state.isScrolling) intensity += 0.3;
    if (state.engagementLevel > 0.5) intensity += 0.2;
    if (state.activeSection !== 'home') intensity += 0.1;
    
    return Math.min(intensity, 1);
  }, [state.isScrolling, state.engagementLevel, state.activeSection]);

  return {
    ...state,
    updateEngagement,
    triggerSectionEffect,
    resetEffects,
    getStarEngagementLevel,
    getSectionEngagementColor,
    getUniverseAnimationIntensity
  };
};