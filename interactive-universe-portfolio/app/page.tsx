'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page on first visit
    router.push('/landing');
  }, [router]);

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-gold mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading Universe...</p>
      </div>
    </div>
  );
}
