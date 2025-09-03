'use client';

import React from 'react';
import { UniverseLayout } from '@/components/layout/UniverseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function TestNavigationEffectsPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Test the integrated layout */}
      <UniverseLayout />
      
      {/* Debug overlay */}
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <Card variant="elevated" padding="md">
          <CardHeader>
            <CardTitle size="sm">Navigation Effects Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-text-secondary space-y-2">
              <p>✅ Universe Layout Integration</p>
              <p>✅ Navigation Effects Hook</p>
              <p>✅ Star Engagement Effects</p>
              <p>✅ Universe Animation Effects</p>
              <p>✅ Responsive Design</p>
              <p className="text-accent-gold">
                Scroll through sections to see effects!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}