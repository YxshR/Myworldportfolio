'use client';

import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';

interface NavigationProps {
  className?: string;
  variant?: 'header' | 'sidebar' | 'floating';
  isScrolled?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const navigationItems: NavItem[] = [
  {
    id: 'home',
    label: 'Universe',
    href: '#home',
  },
  {
    id: 'about',
    label: 'About',
    href: '#about',
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '#projects',
  },
  {
    id: 'skills',
    label: 'Skills',
    href: '#skills',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '#contact',
  },
];

// Helper function to get icon for navigation item
const getNavIcon = (id: string) => {
  const iconProps = { className: "w-5 h-5" };
  switch (id) {
    case 'home':
      return <HomeIcon {...iconProps} />;
    case 'about':
      return <UserIcon {...iconProps} />;
    case 'projects':
      return <CodeIcon {...iconProps} />;
    case 'skills':
      return <StarIcon {...iconProps} />;
    case 'contact':
      return <MailIcon {...iconProps} />;
    default:
      return null;
  }
};

export const Navigation: React.FC<NavigationProps> = ({
  className,
  variant = 'header',
  isScrolled = false,
}) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll-based visibility for header variant
  useEffect(() => {
    if (variant !== 'header') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, variant]);

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

  const handleNavClick = (href: string, id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Base classes for different variants
  const getVariantClasses = () => {
    switch (variant) {
      case 'header':
        return [
          'fixed',
          'top-0',
          'left-0',
          'right-0',
          'z-50',
          'transition-all',
          'duration-500',
          'ease-out',
          isVisible ? 'translate-y-0' : '-translate-y-full',
          isScrolled ? 'backdrop-blur-xl bg-black/20' : 'backdrop-blur-sm bg-transparent',
        ];
      case 'sidebar':
        return [
          'fixed',
          'left-0',
          'top-0',
          'h-full',
          'w-64',
          'z-40',
          'backdrop-blur-xl',
          'bg-black/30',
          'border-r',
          'border-white/10',
        ];
      case 'floating':
        return [
          'fixed',
          'bottom-8',
          'left-1/2',
          '-translate-x-1/2',
          'z-50',
          'backdrop-blur-xl',
          'bg-black/40',
          'rounded-full',
          'border',
          'border-white/20',
          'shadow-2xl',
          'shadow-black/50',
        ];
      default:
        return [];
    }
  };

  const baseClasses = [
    'glass-card',
    'transition-all',
    'duration-500',
    'ease-out',
    ...getVariantClasses(),
  ];

  if (variant === 'header') {
    return (
      <nav className={clsx(baseClasses, className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={() => handleNavClick('#home', 'home')}
                className="flex items-center space-x-3 group"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-gold to-accent-silver flex items-center justify-center">
                    <UniverseIcon className="w-6 h-6 text-bg-primary" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-gold to-accent-silver opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                </div>
                <span className="text-xl font-display font-semibold text-text-primary group-hover:text-accent-gold transition-colors duration-300">
                  Universe Portfolio
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href, item.id)}
                    className={clsx(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out',
                      'flex items-center space-x-2 group relative overflow-hidden',
                      activeSection === item.id
                        ? [
                            'bg-accent-gold/20',
                            'text-accent-gold',
                            'shadow-lg',
                            'shadow-accent-gold/20',
                          ]
                        : [
                            'text-text-secondary',
                            'hover:text-text-primary',
                            'hover:bg-white/10',
                            'hover:backdrop-blur-sm',
                          ]
                    )}
                  >
                    {/* Active indicator */}
                    {activeSection === item.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/10 via-accent-gold/20 to-accent-gold/10 animate-pulse" />
                    )}
                    
                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    
                    <span className="relative z-10 flex items-center space-x-2">
                      {getNavIcon(item.id)}
                      <span>{item.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* GitHub Button */}
            <div className="hidden md:block">
              <a
                href="https://github.com/YxshR"
                target="_blank"
                rel="noopener noreferrer"
                className="github-button group"
              >
                <GitHubIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>GitHub</span>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <XIcon className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl bg-black/40 border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href, item.id)}
                  className={clsx(
                    'w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300',
                    'flex items-center space-x-3 group',
                    activeSection === item.id
                      ? 'bg-accent-gold/20 text-accent-gold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/10'
                  )}
                >
                  {getNavIcon(item.id)}
                  <span>{item.label}</span>
                </button>
              ))}
              
              {/* Mobile GitHub Button */}
              <a
                href="https://github.com/YxshR"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all duration-300"
              >
                <GitHubIcon className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    );
  }

  if (variant === 'floating') {
    return (
      <nav className={clsx(baseClasses, className)}>
        <div className="flex items-center space-x-2 px-4 py-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.href, item.id)}
              className={clsx(
                'p-3 rounded-full transition-all duration-300 ease-out group relative',
                activeSection === item.id
                  ? [
                      'bg-accent-gold/30',
                      'text-accent-gold',
                      'shadow-lg',
                      'shadow-accent-gold/30',
                      'scale-110',
                    ]
                  : [
                      'text-text-secondary',
                      'hover:text-text-primary',
                      'hover:bg-white/20',
                      'hover:scale-105',
                    ]
              )}
              title={item.label}
            >
              {/* Active pulse effect */}
              {activeSection === item.id && (
                <div className="absolute inset-0 rounded-full bg-accent-gold/20 animate-ping" />
              )}
              
              <span className="relative z-10">
                {getNavIcon(item.id)}
              </span>
            </button>
          ))}
        </div>
      </nav>
    );
  }

  // Sidebar variant
  return (
    <nav className={clsx(baseClasses, className)}>
      <div className="p-6">
        {/* Logo */}
        <div className="mb-8">
          <button
            onClick={() => handleNavClick('#home', 'home')}
            className="flex items-center space-x-3 group w-full"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent-gold to-accent-silver flex items-center justify-center">
                <UniverseIcon className="w-7 h-7 text-bg-primary" />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-gold to-accent-silver opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
            </div>
            <div>
              <div className="text-lg font-display font-semibold text-text-primary group-hover:text-accent-gold transition-colors duration-300">
                Universe
              </div>
              <div className="text-sm text-text-muted">
                Portfolio
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.href, item.id)}
              className={clsx(
                'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 group relative overflow-hidden',
                activeSection === item.id
                  ? [
                      'bg-accent-gold/20',
                      'text-accent-gold',
                      'shadow-lg',
                      'shadow-accent-gold/20',
                    ]
                  : [
                      'text-text-secondary',
                      'hover:text-text-primary',
                      'hover:bg-white/10',
                    ]
              )}
            >
              {/* Active indicator */}
              {activeSection === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold rounded-r-full" />
              )}
              
              {/* Hover shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              
              <span className="relative z-10 flex items-center space-x-3 w-full">
                {getNavIcon(item.id)}
                <span className="font-medium">{item.label}</span>
              </span>
            </button>
          ))}
        </div>

        {/* GitHub Button */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <a
            href="https://github.com/YxshR"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all duration-300 group"
          >
            <GitHubIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

// Simple SVG Icons
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

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UniverseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);