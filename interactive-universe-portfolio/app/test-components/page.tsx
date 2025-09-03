'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';

export default function TestComponentsPage() {
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Input states
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [errorInput, setErrorInput] = useState('');
  const [inputError, setInputError] = useState('');

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  const handleAsyncClick = async () => {
    setIsLoading(true);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setClickCount(prev => prev + 1);
  };

  // Input handlers
  const handleErrorInputChange = (value: string) => {
    setErrorInput(value);
    if (value.length > 0 && value.length < 3) {
      setInputError('Input must be at least 3 characters long');
    } else {
      setInputError('');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-display font-bold text-text-primary">
            Premium UI Components Test
          </h1>
          <p className="text-text-secondary text-lg">
            Testing all button variants and states
          </p>
          <div className="text-accent-gold font-medium">
            Button clicks: {clickCount}
          </div>
        </div>

        {/* Button Variants Section */}
        <section className="space-y-8">
          <h2 className="text-2xl font-display font-semibold text-text-primary border-b border-accent-gold/20 pb-2">
            Button Variants
          </h2>
          
          {/* Primary Buttons */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-text-primary">Primary Buttons</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary" size="sm" onClick={handleClick}>
                Small Primary
              </Button>
              <Button variant="primary" size="md" onClick={handleClick}>
                Medium Primary
              </Button>
              <Button variant="primary" size="lg" onClick={handleClick}>
                Large Primary
              </Button>
              <Button variant="primary" size="md" disabled>
                Disabled Primary
              </Button>
            </div>
          </div>

          {/* Secondary Buttons */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-text-primary">Secondary Buttons</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="secondary" size="sm" onClick={handleClick}>
                Small Secondary
              </Button>
              <Button variant="secondary" size="md" onClick={handleClick}>
                Medium Secondary
              </Button>
              <Button variant="secondary" size="lg" onClick={handleClick}>
                Large Secondary
              </Button>
              <Button variant="secondary" size="md" disabled>
                Disabled Secondary
              </Button>
            </div>
          </div>

          {/* Ghost Buttons */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-text-primary">Ghost Buttons</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="ghost" size="sm" onClick={handleClick}>
                Small Ghost
              </Button>
              <Button variant="ghost" size="md" onClick={handleClick}>
                Medium Ghost
              </Button>
              <Button variant="ghost" size="lg" onClick={handleClick}>
                Large Ghost
              </Button>
              <Button variant="ghost" size="md" disabled>
                Disabled Ghost
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Examples */}
        <section className="space-y-8">
          <h2 className="text-2xl font-display font-semibold text-text-primary border-b border-accent-gold/20 pb-2">
            Interactive Examples
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-medium text-text-primary">Action Card</h3>
              <p className="text-text-secondary text-sm">
                Click the button to increment the counter
              </p>
              <Button variant="primary" size="md" onClick={handleClick} className="w-full">
                Click Me
              </Button>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-medium text-text-primary">Async Action</h3>
              <p className="text-text-secondary text-sm">
                Simulates an async operation with loading state
              </p>
              <Button 
                variant="secondary" 
                size="md" 
                onClick={handleAsyncClick}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Loading...' : 'Async Action'}
              </Button>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-medium text-text-primary">Navigation</h3>
              <p className="text-text-secondary text-sm">
                Ghost button for subtle navigation
              </p>
              <Button variant="ghost" size="md" onClick={handleClick} className="w-full">
                Navigate →
              </Button>
            </div>
          </div>
        </section>

        {/* Custom Styling Examples */}
        <section className="space-y-8">
          <h2 className="text-2xl font-display font-semibold text-text-primary border-b border-accent-gold/20 pb-2">
            Custom Styling Examples
          </h2>
          
          <div className="flex flex-wrap gap-4 items-center">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleClick}
              className="rounded-full px-12"
            >
              Rounded Primary
            </Button>
            <Button 
              variant="secondary" 
              size="md" 
              onClick={handleClick}
              className="rounded-none border-2"
            >
              Sharp Secondary
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClick}
              className="uppercase tracking-wider"
            >
              Uppercase Ghost
            </Button>
          </div>
        </section>

        {/* Input Components Section */}
        <section className="space-y-8">
          <h2 className="text-2xl font-display font-semibold text-text-primary border-b border-accent-gold/20 pb-2">
            Input Components
          </h2>
          
          {/* Basic Inputs */}
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-text-primary">Basic Input Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Input
                  type="text"
                  label="Text Input"
                  placeholder="Enter some text..."
                  value={textValue}
                  onChange={setTextValue}
                />
              </div>
              <div>
                <Input
                  type="email"
                  label="Email Input"
                  placeholder="Enter your email..."
                  value={emailValue}
                  onChange={setEmailValue}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  label="Password Input"
                  placeholder="Enter your password..."
                  value={passwordValue}
                  onChange={setPasswordValue}
                />
              </div>
            </div>
          </div>

          {/* Input States */}
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-text-primary">Input States</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  type="text"
                  label="Error State"
                  placeholder="Type less than 3 characters..."
                  value={errorInput}
                  onChange={handleErrorInputChange}
                  error={inputError}
                />
              </div>
              <div>
                <Input
                  type="text"
                  label="Disabled Input"
                  placeholder="This input is disabled"
                  value="Disabled value"
                  onChange={() => {}}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Input Sizes and Variations */}
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-text-primary">Input Variations</h3>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Input without label"
                value=""
                onChange={() => {}}
              />
              <Input
                type="text"
                label="Required Input"
                placeholder="This field is required"
                value=""
                onChange={() => {}}
                required
              />
            </div>
          </div>
        </section>

        {/* Card Components Section */}
        <section className="space-y-8">
          <h2 className="text-2xl font-display font-semibold text-text-primary border-b border-accent-gold/20 pb-2">
            Card Components
          </h2>
          
          {/* Basic Card Variants */}
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-text-primary">Card Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="default">
                <CardHeader>
                  <CardTitle size="md">Default Card</CardTitle>
                </CardHeader>
                <CardContent>
                  This is a default card with basic glass morphism styling. It has subtle transparency and backdrop blur effects.
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" onClick={handleClick}>
                    Learn More
                  </Button>
                </CardFooter>
              </Card>

              <Card variant="elevated" glow>
                <CardHeader>
                  <CardTitle size="md">Elevated Card</CardTitle>
                </CardHeader>
                <CardContent>
                  This elevated card has enhanced shadows, hover effects, and floating particle animations for a premium feel.
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" size="sm" onClick={handleClick}>
                    Explore
                  </Button>
                </CardFooter>
              </Card>

              <Card variant="interactive" shimmer onClick={handleClick}>
                <CardHeader>
                  <CardTitle size="md">Interactive Card</CardTitle>
                </CardHeader>
                <CardContent>
                  This interactive card responds to clicks and hovers with shimmer effects and smooth animations.
                </CardContent>
                <CardFooter>
                  <span className="text-accent-gold text-sm font-medium">Click me!</span>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Card Sizes and Padding */}
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-text-primary">Card Sizes & Padding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card variant="default" padding="sm">
                <CardTitle size="sm">Small Padding</CardTitle>
                <CardContent className="mt-2">Compact card with minimal spacing.</CardContent>
              </Card>
              
              <Card variant="default" padding="md">
                <CardTitle size="sm">Medium Padding</CardTitle>
                <CardContent className="mt-2">Standard card with balanced spacing.</CardContent>
              </Card>
              
              <Card variant="default" padding="lg">
                <CardTitle size="sm">Large Padding</CardTitle>
                <CardContent className="mt-2">Spacious card with generous padding.</CardContent>
              </Card>
              
              <Card variant="default" padding="xl">
                <CardTitle size="sm">XL Padding</CardTitle>
                <CardContent className="mt-2">Maximum padding for emphasis.</CardContent>
              </Card>
            </div>
          </div>

          {/* Card Features */}
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-text-primary">Card Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="elevated" glow shimmer rounded="2xl">
                <CardHeader>
                  <CardTitle size="lg">Premium Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent-gold rounded-full"></span>
                      Glow border effects
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent-silver rounded-full"></span>
                      Shimmer animations
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent-blue rounded-full"></span>
                      Floating particles
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent-gold rounded-full"></span>
                      Custom rounded corners
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="primary" size="md" onClick={handleClick} className="w-full">
                    Experience Premium
                  </Button>
                </CardFooter>
              </Card>

              <Card variant="interactive" onClick={handleClick} className="hover:border-accent-gold/50">
                <CardHeader>
                  <CardTitle size="lg">Interactive Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Total Clicks</span>
                      <span className="text-accent-gold font-bold text-xl">{clickCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Loading State</span>
                      <span className={clsx(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        isLoading ? "bg-accent-blue/20 text-accent-blue" : "bg-green-500/20 text-green-400"
                      )}>
                        {isLoading ? 'Active' : 'Ready'}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-text-muted">Click this card to increment the counter</p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Form Integration Example */}
        <section className="space-y-8">
          <h2 className="text-2xl font-display font-semibold text-text-primary border-b border-accent-gold/20 pb-2">
            Form Integration
          </h2>
          
          <Card variant="elevated" padding="lg" className="max-w-md mx-auto" glow>
            <CardHeader>
              <CardTitle size="xl">Create Account</CardTitle>
              <p className="text-text-secondary mt-2">Join our premium universe experience</p>
            </CardHeader>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleClick(); }}>
              <Input
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                value={textValue}
                onChange={setTextValue}
                required
              />
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={emailValue}
                onChange={setEmailValue}
                required
              />
              <Input
                type="password"
                label="Password"
                placeholder="Create a password"
                value={passwordValue}
                onChange={setPasswordValue}
                required
              />
              <CardFooter className="mt-6 pt-6">
                <div className="flex gap-3 w-full">
                  <Button type="submit" variant="primary" size="md" className="flex-1">
                    Create Account
                  </Button>
                  <Button type="button" variant="secondary" size="md" onClick={handleClick}>
                    Cancel
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </section>
      </div>
    </div>
  );
}