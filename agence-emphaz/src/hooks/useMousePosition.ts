/**
 * useMousePosition Hook
 * Tracks mouse position with optional smoothing
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}

interface UseMousePositionOptions {
  /** Enable smooth interpolation */
  smooth?: boolean;
  /** Smoothing factor (0-1), lower = smoother */
  smoothFactor?: number;
}

export const useMousePosition = (options: UseMousePositionOptions = {}) => {
  const { smooth = false, smoothFactor = 0.1 } = options;

  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  // Smooth animation loop
  const animate = useCallback(() => {
    if (smooth) {
      // Lerp towards target
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * smoothFactor;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * smoothFactor;

      const normalizedX = (currentRef.current.x / window.innerWidth) * 2 - 1;
      const normalizedY = (currentRef.current.y / window.innerHeight) * 2 - 1;

      setPosition({
        x: currentRef.current.x,
        y: currentRef.current.y,
        normalizedX,
        normalizedY,
      });
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [smooth, smoothFactor]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };

      if (!smooth) {
        const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
        const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;

        setPosition({
          x: e.clientX,
          y: e.clientY,
          normalizedX,
          normalizedY,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    if (smooth) {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [smooth, animate]);

  return position;
};

export default useMousePosition;

