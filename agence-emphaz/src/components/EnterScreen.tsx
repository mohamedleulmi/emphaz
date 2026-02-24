/**
 * EnterScreen Component
 * Cinematic entry screen with loading animation
 * Shows a "Z" that fills up as the site loads, then becomes part of "EMPHAZ"
 */

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './EnterScreen.css';

interface EnterScreenProps {
  onEnter: () => void;
}

export function EnterScreen({ onEnter }: EnterScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const loaderZRef = useRef<HTMLDivElement>(null);
  const loaderContainerRef = useRef<HTMLDivElement>(null);
  const logoZRef = useRef<HTMLSpanElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Simulate loading progress and check for actual load
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let fakeProgress = 0;

    // Simulate progress for visual feedback
    progressInterval = setInterval(() => {
      fakeProgress += Math.random() * 15;
      if (fakeProgress >= 100) {
        fakeProgress = 100;
        clearInterval(progressInterval);
      }
      setLoadProgress(Math.min(fakeProgress, 100));
    }, 200);

    // Check when document is fully loaded
    const checkLoaded = () => {
      if (document.readyState === 'complete') {
        // Ensure minimum loading time for animation
        setTimeout(() => {
          setLoadProgress(100);
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }, 1000);
      }
    };

    if (document.readyState === 'complete') {
      checkLoaded();
    } else {
      window.addEventListener('load', checkLoaded);
    }

    return () => {
      clearInterval(progressInterval);
      window.removeEventListener('load', checkLoaded);
    };
  }, []);

  // Animation when loading is complete - Z moves to its position in EMPHAZ
  useEffect(() => {
    if (!isLoading && loaderZRef.current && logoZRef.current && logoRef.current) {
      const loaderZ = loaderZRef.current;
      const logoZ = logoZRef.current;

      // Make logo visible but transparent to get correct positions
      gsap.set(logoRef.current, { opacity: 1 });
      gsap.set(logoZ, { opacity: 0 });

      // Get positions after a frame to ensure layout is computed
      requestAnimationFrame(() => {
        const loaderRect = loaderZ.getBoundingClientRect();
        const logoZRect = logoZ.getBoundingClientRect();

        // Calculate the distance to move (simple translation, same size)
        const deltaX = logoZRect.left - loaderRect.left;
        const deltaY = logoZRect.top - loaderRect.top;

        const tl = gsap.timeline();

        // Animate the loader Z to its final position - smooth slide
        tl.to(loaderZ, {
          x: deltaX,
          y: deltaY,
          duration: 0.8,
          ease: 'power2.inOut',
        })
          .to(
            loaderZ,
            {
              opacity: 0,
              duration: 0.15,
            },
            '-=0.15'
          )
          .set(logoZ, { opacity: 1, color: 'var(--color-accent)' })
          .call(() => setShowLoader(false))
          .fromTo(
            textRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.1'
          )
          .fromTo(
            buttonRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.3'
          );

        // Pulsing animation on button
        gsap.to(buttonRef.current, {
          boxShadow: '0 0 30px rgba(245, 197, 24, 0.4)',
          repeat: -1,
          yoyo: true,
          duration: 1.5,
          ease: 'power1.inOut',
          delay: 1.5,
        });
      });
    }
  }, [isLoading]);

  const handleEnter = () => {
    const tl = gsap.timeline({
      onComplete: onEnter,
    });

    // Exit animation
    tl.to([buttonRef.current, textRef.current], {
      opacity: 0,
      y: -20,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.in',
    })
      .to(
        logoRef.current,
        {
          opacity: 0,
          scale: 1.1,
          duration: 0.5,
          ease: 'power2.in',
        },
        '-=0.2'
      )
      .to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        },
        '-=0.2'
      );
  };

  return (
    <div ref={containerRef} className="enter-screen">
      {/* Background gradient overlay */}
      <div className="enter-screen__overlay" />

      {/* Loading Screen with Z */}
      {showLoader && (
        <div ref={loaderContainerRef} className="enter-screen__loader">
          <div ref={loaderZRef} className="enter-screen__loader-z">
            {/* Background Z (outline) */}
            <span className="enter-screen__loader-z-outline">Z</span>
            {/* Filling Z */}
            <span
              className="enter-screen__loader-z-fill"
              style={{ clipPath: `inset(${100 - loadProgress}% 0 0 0)` }}
            >
              Z
            </span>
          </div>
          {isLoading && (
            <div className="enter-screen__loader-progress">
              <span>{Math.round(loadProgress)}%</span>
            </div>
          )}
        </div>
      )}

      {/* Content - hidden during loading */}
      <div className={`enter-screen__content ${showLoader ? 'enter-screen__content--hidden' : ''}`}>
        {/* Logo */}
        <div ref={logoRef} className="enter-screen__logo" style={{ opacity: 0 }}>
          <span className="enter-screen__logo-text">
            EMPHA<span ref={logoZRef} className="enter-screen__logo-z" style={{ opacity: 0 }}>Z</span>
          </span>
          <span className="enter-screen__logo-accent" />
        </div>

        {/* Tagline */}
        <div ref={textRef} className="enter-screen__text" style={{ opacity: 0 }}>
          <p>CREATIVE CINEMA AGENCY</p>
        </div>

        {/* Enter Button */}
        <button
          ref={buttonRef}
          className="enter-screen__button"
          onClick={handleEnter}
          style={{ opacity: 0 }}
        >
          <span className="enter-screen__button-icon">▶</span>
          <span className="enter-screen__button-text">ENTER EXPERIENCE</span>
        </button>
      </div>

      {/* Sound notice */}
      <p className={`enter-screen__sound-notice ${showLoader ? 'enter-screen__sound-notice--hidden' : ''}`}>
        🎧 For the best experience, enable sound
      </p>
    </div>
  );
}

