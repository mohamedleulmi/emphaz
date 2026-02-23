/**
 * EnterScreen Component
 * Cinematic entry screen that requires user interaction to start the experience
 * This allows audio to play immediately after interaction
 */

import { useRef, useEffect } from 'react';
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

  useEffect(() => {
    const tl = gsap.timeline();

    // Intro animation
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
      .fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
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
    });
  }, []);

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

      {/* Content */}
      <div className="enter-screen__content">
        {/* Logo */}
        <div ref={logoRef} className="enter-screen__logo">
          <span className="enter-screen__logo-text">EMPHAZ</span>
          <span className="enter-screen__logo-accent" />
        </div>

        {/* Tagline */}
        <div ref={textRef} className="enter-screen__text">
          <p>CREATIVE CINEMA AGENCY</p>
        </div>

        {/* Enter Button */}
        <button
          ref={buttonRef}
          className="enter-screen__button"
          onClick={handleEnter}
        >
          <span className="enter-screen__button-icon">▶</span>
          <span className="enter-screen__button-text">ENTER EXPERIENCE</span>
        </button>
      </div>

      {/* Sound notice */}
      <p className="enter-screen__sound-notice">
        🎧 For the best experience, enable sound
      </p>
    </div>
  );
}

