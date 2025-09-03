'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { clsx } from 'clsx';

interface Skill {
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | '3d' | 'tools' | 'soft';
  icon: string;
  description: string;
  yearsOfExperience: number;
}

interface SkillsSectionProps {
  className?: string;
}

// Mock skills data
const mockSkills: Skill[] = [
  // Frontend
  {
    name: 'React & Next.js',
    level: 95,
    category: 'frontend',
    icon: '⚛️',
    description: 'Advanced React development with hooks, context, and modern patterns',
    yearsOfExperience: 5
  },
  {
    name: 'TypeScript',
    level: 90,
    category: 'frontend',
    icon: '📘',
    description: 'Type-safe development with advanced TypeScript features',
    yearsOfExperience: 4
  },
  {
    name: 'Three.js & WebGL',
    level: 85,
    category: '3d',
    icon: '🎮',
    description: '3D graphics, animations, and interactive experiences',
    yearsOfExperience: 3
  },
  {
    name: 'Tailwind CSS',
    level: 92,
    category: 'frontend',
    icon: '🎨',
    description: 'Utility-first CSS framework for rapid UI development',
    yearsOfExperience: 3
  },
  
  // Backend
  {
    name: 'Node.js & Express',
    level: 88,
    category: 'backend',
    icon: '🟢',
    description: 'Server-side JavaScript with RESTful APIs and middleware',
    yearsOfExperience: 4
  },
  {
    name: 'PostgreSQL & Prisma',
    level: 85,
    category: 'backend',
    icon: '🐘',
    description: 'Database design, optimization, and ORM integration',
    yearsOfExperience: 3
  },
  {
    name: 'Python & FastAPI',
    level: 80,
    category: 'backend',
    icon: '🐍',
    description: 'High-performance APIs and data processing',
    yearsOfExperience: 2
  },
  
  // Tools & DevOps
  {
    name: 'Git & GitHub',
    level: 93,
    category: 'tools',
    icon: '🔧',
    description: 'Version control, collaboration, and CI/CD workflows',
    yearsOfExperience: 5
  },
  {
    name: 'Docker & AWS',
    level: 75,
    category: 'tools',
    icon: '☁️',
    description: 'Containerization and cloud deployment strategies',
    yearsOfExperience: 2
  },
  {
    name: 'Figma & Design',
    level: 82,
    category: 'tools',
    icon: '🎯',
    description: 'UI/UX design, prototyping, and design systems',
    yearsOfExperience: 3
  },
  
  // Soft Skills
  {
    name: 'Problem Solving',
    level: 95,
    category: 'soft',
    icon: '🧩',
    description: 'Analytical thinking and creative solution development',
    yearsOfExperience: 5
  },
  {
    name: 'Team Leadership',
    level: 85,
    category: 'soft',
    icon: '👥',
    description: 'Project management and team coordination',
    yearsOfExperience: 3
  }
];

const skillCategories = [
  { id: 'all', label: 'All Skills', color: 'text-text-primary' },
  { id: 'frontend', label: 'Frontend', color: 'text-accent-gold' },
  { id: 'backend', label: 'Backend', color: 'text-accent-blue' },
  { id: '3d', label: '3D & Graphics', color: 'text-accent-silver' },
  { id: 'tools', label: 'Tools & DevOps', color: 'text-green-400' },
  { id: 'soft', label: 'Soft Skills', color: 'text-purple-400' }
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({ className }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const filteredSkills = activeCategory === 'all' 
    ? mockSkills 
    : mockSkills.filter(skill => skill.category === activeCategory);

  const getSkillLevelColor = (level: number) => {
    if (level >= 90) return 'from-accent-gold to-accent-silver';
    if (level >= 80) return 'from-accent-blue to-accent-gold';
    if (level >= 70) return 'from-green-400 to-accent-blue';
    return 'from-gray-400 to-gray-600';
  };

  const getSkillLevelLabel = (level: number) => {
    if (level >= 90) return 'Expert';
    if (level >= 80) return 'Advanced';
    if (level >= 70) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <section className={clsx('relative py-20 px-6', className)}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
            Skills & Expertise
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
            A comprehensive overview of my technical skills, tools, and expertise 
            developed through years of hands-on experience and continuous learning.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-gold to-accent-silver mx-auto rounded-full" />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {skillCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={clsx(
                'px-6 py-3 rounded-full font-medium transition-all duration-300',
                'border backdrop-blur-sm',
                activeCategory === category.id
                  ? 'bg-accent-gold/20 border-accent-gold/40 text-accent-gold'
                  : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10 hover:border-white/20 hover:text-text-primary'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Skills Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card variant="default" padding="lg" className="text-center">
            <div className="text-3xl font-bold text-accent-gold mb-2">
              {mockSkills.length}
            </div>
            <div className="text-text-secondary">Total Skills</div>
          </Card>
          
          <Card variant="default" padding="lg" className="text-center">
            <div className="text-3xl font-bold text-accent-blue mb-2">
              {mockSkills.filter(s => s.level >= 90).length}
            </div>
            <div className="text-text-secondary">Expert Level</div>
          </Card>
          
          <Card variant="default" padding="lg" className="text-center">
            <div className="text-3xl font-bold text-accent-silver mb-2">
              {Math.round(mockSkills.reduce((acc, skill) => acc + skill.yearsOfExperience, 0) / mockSkills.length)}
            </div>
            <div className="text-text-secondary">Avg. Experience</div>
          </Card>
          
          <Card variant="default" padding="lg" className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {Math.round(mockSkills.reduce((acc, skill) => acc + skill.level, 0) / mockSkills.length)}%
            </div>
            <div className="text-text-secondary">Avg. Proficiency</div>
          </Card>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <Card
                variant="interactive"
                padding="lg"
                className="group cursor-pointer"
              >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl">{skill.icon}</div>
                <div className="flex-1">
                  <CardTitle size="md" className="mb-1">
                    {skill.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-accent-gold font-medium">
                      {getSkillLevelLabel(skill.level)}
                    </span>
                    <span className="text-xs text-text-muted">
                      {skill.yearsOfExperience} years
                    </span>
                  </div>
                </div>
              </div>

              {/* Skill Level Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-text-secondary">Proficiency</span>
                  <span className="text-sm font-medium text-text-primary">{skill.level}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={clsx(
                      'h-full bg-gradient-to-r transition-all duration-1000 ease-out',
                      getSkillLevelColor(skill.level),
                      hoveredSkill === skill.name ? 'animate-pulse' : ''
                    )}
                    style={{
                      width: hoveredSkill === skill.name ? `${skill.level}%` : '0%',
                      transitionDelay: hoveredSkill === skill.name ? '200ms' : '0ms'
                    }}
                  />
                </div>
              </div>

              {/* Skill Description */}
              <CardContent className="p-0">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {skill.description}
                </p>
              </CardContent>

              {/* Hover Effect Indicator */}
              <div className={clsx(
                'absolute top-4 right-4 w-2 h-2 rounded-full transition-all duration-300',
                hoveredSkill === skill.name 
                  ? 'bg-accent-gold shadow-lg shadow-accent-gold/50 scale-150' 
                  : 'bg-white/20 scale-100'
              )} />
            </Card>
            </div>
          ))}
        </div>

        {/* Skills Visualization */}
        <div className="mt-16">
          <Card variant="elevated" padding="xl">
            <CardHeader>
              <CardTitle size="lg" className="text-center mb-8">
                Skill Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Category Breakdown */}
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-6">
                    By Category
                  </h4>
                  <div className="space-y-4">
                    {skillCategories.slice(1).map((category) => {
                      const categorySkills = mockSkills.filter(s => s.category === category.id);
                      const avgLevel = categorySkills.length > 0 
                        ? Math.round(categorySkills.reduce((acc, skill) => acc + skill.level, 0) / categorySkills.length)
                        : 0;
                      
                      return (
                        <div key={category.id} className="flex items-center justify-between">
                          <span className={clsx('font-medium', category.color)}>
                            {category.label}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-white/10 rounded-full h-2">
                              <div
                                className={clsx(
                                  'h-full rounded-full bg-gradient-to-r',
                                  getSkillLevelColor(avgLevel)
                                )}
                                style={{ width: `${avgLevel}%` }}
                              />
                            </div>
                            <span className="text-sm text-text-secondary w-12 text-right">
                              {avgLevel}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Experience Timeline */}
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-6">
                    Experience Timeline
                  </h4>
                  <div className="space-y-4">
                    {mockSkills
                      .sort((a, b) => b.yearsOfExperience - a.yearsOfExperience)
                      .slice(0, 6)
                      .map((skill) => (
                        <div key={skill.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{skill.icon}</span>
                            <span className="text-sm text-text-secondary">
                              {skill.name}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-accent-gold">
                            {skill.yearsOfExperience} years
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-32 left-16 w-32 h-32 bg-accent-gold/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-accent-blue/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-2/3 left-1/3 w-40 h-40 bg-accent-silver/3 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
    </section>
  );
};