'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: 'web' | 'mobile' | '3d' | 'fullstack';
  technologies: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'concept';
}

interface ProjectsSectionProps {
  className?: string;
}

// Mock project data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Interactive Universe Portfolio',
    description: 'A 3D interactive portfolio featuring a rotating Earth with real-time visitor stars.',
    longDescription: 'This immersive portfolio experience combines Three.js with React to create a unique 3D universe where visitors become stars orbiting Earth. Features real-time synchronization, geolocation-based star positioning, and premium UI/UX design.',
    category: '3d',
    technologies: ['React', 'Three.js', 'Next.js', 'TypeScript', 'WebGL'],
    image: '/projects/universe-portfolio.jpg',
    demoUrl: 'https://universe-portfolio.demo',
    githubUrl: 'https://github.com/YxshR/universe-portfolio',
    featured: true,
    status: 'completed'
  },
  {
    id: '2',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with advanced analytics and inventory management.',
    longDescription: 'A comprehensive e-commerce platform built with modern technologies, featuring real-time inventory tracking, advanced analytics dashboard, payment processing, and mobile-responsive design.',
    category: 'fullstack',
    technologies: ['Next.js', 'PostgreSQL', 'Prisma', 'Stripe', 'Redis'],
    image: '/projects/ecommerce-platform.jpg',
    demoUrl: 'https://ecommerce-demo.com',
    githubUrl: 'https://github.com/YxshR/ecommerce-platform',
    featured: true,
    status: 'completed'
  },
  {
    id: '3',
    title: 'AI-Powered Task Manager',
    description: 'Smart task management app with AI-driven priority suggestions and automation.',
    longDescription: 'An intelligent task management application that uses machine learning to suggest task priorities, automate scheduling, and provide productivity insights.',
    category: 'web',
    technologies: ['React', 'Node.js', 'OpenAI API', 'MongoDB', 'Socket.io'],
    image: '/projects/ai-task-manager.jpg',
    demoUrl: 'https://ai-tasks.demo',
    githubUrl: 'https://github.com/YxshR/ai-task-manager',
    featured: false,
    status: 'in-progress'
  },
  {
    id: '4',
    title: 'Mobile Fitness Tracker',
    description: 'Cross-platform mobile app for fitness tracking with social features.',
    longDescription: 'A comprehensive fitness tracking application with social features, workout planning, progress analytics, and community challenges.',
    category: 'mobile',
    technologies: ['React Native', 'Firebase', 'Redux', 'Expo', 'Chart.js'],
    image: '/projects/fitness-tracker.jpg',
    demoUrl: 'https://fitness-app.demo',
    githubUrl: 'https://github.com/YxshR/fitness-tracker',
    featured: false,
    status: 'completed'
  },
  {
    id: '5',
    title: 'VR Data Visualization',
    description: 'Immersive VR experience for exploring complex datasets in 3D space.',
    longDescription: 'A virtual reality application that transforms complex data into immersive 3D visualizations, allowing users to explore and interact with data in unprecedented ways.',
    category: '3d',
    technologies: ['A-Frame', 'WebXR', 'D3.js', 'WebGL', 'Three.js'],
    image: '/projects/vr-data-viz.jpg',
    githubUrl: 'https://github.com/YxshR/vr-data-viz',
    featured: true,
    status: 'concept'
  },
  {
    id: '6',
    title: 'Real-time Chat Platform',
    description: 'Scalable chat application with video calls and file sharing capabilities.',
    longDescription: 'A modern chat platform supporting real-time messaging, video calls, file sharing, and team collaboration features with end-to-end encryption.',
    category: 'fullstack',
    technologies: ['Socket.io', 'WebRTC', 'Express.js', 'PostgreSQL', 'Redis'],
    image: '/projects/chat-platform.jpg',
    demoUrl: 'https://chat-demo.com',
    githubUrl: 'https://github.com/YxshR/chat-platform',
    featured: false,
    status: 'completed'
  }
];

const categories = [
  { id: 'all', label: 'All Projects', count: mockProjects.length },
  { id: 'web', label: 'Web Apps', count: mockProjects.filter(p => p.category === 'web').length },
  { id: 'mobile', label: 'Mobile', count: mockProjects.filter(p => p.category === 'mobile').length },
  { id: '3d', label: '3D & VR', count: mockProjects.filter(p => p.category === '3d').length },
  { id: 'fullstack', label: 'Full Stack', count: mockProjects.filter(p => p.category === 'fullstack').length },
];

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ className }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = activeCategory === 'all' 
    ? mockProjects 
    : mockProjects.filter(project => project.category === activeCategory);

  const featuredProjects = filteredProjects.filter(project => project.featured);
  const regularProjects = filteredProjects.filter(project => !project.featured);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'concept': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-text-secondary bg-white/5 border-white/10';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'concept': return 'Concept';
      default: return 'Unknown';
    }
  };

  return (
    <section className={clsx('relative py-20 px-6', className)}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
            My Projects
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
            A showcase of innovative solutions, creative experiments, and technical achievements 
            that demonstrate my passion for building exceptional digital experiences.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-gold to-accent-silver mx-auto rounded-full" />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
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
              <span className="ml-2 text-sm opacity-70">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-display font-semibold text-text-primary mb-8 text-center">
              Featured Projects
            </h3>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <Card
                  key={project.id}
                  variant="elevated"
                  padding="none"
                  className="overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                  glow
                  shimmer
                >
                  {/* Project Image */}
                  <div className="relative h-64 bg-gradient-to-br from-accent-gold/10 to-accent-silver/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                    <div className="absolute top-4 right-4 z-20">
                      <span className={clsx(
                        'px-3 py-1 rounded-full text-xs font-medium border',
                        getStatusColor(project.status)
                      )}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                    {/* Placeholder for project image */}
                    <div className="w-full h-full bg-gradient-to-br from-accent-gold/20 to-accent-blue/20 flex items-center justify-center">
                      <div className="text-6xl opacity-30">🚀</div>
                    </div>
                  </div>

                  <div className="p-8">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle size="lg" className="mb-2">
                        {project.title}
                      </CardTitle>
                      <p className="text-text-secondary leading-relaxed">
                        {project.description}
                      </p>
                    </CardHeader>

                    <CardContent className="p-0 mb-6">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-text-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="px-2 py-1 text-xs text-accent-gold">
                            +{project.technologies.length - 4} more
                          </span>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-0 flex gap-3">
                      {project.demoUrl && (
                        <Button variant="primary" size="sm" className="flex-1">
                          Live Demo
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button variant="secondary" size="sm" className="flex-1">
                          View Code
                        </Button>
                      )}
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Projects Grid */}
        {regularProjects.length > 0 && (
          <div>
            <h3 className="text-2xl font-display font-semibold text-text-primary mb-8 text-center">
              All Projects
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularProjects.map((project) => (
                <Card
                  key={project.id}
                  variant="interactive"
                  padding="none"
                  className="overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-accent-gold/10 to-accent-silver/10">
                    <div className="absolute top-3 right-3 z-10">
                      <span className={clsx(
                        'px-2 py-1 rounded text-xs font-medium border',
                        getStatusColor(project.status)
                      )}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                    {/* Placeholder for project image */}
                    <div className="w-full h-full bg-gradient-to-br from-accent-blue/20 to-accent-silver/20 flex items-center justify-center">
                      <div className="text-4xl opacity-30">💻</div>
                    </div>
                  </div>

                  <div className="p-6">
                    <CardHeader className="p-0 mb-3">
                      <CardTitle size="md" className="mb-2">
                        {project.title}
                      </CardTitle>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {project.description}
                      </p>
                    </CardHeader>

                    <CardContent className="p-0 mb-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-text-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 text-xs text-accent-gold">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-0 flex gap-2">
                      {project.demoUrl && (
                        <Button variant="primary" size="sm" className="flex-1 text-xs">
                          Demo
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button variant="secondary" size="sm" className="flex-1 text-xs">
                          Code
                        </Button>
                      )}
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <Card
              variant="elevated"
              padding="none"
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  ✕
                </button>

                {/* Project Image */}
                <div className="relative h-80 bg-gradient-to-br from-accent-gold/20 to-accent-blue/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span className={clsx(
                      'px-3 py-1 rounded-full text-sm font-medium border',
                      getStatusColor(selectedProject.status)
                    )}>
                      {getStatusLabel(selectedProject.status)}
                    </span>
                  </div>
                  {/* Placeholder for project image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-8xl opacity-30">🚀</div>
                  </div>
                </div>

                <div className="p-8">
                  <CardHeader className="p-0 mb-6">
                    <CardTitle size="xl" className="mb-4">
                      {selectedProject.title}
                    </CardTitle>
                    <p className="text-lg text-text-secondary leading-relaxed">
                      {selectedProject.longDescription}
                    </p>
                  </CardHeader>

                  <CardContent className="p-0 mb-8">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="p-0 flex gap-4">
                    {selectedProject.demoUrl && (
                      <Button variant="primary" size="lg" className="flex-1">
                        View Live Demo
                      </Button>
                    )}
                    {selectedProject.githubUrl && (
                      <Button variant="secondary" size="lg" className="flex-1">
                        View Source Code
                      </Button>
                    )}
                  </CardFooter>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Background Decorative Elements */}
        <div className="absolute top-40 left-20 w-40 h-40 bg-accent-gold/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-56 h-56 bg-accent-blue/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </section>
  );
};