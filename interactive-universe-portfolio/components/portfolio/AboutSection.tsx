'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';

interface AboutSectionProps {
  className?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ className }) => {
  return (
    <section className={clsx('relative py-20 px-6', className)}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-gold to-accent-silver mx-auto rounded-full" />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Card */}
          <Card variant="elevated" padding="xl" glow shimmer>
            <CardHeader>
              <div className="flex items-center gap-6 mb-6">
                {/* Avatar Placeholder */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-gold/20 to-accent-silver/20 border-2 border-accent-gold/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-gold to-accent-silver opacity-80" />
                </div>
                <div>
                  <CardTitle size="xl" className="mb-2">
                    Full Stack Developer
                  </CardTitle>
                  <p className="text-accent-gold font-medium">
                    Crafting Digital Experiences
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">
                  Welcome to my digital universe! I&apos;m a passionate full-stack developer 
                  who believes in creating immersive, interactive experiences that push 
                  the boundaries of what&apos;s possible on the web.
                </p>
                
                <p className="leading-relaxed">
                  With expertise in modern web technologies, I specialize in building 
                  sophisticated applications that combine stunning visual design with 
                  robust functionality. From 3D visualizations to complex data systems, 
                  I love turning ambitious ideas into reality.
                </p>

                <div className="flex flex-wrap gap-3 pt-4">
                  <span className="px-3 py-1 bg-accent-gold/10 border border-accent-gold/20 rounded-full text-accent-gold text-sm font-medium">
                    React & Next.js
                  </span>
                  <span className="px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 rounded-full text-accent-blue text-sm font-medium">
                    Three.js & WebGL
                  </span>
                  <span className="px-3 py-1 bg-accent-silver/10 border border-accent-silver/20 rounded-full text-accent-silver text-sm font-medium">
                    TypeScript
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats & Highlights */}
          <div className="space-y-8">
            {/* Experience Stats */}
            <Card variant="interactive" padding="lg">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-gold mb-2">5+</div>
                  <div className="text-text-secondary">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-silver mb-2">50+</div>
                  <div className="text-text-secondary">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-blue mb-2">100%</div>
                  <div className="text-text-secondary">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-primary mb-2">24/7</div>
                  <div className="text-text-secondary">Passion Driven</div>
                </div>
              </div>
            </Card>

            {/* Philosophy Card */}
            <Card variant="default" padding="lg">
              <CardHeader>
                <CardTitle size="lg" className="text-accent-gold">
                  My Philosophy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-lg italic text-text-secondary leading-relaxed">
                  &ldquo;Great software isn&apos;t just about clean code—it&apos;s about creating 
                  experiences that inspire, engage, and leave lasting impressions. 
                  Every pixel, every interaction, every line of code should serve 
                  a purpose in telling your story.&rdquo;
                </blockquote>
              </CardContent>
            </Card>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg" className="flex-1">
                View My Work
              </Button>
              <Button variant="secondary" size="lg" className="flex-1">
                Let&apos;s Connect
              </Button>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent-gold/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent-blue/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-silver/3 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
    </section>
  );
};