/**
 * useLenis Hook
 * Initializes Lenis smooth scroll with GSAP ScrollTrigger integration
 */

import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface UseLenisOptions {
  /** Scroll smoothness (0-1), default 0.1 */
  lerp?: number;
  /** Scroll duration in seconds */
  duration?: number;
  /** Scroll direction */
  orientation?: 'vertical' | 'horizontal';
  /** Enable/disable smooth scroll */
  smoothWheel?: boolean;
}

export const useLenis = (options: UseLenisOptions = {}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with options
    const lenis = new Lenis({
      lerp: options.lerp ?? 0.1,
      duration: options.duration ?? 1.2,
      orientation: options.orientation ?? 'vertical',
      smoothWheel: options.smoothWheel ?? true,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis to GSAP ticker for smooth animation
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP's default lag smoothing for better sync
    gsap.ticker.lagSmoothing(0);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [options.lerp, options.duration, options.orientation, options.smoothWheel]);

  return lenisRef;
};

export default useLenis;

