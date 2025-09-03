'use client';

import React, { useState } from 'react';
import { EmailForm } from '@/components/ui/EmailForm';

export default function TestEmailFormPage() {
  const [submissions, setSubmissions] = useState<Array<{ email: string; name: string; timestamp: Date }>>([]);
  const [simulateError, setSimulateError] = useState(false);
  const [simulateLoading, setSimulateLoading] = useState(false);

  const handleEmailSubmit = async (email: string, name: string) => {
    console.log('Email submitted:', { email, name });
    
    // Simulate loading delay
    if (simulateLoading) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Simulate error
    if (simulateError) {
      throw new Error('Simulated submission error - please try again');
    }
    
    // Add to submissions list
    setSubmissions(prev => [...prev, { email, name, timestamp: new Date() }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Email Form Test</h1>
          <p className="text-gray-400">Testing the comprehensive email capture system</p>
        </div>

        {/* Test Controls */}
        <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Test Controls</h2>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={simulateError}
                onChange={(e) => setSimulateError(e.target.checked)}
                className="rounded"
              />
              <span className="text-white">Simulate Error</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={simulateLoading}
                onChange={(e) => setSimulateLoading(e.target.checked)}
                className="rounded"
              />
              <span className="text-white">Simulate Loading (2s)</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Form */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Email Form</h2>
            <EmailForm
              onSubmit={handleEmailSubmit}
              title="Join the Universe"
              subtitle="Enter your details to claim your star"
            />
          </div>

          {/* Submissions List */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Submissions ({submissions.length})
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {submissions.length === 0 ? (
                <div className="p-6 bg-white/5 rounded-lg border border-white/10 text-center">
                  <p className="text-gray-400">No submissions yet</p>
                </div>
              ) : (
                submissions.map((submission, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{submission.name}</h3>
                      <span className="text-xs text-gray-400">
                        {submission.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{submission.email}</p>
                  </div>
                ))
              )}
            </div>
            
            {submissions.length > 0 && (
              <button
                onClick={() => setSubmissions([])}
                className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                Clear Submissions
              </button>
            )}
          </div>
        </div>

        {/* Form Validation Tests */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Validation Test Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="font-semibold text-white mb-2">Valid Inputs</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Name: &quot;John Doe&quot;</li>
                <li>• Email: &quot;john@example.com&quot;</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="font-semibold text-white mb-2">Invalid Names</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Empty name</li>
                <li>• Single character: &quot;A&quot;</li>
                <li>• Numbers: &quot;John123&quot;</li>
                <li>• Special chars: &quot;John@Doe&quot;</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="font-semibold text-white mb-2">Invalid Emails</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Empty email</li>
                <li>• No @: &quot;johndoe.com&quot;</li>
                <li>• No domain: &quot;john@&quot;</li>
                <li>• Invalid format: &quot;john@.com&quot;</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}