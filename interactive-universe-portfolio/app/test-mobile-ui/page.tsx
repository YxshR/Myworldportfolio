/**
 * Test page for mobile UI components
 * Demonstrates responsive design, touch gestures, and mobile optimizations
 */

'use client';

import React, { useState } from 'react';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { MobileButton } from '@/components/ui/MobileButton';
import { MobileCard, MobileCardHeader, MobileCardTitle, MobileCardContent, MobileCardFooter } from '@/components/ui/MobileCard';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { clsx } from 'clsx';

export default function TestMobileUI() {
  const { optimizations } = useMobileOptimizations();
  const [notifications, setNotifications] = useState<string[]>([]);
  const [swipeCount, setSwipeCount] = useState({ left: 0, right: 0, up: 0, down: 0 });
  
  const addNotification = (message: string) => {
    setNotifications(prev => [...prev.slice(-4), message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };
  
  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    setSwipeCount(prev => ({ ...prev, [direction]: prev[direction] + 1 }));
    addNotification(`Swiped ${direction}!`);
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Navigation */}
      <MobileNavigation 
        isScrolled={true}
        onNavigate={(section) => addNotification(`Navigated to ${section}`)}
      />
      
      {/* Main Content */}
      <div className="pt-20 pb-32 px-4 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Mobile UI Test</h1>
          <p className="text-text-secondary">
            Test touch gestures, haptic feedback, and mobile optimizations
          </p>
        </div>
        
        {/* Device Info */}
        {optimizations.capabilities && (
          <MobileCard variant="elevated" padding="lg">
            <MobileCardHeader>
              <MobileCardTitle>Device Information</MobileCardTitle>
            </MobileCardHeader>
            <MobileCardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-muted">Type:</span>
                  <span className="ml-2 text-accent-gold">
                    {optimizations.capabilities.isMobile ? 'Mobile' : 
                     optimizations.capabilities.isTablet ? 'Tablet' : 'Desktop'}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">Touch:</span>
                  <span className="ml-2 text-accent-gold">
                    {optimizations.capabilities.hasTouch ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">Screen:</span>
                  <span className="ml-2 text-accent-gold">
                    {optimizations.capabilities.screenSize}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">Pixel Ratio:</span>
                  <span className="ml-2 text-accent-gold">
                    {optimizations.capabilities.pixelRatio}x
                  </span>
                </div>
              </div>
            </MobileCardContent>
          </MobileCard>
        )}
        
        {/* Button Tests */}
        <MobileCard variant="default" padding="lg">
          <MobileCardHeader>
            <MobileCardTitle>Button Tests</MobileCardTitle>
          </MobileCardHeader>
          <MobileCardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <MobileButton
                  variant="primary"
                  size="md"
                  onClick={() => addNotification('Primary button clicked!')}
                  hapticFeedback="medium"
                  icon={<span>🚀</span>}
                >
                  Primary
                </MobileButton>
                
                <MobileButton
                  variant="secondary"
                  size="md"
                  onClick={() => addNotification('Secondary button clicked!')}
                  hapticFeedback="light"
                  icon={<span>⭐</span>}
                >
                  Secondary
                </MobileButton>
              </div>
              
              <MobileButton
                variant="ghost"
                size="lg"
                onClick={() => addNotification('Ghost button clicked!')}
                onLongPress={() => addNotification('Long press detected!')}
                hapticFeedback="heavy"
                className="w-full"
                icon={<span>👻</span>}
              >
                Ghost (Try Long Press)
              </MobileButton>
              
              <MobileButton
                variant="floating"
                size="xl"
                onClick={() => addNotification('Floating button clicked!')}
                rippleEffect={true}
                className="w-full"
                icon={<span>🌟</span>}
              >
                Floating with Ripple
              </MobileButton>
            </div>
          </MobileCardContent>
        </MobileCard>
        
        {/* Swipe Tests */}
        <MobileCard variant="default" padding="lg">
          <MobileCardHeader>
            <MobileCardTitle>Swipe Gesture Tests</MobileCardTitle>
          </MobileCardHeader>
          <MobileCardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 text-center text-sm mb-4">
                <div>
                  <div className="text-accent-gold font-bold">{swipeCount.left}</div>
                  <div className="text-text-muted">← Left</div>
                </div>
                <div>
                  <div className="text-accent-gold font-bold">{swipeCount.right}</div>
                  <div className="text-text-muted">Right →</div>
                </div>
                <div>
                  <div className="text-accent-gold font-bold">{swipeCount.up}</div>
                  <div className="text-text-muted">↑ Up</div>
                </div>
                <div>
                  <div className="text-accent-gold font-bold">{swipeCount.down}</div>
                  <div className="text-text-muted">Down ↓</div>
                </div>
              </div>
              
              <MobileCard
                variant="swipeable"
                padding="lg"
                onSwipeLeft={() => handleSwipe('left')}
                onSwipeRight={() => handleSwipe('right')}
                onSwipeUp={() => handleSwipe('up')}
                onSwipeDown={() => handleSwipe('down')}
                hapticFeedback={true}
                className="bg-gradient-to-br from-accent-gold/10 to-accent-silver/10 border-accent-gold/20"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">👆</div>
                  <div className="font-semibold mb-1">Swipe Me!</div>
                  <div className="text-sm text-text-muted">
                    Try swiping in any direction
                  </div>
                </div>
              </MobileCard>
            </div>
          </MobileCardContent>
        </MobileCard>
        
        {/* Interactive Cards */}
        <MobileCard variant="default" padding="lg">
          <MobileCardHeader>
            <MobileCardTitle>Interactive Cards</MobileCardTitle>
          </MobileCardHeader>
          <MobileCardContent>
            <div className="space-y-4">
              <MobileCard
                variant="interactive"
                padding="md"
                onClick={() => addNotification('Interactive card clicked!')}
                glow={true}
                shimmer={true}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <div className="font-semibold">Interactive Card</div>
                    <div className="text-sm text-text-muted">Click me for interaction</div>
                  </div>
                </div>
              </MobileCard>
              
              <MobileCard
                variant="elevated"
                padding="md"
                expandOnTouch={true}
                hapticFeedback={true}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🔍</div>
                  <div>
                    <div className="font-semibold">Expandable Card</div>
                    <div className="text-sm text-text-muted">Long press to expand</div>
                  </div>
                </div>
              </MobileCard>
            </div>
          </MobileCardContent>
        </MobileCard>
        
        {/* Performance Info */}
        <MobileCard variant="default" padding="lg">
          <MobileCardHeader>
            <MobileCardTitle>Performance Metrics</MobileCardTitle>
          </MobileCardHeader>
          <MobileCardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-muted">Current FPS:</span>
                <span className={clsx(
                  'font-bold',
                  optimizations.currentFPS > 50 ? 'text-green-400' :
                  optimizations.currentFPS > 30 ? 'text-yellow-400' : 'text-red-400'
                )}>
                  {optimizations.currentFPS}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-text-muted">Quality Level:</span>
                <span className="text-accent-gold font-bold">
                  {optimizations.qualityLevel}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-text-muted">Adaptive Quality:</span>
                <span className={clsx(
                  'font-bold',
                  optimizations.adaptiveQuality ? 'text-green-400' : 'text-gray-400'
                )}>
                  {optimizations.adaptiveQuality ? 'ON' : 'OFF'}
                </span>
              </div>
              
              {optimizations.isPerformancePoor && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mt-3">
                  <div className="text-red-400 text-sm font-medium">
                    ⚠️ Performance Warning
                  </div>
                </div>
              )}
            </div>
          </MobileCardContent>
        </MobileCard>
        
        {/* Instructions */}
        <MobileCard variant="default" padding="lg">
          <MobileCardHeader>
            <MobileCardTitle>Test Instructions</MobileCardTitle>
          </MobileCardHeader>
          <MobileCardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-accent-gold">•</span>
                <span>Tap buttons to feel haptic feedback</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-accent-gold">•</span>
                <span>Long press the ghost button for special action</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-accent-gold">•</span>
                <span>Swipe the swipe card in different directions</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-accent-gold">•</span>
                <span>Long press the expandable card to see expansion</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-accent-gold">•</span>
                <span>Use the navigation menu to test mobile navigation</span>
              </div>
            </div>
          </MobileCardContent>
        </MobileCard>
      </div>
      
      {/* Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="bg-black/80 backdrop-blur-xl border border-accent-gold/30 rounded-lg px-4 py-2 text-sm text-accent-gold animate-in slide-in-from-right duration-300"
          >
            {notification}
          </div>
        ))}
      </div>
    </div>
  );
}