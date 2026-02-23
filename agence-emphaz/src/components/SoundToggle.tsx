/**
 * SoundToggle Component
 * Elegant animated button to control ambient sound
 * Features smooth animations and visual feedback
 */

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './SoundToggle.css';

interface SoundToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function SoundToggle({ isPlaying, onToggle }: SoundToggleProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animate sound bars when playing
  useEffect(() => {
    const bars = barsRef.current.filter(Boolean);

    if (isPlaying) {
      // Animate each bar with different timing
      bars.forEach((bar, index) => {
        if (!bar) return;

        gsap.to(bar, {
          scaleY: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });

        // Create continuous animation
        gsap.to(bar, {
          scaleY: () => 0.3 + Math.random() * 0.7,
          duration: 0.3 + Math.random() * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: index * 0.1,
        });
      });
    } else {
      // Stop animations and shrink bars
      bars.forEach((bar) => {
        if (!bar) return;
        gsap.killTweensOf(bar);
        gsap.to(bar, {
          scaleY: 0.2,
          opacity: 0.5,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
    }

    return () => {
      bars.forEach((bar) => {
        if (bar) gsap.killTweensOf(bar);
      });
    };
  }, [isPlaying]);

  return (
    <button
      ref={containerRef}
      className={`sound-toggle ${isPlaying ? 'sound-toggle--playing' : ''}`}
      onClick={onToggle}
      aria-label={isPlaying ? 'Mute sound' : 'Play sound'}
    >
      <div className="sound-toggle__bars">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (barsRef.current[i] = el)}
            className="sound-toggle__bar"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <span className="sound-toggle__label">
        {isPlaying ? 'SOUND ON' : 'SOUND OFF'}
      </span>
    </button>
  );
}

