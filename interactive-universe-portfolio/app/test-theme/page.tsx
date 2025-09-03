import React from 'react';

export default function TestThemePage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-display font-bold text-accent-gold">
            Premium Dark Theme Test
          </h1>
          <p className="text-xl text-text-secondary font-light">
            Testing all premium UI components and styling
          </p>
        </header>

        {/* Color Palette Section */}
        <section className="glass-card p-8">
          <h2 className="text-3xl font-display font-semibold mb-6 text-text-primary">
            Color Palette
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-bg-primary rounded-lg border border-glass-border mx-auto mb-2"></div>
              <p className="text-sm text-text-muted">Primary BG</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-bg-secondary rounded-lg border border-glass-border mx-auto mb-2"></div>
              <p className="text-sm text-text-muted">Secondary BG</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-bg-tertiary rounded-lg border border-glass-border mx-auto mb-2"></div>
              <p className="text-sm text-text-muted">Tertiary BG</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent-gold rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-text-muted">Accent Gold</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent-silver rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-text-muted">Accent Silver</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent-blue rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-text-muted">Accent Blue</p>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="glass-card p-8">
          <h2 className="text-3xl font-display font-semibold mb-6 text-text-primary">
            Typography System
          </h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-5xl font-display font-bold text-text-primary">
                Display Font - Playfair Display
              </h1>
              <p className="text-lg text-text-secondary">
                Used for headings and elegant display text
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-sans font-semibold text-text-primary">
                Sans Font - Inter
              </h2>
              <p className="text-base text-text-secondary font-light">
                Used for body text and UI elements. Available in weights: 300, 400, 500, 600, 700
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div>
                <p className="text-text-primary font-semibold mb-2">Primary Text</p>
                <p className="text-text-primary">Main content and headings</p>
              </div>
              <div>
                <p className="text-text-secondary font-semibold mb-2">Secondary Text</p>
                <p className="text-text-secondary">Supporting information</p>
              </div>
              <div>
                <p className="text-text-muted font-semibold mb-2">Muted Text</p>
                <p className="text-text-muted">Subtle details and placeholders</p>
              </div>
            </div>
          </div>
        </section>

        {/* Glass Morphism Components */}
        <section className="space-y-6">
          <h2 className="text-3xl font-display font-semibold text-text-primary">
            Glass Morphism Components
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-display font-semibold mb-3 text-text-primary">
                Basic Glass Card
              </h3>
              <p className="text-text-secondary">
                Hover over this card to see the premium glass morphism effects with backdrop blur and elegant transitions.
              </p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-xl font-display font-semibold mb-3 text-accent-gold">
                Accent Card
              </h3>
              <p className="text-text-secondary">
                Cards can feature accent colors for important content or call-to-action elements.
              </p>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-xl font-display font-semibold mb-3 text-text-primary">
                Interactive Card
              </h3>
              <p className="text-text-secondary mb-4">
                Cards with interactive elements and premium animations.
              </p>
              <button className="btn-primary">
                Premium Button
              </button>
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="glass-card p-8">
          <h2 className="text-3xl font-display font-semibold mb-6 text-text-primary">
            Premium Form Elements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Luxury Input Field
              </label>
              <input
                type="text"
                placeholder="Enter your text here..."
                className="input-luxury w-full"
              />
            </div>
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Email Input
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="input-luxury w-full"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-text-primary font-medium mb-2">
              Message Textarea
            </label>
            <textarea
              placeholder="Your message..."
              rows={4}
              className="input-luxury w-full resize-none"
            />
          </div>
        </section>

        {/* Button Variations */}
        <section className="glass-card p-8">
          <h2 className="text-3xl font-display font-semibold mb-6 text-text-primary">
            Button Variations
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">
              Primary Button
            </button>
            <button className="enter-world-button px-8 py-4 rounded-lg text-lg">
              Enter World Button
            </button>
            <a href="https://github.com/YxshR" className="github-button">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub Profile
            </a>
          </div>
        </section>

        {/* Animation Examples */}
        <section className="glass-card p-8">
          <h2 className="text-3xl font-display font-semibold mb-6 text-text-primary">
            Premium Animations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-4 premium-fade-in">
              <h3 className="text-lg font-semibold text-accent-gold mb-2">
                Premium Fade In
              </h3>
              <p className="text-text-secondary text-sm">
                Elegant entrance animation with blur and scale effects
              </p>
            </div>
            <div className="glass-card p-4 cinematic-entrance">
              <h3 className="text-lg font-semibold text-accent-silver mb-2">
                Cinematic Entrance
              </h3>
              <p className="text-text-secondary text-sm">
                Sophisticated 3D entrance with rotation and depth
              </p>
            </div>
            <div className="glass-card p-4 interactive-element hover:scale-105">
              <h3 className="text-lg font-semibold text-accent-blue mb-2">
                Interactive Element
              </h3>
              <p className="text-text-secondary text-sm">
                Smooth hover interactions with premium easing
              </p>
            </div>
          </div>
        </section>

        {/* Gradient Examples */}
        <section className="glass-card p-8">
          <h2 className="text-3xl font-display font-semibold mb-6 text-text-primary">
            Premium Gradients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 rounded-lg p-4 flex items-center justify-center" 
                 style={{background: 'var(--gradient-primary)'}}>
              <span className="text-text-primary font-semibold">Primary Gradient</span>
            </div>
            <div className="h-32 rounded-lg p-4 flex items-center justify-center" 
                 style={{background: 'var(--gradient-accent)'}}>
              <span className="text-bg-primary font-semibold">Accent Gradient</span>
            </div>
            <div className="h-32 rounded-lg p-4 flex items-center justify-center" 
                 style={{background: 'var(--gradient-glow)'}}>
              <span className="text-text-primary font-semibold">Glow Gradient</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8">
          <p className="text-text-muted">
            Premium Dark Theme Test Page - All components working correctly ✨
          </p>
        </footer>
      </div>
    </div>
  );
}