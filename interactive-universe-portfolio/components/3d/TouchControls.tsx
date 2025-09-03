/**
 * Touch Controls Component
 * Provides touch-friendly controls for mobile 3D scene interaction
 */

import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, Euler } from 'three';
import { TouchGesture } from '@/hooks/useMobileOptimizations';

interface TouchControlsProps {
  enabled: boolean;
  sensitivity: number;
  gestureThreshold: number;
  onGesture?: (gesture: TouchGesture) => void;
  enableZoom?: boolean;
  enableRotation?: boolean;
  enablePan?: boolean;
  minDistance?: number;
  maxDistance?: number;
  rotationSpeed?: number;
  zoomSpeed?: number;
}

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  timestamp: number;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  enabled = true,
  sensitivity = 1.5,
  gestureThreshold = 10,
  onGesture,
  enableZoom = true,
  enableRotation = true,
  enablePan = false,
  minDistance = 3,
  maxDistance = 15,
  rotationSpeed = 0.5,
  zoomSpeed = 0.1
}) => {
  const { camera, gl } = useThree();
  const [touches, setTouches] = useState<Map<number, TouchPoint>>(new Map());
  const [isGesturing, setIsGesturing] = useState(false);
  const [lastGestureTime, setLastGestureTime] = useState(0);
  
  const spherical = useRef({ radius: 5, phi: Math.PI / 2, theta: 0 });
  const target = useRef(new Vector3(0, 0, 0));
  const dampingFactor = useRef(0.05);
  const velocity = useRef({ x: 0, y: 0, zoom: 0 });
  
  // Initialize camera position
  useEffect(() => {
    if (camera) {
      const position = camera.position;
      spherical.current.radius = position.length();
      spherical.current.phi = Math.acos(Math.max(-1, Math.min(1, position.y / spherical.current.radius)));
      spherical.current.theta = Math.atan2(position.x, position.z);
    }
  }, [camera]);
  
  // Touch event handlers
  const handleTouchStart = (event: TouchEvent) => {
    if (!enabled) return;
    
    event.preventDefault();
    const currentTime = Date.now();
    const newTouches = new Map(touches);
    
    Array.from(event.changedTouches).forEach(touch => {
      newTouches.set(touch.identifier, {
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        startX: touch.clientX,
        startY: touch.clientY,
        timestamp: currentTime
      });
    });
    
    setTouches(newTouches);
    setIsGesturing(true);
    setLastGestureTime(currentTime);
  };
  
  const handleTouchMove = (event: TouchEvent) => {
    if (!enabled || !isGesturing) return;
    
    event.preventDefault();
    const currentTime = Date.now();
    const newTouches = new Map(touches);
    const touchArray = Array.from(event.touches);
    
    // Update touch positions
    Array.from(event.changedTouches).forEach(touch => {
      const existingTouch = newTouches.get(touch.identifier);
      if (existingTouch) {
        newTouches.set(touch.identifier, {
          ...existingTouch,
          x: touch.clientX,
          y: touch.clientY
        });
      }
    });
    
    setTouches(newTouches);
    
    if (touchArray.length === 1) {
      // Single touch - rotation
      handleSingleTouchRotation(touchArray[0], newTouches);
    } else if (touchArray.length === 2) {
      // Two touches - pinch zoom
      handlePinchZoom(touchArray, newTouches);
    }
    
    setLastGestureTime(currentTime);
  };
  
  const handleTouchEnd = (event: TouchEvent) => {
    if (!enabled) return;
    
    event.preventDefault();
    const currentTime = Date.now();
    const newTouches = new Map(touches);
    
    Array.from(event.changedTouches).forEach(touch => {
      const existingTouch = newTouches.get(touch.identifier);
      if (existingTouch) {
        const deltaTime = currentTime - existingTouch.timestamp;
        const deltaX = touch.clientX - existingTouch.startX;
        const deltaY = touch.clientY - existingTouch.startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Detect tap gesture
        if (deltaTime < 300 && distance < gestureThreshold) {
          const gesture: TouchGesture = {
            type: 'tap',
            startPosition: { x: existingTouch.startX, y: existingTouch.startY },
            currentPosition: { x: touch.clientX, y: touch.clientY }
          };
          onGesture?.(gesture);
        }
        
        newTouches.delete(touch.identifier);
      }
    });
    
    setTouches(newTouches);
    
    if (newTouches.size === 0) {
      setIsGesturing(false);
    }
  };
  
  // Single touch rotation handler
  const handleSingleTouchRotation = (touch: Touch, touchMap: Map<number, TouchPoint>) => {
    if (!enableRotation) return;
    
    const touchPoint = touchMap.get(touch.identifier);
    if (!touchPoint) return;
    
    const deltaX = touch.clientX - touchPoint.x;
    const deltaY = touch.clientY - touchPoint.y;
    
    if (Math.abs(deltaX) > gestureThreshold || Math.abs(deltaY) > gestureThreshold) {
      const rotationX = deltaY * sensitivity * rotationSpeed * 0.01;
      const rotationY = deltaX * sensitivity * rotationSpeed * 0.01;
      
      spherical.current.theta -= rotationY;
      spherical.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.current.phi + rotationX));
      
      // Add velocity for smooth damping
      velocity.current.x = rotationX;
      velocity.current.y = rotationY;
      
      const gesture: TouchGesture = {
        type: 'rotate',
        startPosition: { x: touchPoint.startX, y: touchPoint.startY },
        currentPosition: { x: touch.clientX, y: touch.clientY },
        rotation: Math.atan2(deltaY, deltaX),
        velocity: { x: rotationX, y: rotationY }
      };
      onGesture?.(gesture);
    }
  };
  
  // Pinch zoom handler
  const handlePinchZoom = (touches: Touch[], touchMap: Map<number, TouchPoint>) => {
    if (!enableZoom || touches.length !== 2) return;
    
    const touch1 = touchMap.get(touches[0].identifier);
    const touch2 = touchMap.get(touches[1].identifier);
    
    if (!touch1 || !touch2) return;
    
    // Calculate current distance
    const currentDistance = Math.sqrt(
      Math.pow(touches[0].clientX - touches[1].clientX, 2) +
      Math.pow(touches[0].clientY - touches[1].clientY, 2)
    );
    
    // Calculate initial distance
    const initialDistance = Math.sqrt(
      Math.pow(touch1.startX - touch2.startX, 2) +
      Math.pow(touch1.startY - touch2.startY, 2)
    );
    
    if (initialDistance > 0) {
      const scale = currentDistance / initialDistance;
      const zoomDelta = (1 - scale) * zoomSpeed * sensitivity;
      
      spherical.current.radius = Math.max(
        minDistance,
        Math.min(maxDistance, spherical.current.radius + zoomDelta)
      );
      
      velocity.current.zoom = zoomDelta;
      
      const gesture: TouchGesture = {
        type: 'pinch',
        startPosition: { 
          x: (touch1.startX + touch2.startX) / 2, 
          y: (touch1.startY + touch2.startY) / 2 
        },
        currentPosition: { 
          x: (touches[0].clientX + touches[1].clientX) / 2, 
          y: (touches[0].clientY + touches[1].clientY) / 2 
        },
        scale
      };
      onGesture?.(gesture);
    }
  };
  
  // Attach event listeners
  useEffect(() => {
    if (!enabled) return;
    
    const domElement = gl.domElement;
    
    const touchStartHandler = (e: TouchEvent) => handleTouchStart(e);
    const touchMoveHandler = (e: TouchEvent) => handleTouchMove(e);
    const touchEndHandler = (e: TouchEvent) => handleTouchEnd(e);
    
    domElement.addEventListener('touchstart', touchStartHandler, { passive: false });
    domElement.addEventListener('touchmove', touchMoveHandler, { passive: false });
    domElement.addEventListener('touchend', touchEndHandler, { passive: false });
    domElement.addEventListener('touchcancel', touchEndHandler, { passive: false });
    
    return () => {
      domElement.removeEventListener('touchstart', touchStartHandler);
      domElement.removeEventListener('touchmove', touchMoveHandler);
      domElement.removeEventListener('touchend', touchEndHandler);
      domElement.removeEventListener('touchcancel', touchEndHandler);
    };
  }, [enabled, touches, isGesturing, gestureThreshold, sensitivity]);
  
  // Update camera position with damping
  useFrame(() => {
    if (!camera) return;
    
    // Apply damping to velocity
    velocity.current.x *= (1 - dampingFactor.current);
    velocity.current.y *= (1 - dampingFactor.current);
    velocity.current.zoom *= (1 - dampingFactor.current);
    
    // Continue rotation with momentum when not actively gesturing
    if (!isGesturing && (Math.abs(velocity.current.x) > 0.001 || Math.abs(velocity.current.y) > 0.001)) {
      spherical.current.theta -= velocity.current.y * 0.1;
      spherical.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.current.phi + velocity.current.x * 0.1));
    }
    
    // Convert spherical coordinates to Cartesian
    const x = spherical.current.radius * Math.sin(spherical.current.phi) * Math.sin(spherical.current.theta);
    const y = spherical.current.radius * Math.cos(spherical.current.phi);
    const z = spherical.current.radius * Math.sin(spherical.current.phi) * Math.cos(spherical.current.theta);
    
    camera.position.set(x, y, z);
    camera.lookAt(target.current);
  });
  
  return null; // This component doesn't render anything visible
};

export default TouchControls;