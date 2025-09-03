'use client';

import React from 'react';
import { useUserSession } from '@/hooks/useUserSession';
import { useMockData } from '@/hooks/useMockData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TestSessionPage() {
  const { 
    session, 
    isLoading: sessionLoading, 
    isReturningVisitor, 
    createSession, 
    updateSession, 
    addEmailToSession, 
    clearSession 
  } = useUserSession();
  
  const { 
    currentUserStar, 
    isLoading: dataLoading, 
    isReturningVisitor: dataReturningVisitor,
    sessionId 
  } = useMockData();

  const handleCreateNewSession = () => {
    const newStarId = `star_${Date.now()}`;
    createSession(newStarId, `ip_${Math.random().toString(36).substr(2, 16)}`);
  };

  const handleAddEmail = () => {
    addEmailToSession('test@example.com', 'Test User');
  };

  const handleUpdateSession = () => {
    updateSession({
      visitCount: (session?.visitCount || 0) + 1,
    });
  };

  if (sessionLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex items-center justify-center">
        <div className="text-white text-xl">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Session Management Test</h1>
          <p className="text-gray-400">Testing user session persistence and management</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Information */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Session Information</h2>
            
            {session ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Session ID:</span>
                    <p className="text-white font-mono text-xs break-all">{session.sessionId}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Star ID:</span>
                    <p className="text-white font-mono text-xs break-all">{session.starId}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">IP Hash:</span>
                    <p className="text-white font-mono text-xs break-all">{session.ipHash}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Visit Count:</span>
                    <p className="text-white">{session.visitCount}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Has Email:</span>
                    <p className="text-white">{session.hasEmail ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Returning Visitor:</span>
                    <p className="text-white">{isReturningVisitor ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                
                {session.name && (
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <p className="text-white">{session.name}</p>
                  </div>
                )}
                
                {session.email && (
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="text-white">{session.email}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <p className="text-white text-xs">{session.createdAt.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Seen:</span>
                    <p className="text-white text-xs">{session.lastSeen.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No active session</p>
                <Button onClick={handleCreateNewSession} variant="primary" size="md">
                  Create New Session
                </Button>
              </div>
            )}
          </Card>

          {/* Mock Data Integration */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Mock Data Integration</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Current Star ID:</span>
                  <p className="text-white font-mono text-xs break-all">{currentUserStar.id}</p>
                </div>
                <div>
                  <span className="text-gray-400">Star Status:</span>
                  <p className="text-white capitalize">{currentUserStar.status}</p>
                </div>
                <div>
                  <span className="text-gray-400">Has Email (Star):</span>
                  <p className="text-white">{currentUserStar.hasEmail ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Returning (Data):</span>
                  <p className="text-white">{dataReturningVisitor ? 'Yes' : 'No'}</p>
                </div>
              </div>
              
              {currentUserStar.name && (
                <div>
                  <span className="text-gray-400">Star Name:</span>
                  <p className="text-white">{currentUserStar.name}</p>
                </div>
              )}
              
              <div>
                <span className="text-gray-400">Session ID (Data):</span>
                <p className="text-white font-mono text-xs break-all">{sessionId || 'None'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Session Actions */}
        <Card variant="elevated" className="p-6 mt-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Session Actions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={handleCreateNewSession} 
              variant="primary"
              size="md"
              disabled={!session}
            >
              New Session
            </Button>
            
            <Button 
              onClick={handleAddEmail} 
              variant="secondary"
              size="md"
              disabled={!session || session.hasEmail}
            >
              Add Email
            </Button>
            
            <Button 
              onClick={handleUpdateSession} 
              variant="secondary"
              size="md"
              disabled={!session}
            >
              Update Session
            </Button>
            
            <Button 
              onClick={clearSession} 
              variant="ghost"
              size="md"
              disabled={!session}
            >
              Clear Session
            </Button>
          </div>
        </Card>

        {/* Session Persistence Test */}
        <Card variant="elevated" className="p-6 mt-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Persistence Test</h2>
          
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              To test session persistence:
            </p>
            <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
              <li>Create a session or add email to existing session</li>
              <li>Refresh the page (F5 or Ctrl+R)</li>
              <li>Check if session data is restored</li>
              <li>Visit count should increment on each page load</li>
              <li>Session should persist for 30 days</li>
            </ol>
            
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="text-blue-400 font-semibold mb-2">Session Status</h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${session ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-white">
                    {session ? 'Session Active' : 'No Session'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isReturningVisitor ? 'bg-blue-500' : 'bg-gray-500'}`} />
                  <span className="text-white">
                    {isReturningVisitor ? 'Returning Visitor' : 'New Visitor'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}