'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <nav className={`p-6 flex justify-between items-center z-20 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h1 className="text-2xl font-bold text-white font-display">Universe Portfolio</h1>
        <a 
          href="https://github.com/YxshR" 
          target="_blank"
          rel="noopener noreferrer"
          className="github-button glass-card px-6 py-3 text-white hover:text-accent-gold transition-all duration-300 font-medium"
        >
          <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
      </nav>
      
      <main className="flex-1 flex items-center justify-center relative">
        {/* Enhanced Earth Animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Earth Glow */}
            <div className="absolute inset-0 w-96 h-96 rounded-full bg-gradient-radial from-blue-400/20 via-green-400/10 to-transparent animate-pulse"></div>
            
            {/* Earth Body */}
            <div 
              className="w-96 h-96 rounded-full bg-gradient-to-br from-blue-500 via-green-500 to-blue-700 relative overflow-hidden shadow-2xl"
              style={{ 
                animation: 'spin 30s linear infinite',
                boxShadow: '0 0 100px rgba(59, 130, 246, 0.3), inset -20px -20px 50px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Continent Patterns */}
              <div className="absolute inset-0 opacity-60">
                <div className="absolute top-1/4 left-1/4 w-16 h-12 bg-green-600 rounded-full transform rotate-12"></div>
                <div className="absolute top-1/3 right-1/4 w-20 h-8 bg-green-600 rounded-full transform -rotate-45"></div>
                <div className="absolute bottom-1/3 left-1/3 w-12 h-16 bg-green-600 rounded-full transform rotate-45"></div>
                <div className="absolute bottom-1/4 right-1/3 w-14 h-10 bg-green-600 rounded-full transform -rotate-12"></div>
              </div>
              
              {/* Atmospheric Layer */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-blue-300/10 to-blue-200/20"></div>
            </div>
            
            {/* Orbiting Stars */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-accent-gold rounded-full shadow-lg"
                style={{
                  animation: `orbit ${8 + i * 2}s linear infinite`,
                  transformOrigin: '200px 200px',
                  top: '190px',
                  left: `${180 + i * 40}px`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Enhanced Main Content with depth effects */}
        <div className={`text-center z-10 transition-all duration-1500 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-accent-gold/10 via-transparent to-transparent blur-3xl scale-150"></div>
            
            <h2 className="text-7xl font-display font-bold text-white mb-6 leading-tight relative">
              Welcome to My
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-accent-silver to-accent-gold bg-size-200 animate-shimmer">
                Universe
              </span>
            </h2>
          </div>
          
          <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed relative">
            <span className="relative z-10">
              Experience an interactive 3D portfolio where every visitor becomes a star in the digital cosmos
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-sm"></div>
          </p>
          
          <div className="relative inline-block">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-gold to-accent-silver rounded-full blur-xl opacity-30 scale-110 animate-pulse"></div>
            
            <Link href="/universe">
              <button className="enter-world-button text-2xl px-12 py-6 rounded-full font-semibold transform transition-all duration-500 shadow-2xl hover:shadow-accent-gold/50 relative z-10">
                <span className="relative z-10">Enter to my World</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-gold to-accent-silver rounded-full opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className={`p-6 text-center text-text-muted transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="font-light">Interactive Universe Portfolio • 2024</p>
      </footer>
    </div>
  );
}