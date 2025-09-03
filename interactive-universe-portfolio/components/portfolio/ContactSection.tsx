'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmailForm } from '@/components/ui/EmailForm';
import { clsx } from 'clsx';

interface ContactSectionProps {
  className?: string;
  onEmailSubmit?: (email: string, name: string) => void | Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  success?: boolean;
}

interface ContactMethod {
  id: string;
  name: string;
  icon: string;
  value: string;
  href: string;
  description: string;
  color: string;
}

const contactMethods: ContactMethod[] = [
  {
    id: 'email',
    name: 'Email',
    icon: '📧',
    value: 'hello@universe-portfolio.dev',
    href: 'mailto:hello@universe-portfolio.dev',
    description: 'Drop me a line for project inquiries',
    color: 'text-accent-gold'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '🐙',
    value: 'github.com/YxshR',
    href: 'https://github.com/YxshR',
    description: 'Check out my code and contributions',
    color: 'text-accent-silver'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    value: 'linkedin.com/in/universe-dev',
    href: 'https://linkedin.com/in/universe-dev',
    description: 'Connect with me professionally',
    color: 'text-accent-blue'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: '🐦',
    value: '@UniverseDev',
    href: 'https://twitter.com/UniverseDev',
    description: 'Follow my development journey',
    color: 'text-blue-400'
  }
];

const quickMessages = [
  "I&apos;d like to discuss a project",
  "I&apos;m interested in collaboration",
  "I have a question about your work",
  "I&apos;d like to hire you",
  "Just saying hello!"
];

export const ContactSection: React.FC<ContactSectionProps> = ({ 
  className, 
  onEmailSubmit,
  isLoading = false,
  error = null,
  success = false
}) => {
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [showEmailForm, setShowEmailForm] = useState<boolean>(false);

  const handleEmailSubmit = async (email: string, name: string) => {
    if (onEmailSubmit) {
      await onEmailSubmit(email, name);
    } else {
      // Default behavior - could integrate with a contact API
      console.log('Contact form submitted:', { email, name, message: selectedMessage || customMessage });
    }
  };

  const handleQuickContact = (method: ContactMethod) => {
    if (method.id === 'email') {
      setShowEmailForm(true);
    } else {
      window.open(method.href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className={clsx('relative py-20 px-6', className)}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
            Let&apos;s Connect
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
            Ready to bring your ideas to life? I&apos;m always excited to discuss new projects, 
            creative collaborations, and innovative solutions. Let&apos;s build something amazing together.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-gold to-accent-silver mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Methods */}
          <div className="space-y-8">
            <Card variant="elevated" padding="xl">
              <CardHeader>
                <CardTitle size="lg" className="mb-6">
                  Get In Touch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {contactMethods.map((method) => (
                    <div
                      key={method.id}
                      className="group cursor-pointer"
                      onClick={() => handleQuickContact(method)}
                    >
                      <Card
                        variant="interactive"
                        padding="lg"
                        className="transition-all duration-300 hover:scale-105"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{method.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={clsx('font-semibold', method.color)}>
                                {method.name}
                              </h4>
                              <svg 
                                className="w-4 h-4 text-text-muted group-hover:text-accent-gold transition-colors" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                            <p className="text-text-secondary text-sm mb-1">
                              {method.value}
                            </p>
                            <p className="text-text-muted text-xs">
                              {method.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Message Templates */}
            <Card variant="default" padding="lg">
              <CardHeader>
                <CardTitle size="md" className="mb-4">
                  Quick Message Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickMessages.map((message, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedMessage(message);
                        setShowEmailForm(true);
                      }}
                      className={clsx(
                        'w-full text-left p-3 rounded-lg border transition-all duration-300',
                        'hover:bg-white/5 hover:border-accent-gold/30',
                        selectedMessage === message
                          ? 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold'
                          : 'bg-white/5 border-white/10 text-text-secondary'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg">💬</div>
                        <span className="text-sm">{message}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <textarea
                    placeholder="Or write your own message..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-accent-gold/30 focus:bg-white/8 transition-all duration-300"
                    rows={3}
                  />
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full mt-4"
                  onClick={() => setShowEmailForm(true)}
                  disabled={!selectedMessage && !customMessage.trim()}
                >
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Email Form or Contact Info */}
          <div className="space-y-8">
            {showEmailForm ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-display font-semibold text-text-primary">
                    Send Your Message
                  </h3>
                  <button
                    onClick={() => setShowEmailForm(false)}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                {(selectedMessage || customMessage) && (
                  <Card variant="default" padding="md" className="mb-6">
                    <div className="text-sm text-text-secondary">
                      <strong>Your message:</strong>
                      <p className="mt-2 text-text-primary">
                        {selectedMessage || customMessage}
                      </p>
                    </div>
                  </Card>
                )}

                <EmailForm
                  onSubmit={handleEmailSubmit}
                  title="Contact Me"
                  subtitle="I'll get back to you as soon as possible"
                  className="max-w-none"
                  isLoading={isLoading}
                  error={error || undefined}
                  success={success}
                />
              </div>
            ) : (
              <>
                {/* Availability Status */}
                <Card variant="elevated" padding="lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 font-medium">Available for new projects</span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    I&apos;m currently accepting new client projects and collaborations. 
                    Typical response time is within 24 hours.
                  </p>
                </Card>

                {/* Location & Timezone */}
                <Card variant="default" padding="lg">
                  <CardHeader>
                    <CardTitle size="md" className="mb-4">
                      Location & Timezone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">🌍</div>
                        <div>
                          <p className="text-text-primary font-medium">Remote Worldwide</p>
                          <p className="text-text-secondary text-sm">Open to global collaborations</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xl">🕐</div>
                        <div>
                          <p className="text-text-primary font-medium">UTC+0 Timezone</p>
                          <p className="text-text-secondary text-sm">Flexible with meeting times</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xl">💼</div>
                        <div>
                          <p className="text-text-primary font-medium">Full-time Available</p>
                          <p className="text-text-secondary text-sm">Ready for long-term projects</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Call to Action */}
                <Card variant="interactive" padding="lg" className="text-center">
                  <div className="mb-4">
                    <div className="text-4xl mb-3">🚀</div>
                    <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
                      Ready to Start?
                    </h3>
                    <p className="text-text-secondary text-sm">
                      Let&apos;s discuss your project and bring your vision to life
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowEmailForm(true)}
                    className="w-full"
                  >
                    Start a Conversation
                  </Button>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-32 left-20 w-40 h-40 bg-accent-gold/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-20 w-56 h-56 bg-accent-blue/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-accent-silver/3 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
    </section>
  );
};