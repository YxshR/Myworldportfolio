/**
 * Mobile Navigation Component
 * Provides touch-optimized navigation with gestures and haptic feedback
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';

interface MobileNavigationProps {
  className?: string;
  isScrolled?: boolean;
  onNavigate?: (section: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  shortLabel: string;
}

const navigationItems: NavItem[] = [
  {
    id: 'home',
    label: 'Universe',
    shortLabel: 'Home',
    href: '#home',
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    id: 'about',
    label: 'About',
    shortLabel: 'About',
    href: '#about',
    icon: <UserIcon className="w-5 h-5" />,
  },
  {
    id: 'projects',
    label: 'Projects',
    shortLabel: 'Work',
    href: '#projects',
    icon: <CodeIcon className="w-5 h-5" />,
  },
  {
    id: 'skills',
    label: 'Skills',
    shortLabel: 'Skills',
    href: '#skills',
    icon: <StarIcon className="w-5 h-5" />,
  },
  {
    id: 'contact',
    label: 'Contact',
    shortLabel: 'Contact',
    href: '#contact',
    icon: <MailIcon className="w-5 h-5" />,
  },
];

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  className,
  isScrolled = false,
  onNavigate
}) => {
  const { optimizations } = useMobileOptimizations();
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  
  // Haptic feedback function
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator && optimizations.capabilities?.isMobile) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  };
  
  // Handle scroll-based visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMenuOpen(false); // Close menu when hiding nav
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle active section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map(item => 
        document.querySelector(item.href)
      ).filter(Boolean);

      const currentSection = sections.find(section => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        const sectionId = currentSection.id;
        setActiveSection(sectionId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle touch gestures for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setSwipeDirection(null);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Only handle horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      const direction = deltaX > 0 ? 'right' : 'left';
      setSwipeDirection(direction);
    }
  };
  
  const handleTouchEnd = () => {
    if (swipeDirection) {
      if (swipeDirection === 'right' && !isMenuOpen) {
        setIsMenuOpen(true);
        triggerHaptic('medium');
      } else if (swipeDirection === 'left' && isMenuOpen) {
        setIsMenuOpen(false);
        triggerHaptic('light');
      }
    }
    setTouchStart(null);
    setSwipeDirection(null);
  };
  
  // Handle navigation
  const handleNavClick = (href: string, id: string) => {
    setActiveSection(id);
    setIsMenuOpen(false);
    triggerHaptic('light');
    
    onNavigate?.(id);
    
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    triggerHaptic(isMenuOpen ? 'light' : 'medium');
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);
  
  return (
    <>
      {/* Mobile Header Navigation */}
      <nav 
        ref={navRef}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
          isVisible ? 'translate-y-0' : '-translate-y-full',
          isScrolled ? 'backdrop-blur-xl bg-black/20' : 'backdrop-blur-sm bg-transparent',
          'md:hidden', // Only show on mobile
          className
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('#home', 'home')}
              className="flex items-center space-x-2 group"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-gold to-accent-silver flex items-center justify-center">
                  <UniverseIcon className="w-5 h-5 text-bg-primary" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-gold to-accent-silver opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
              </div>
              <span className="text-lg font-display font-semibold text-text-primary group-hover:text-accent-gold transition-colors duration-300">
                Universe
              </span>
            </button>
            
            {/* Menu Button */}
            <button
              onClick={toggleMenu}
              className={clsx(
                'relative p-2 rounded-lg transition-all duration-300',
                'bg-white/10 backdrop-blur-sm border border-white/20',
                'hover:bg-white/20 hover:border-accent-gold/30',
                'active:scale-95',
                isMenuOpen && 'bg-accent-gold/20 border-accent-gold/30'
              )}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={clsx(
                  'block w-5 h-0.5 bg-current transition-all duration-300',
                  isMenuOpen ? 'rotate-45 translate-y-1' : 'translate-y-0'
                )} />
                <span className={clsx(
                  'block w-5 h-0.5 bg-current transition-all duration-300 mt-1',
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                )} />
                <span className={clsx(
                  'block w-5 h-0.5 bg-current transition-all duration-300 mt-1',
                  isMenuOpen ? '-rotate-45 -translate-y-2' : 'translate-y-0'
                )} />
              </div>
            </button>
          </div>
        </div>
        
        {/* Swipe Indicator */}
        {swipeDirection && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-gold to-accent-silver opacity-50" />
        )}
      </nav>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div 
            ref={menuRef}
            className={clsx(
              'absolute top-16 left-4 right-4 max-w-sm mx-auto',
              'bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl',
              'shadow-2xl shadow-black/50',
              'animate-in slide-in-from-top-2 duration-300'
            )}
          >
            <div className="p-6">
              {/* Menu Items */}
              <div className="space-y-2">
                {navigationItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href, item.id)}
                    className={clsx(
                      'w-full flex items-center space-x-4 p-4 rounded-xl text-left',
                      'transition-all duration-300 group relative overflow-hidden',
                      'hover:bg-white/10 active:scale-95',
                      activeSection === item.id
                        ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30'
                        : 'text-text-secondary hover:text-text-primary'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Active indicator */}
                    {activeSection === item.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold rounded-r-full" />
                    )}
                    
                    {/* Icon */}
                    <div className={clsx(
                      'flex-shrink-0 transition-transform duration-300',
                      'group-hover:scale-110',
                      activeSection === item.id && 'text-accent-gold'
                    )}>
                      {item.icon}
                    </div>
                    
                    {/* Label */}
                    <span className="font-medium text-lg">
                      {item.label}
                    </span>
                    
                    {/* Arrow */}
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Divider */}
              <div className="my-6 h-px bg-white/10" />
              
              {/* GitHub Link */}
              <a
                href="https://github.com/YxshR"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center space-x-4 p-4 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all duration-300 group"
                onClick={() => triggerHaptic('light')}
              >
                <GitHubIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">GitHub</span>
                <div className="ml-auto">
                  <ExternalLinkIcon className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation Bar (Alternative) */}
      {optimizations.capabilities?.isMobile && (
        <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
          <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 p-2">
            <div className="flex items-center justify-around">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href, item.id)}
                  className={clsx(
                    'flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-300',
                    'hover:bg-white/10 active:scale-95',
                    activeSection === item.id
                      ? 'bg-accent-gold/20 text-accent-gold'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                  title={item.label}
                >
                  {/* Active pulse effect */}
                  {activeSection === item.id && (
                    <div className="absolute inset-0 rounded-xl bg-accent-gold/10 animate-pulse" />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center space-y-1">
                    {item.icon}
                    <span className="text-xs font-medium">
                      {item.shortLabel}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

// Icon Components
const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const GitHubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const UniverseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);