/**
 * Hero Section
 * Fullscreen cinematic hero with video background, 3D object, and animated typography
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ThreeScene } from '../ThreeScene';
import { useMousePosition } from '../hooks';
import '../styles/Hero.css';

// Placeholder video URL (cinematic dark footage)
const VIDEO_URL = 'https://cdn.coverr.co/videos/coverr-cinematographer-filming-1584/1080p.mp4';

const Hero = () => {
  // Refs for GSAP animations
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mouse position for 3D object interaction
  const { normalizedX, normalizedY } = useMousePosition();

  // GSAP intro animation
  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' }
    });

    // Animate title lines
    tl.to(titleLine1Ref.current, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      delay: 0.5,
    })
    .to(titleLine2Ref.current, {
      y: 0,
      opacity: 1,
      duration: 1.2,
    }, '-=0.8')

    // Animate subtitle
    .to(subtitleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
    }, '-=0.6')

    // Animate tagline
    .to(taglineRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
    }, '-=0.4')

    // Animate CTA button
    .to(ctaRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
    }, '-=0.4')

    // Animate scroll indicator
    .to(scrollRef.current, {
      opacity: 1,
      duration: 1,
    }, '-=0.2');

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="hero" id="hero">
      {/* Video Background */}
      <div className="hero__video-container">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster="/placeholder-poster.jpg"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      </div>

      {/* Dark Gradient Overlay */}
      <div className="hero__overlay" aria-hidden="true" />

      {/* 3D Canvas */}
      <div className="hero__canvas" aria-hidden="true">
        <ThreeScene mouseX={normalizedX} mouseY={normalizedY} />
      </div>

      {/* Hero Content */}
      <div className="hero__content">
        {/* Subtitle */}
        <p className="hero__subtitle" ref={subtitleRef}>
          We Create Cinema
        </p>

        {/* Main Title */}
        <h1 className="hero__title">
          <span className="hero__title-line" ref={titleLine1Ref}>
            Emphaz
          </span>
          <span className="hero__title-line" ref={titleLine2Ref}>
            <span className="accent">Studio</span>
          </span>
        </h1>

        {/* Tagline */}
        <p className="hero__tagline" ref={taglineRef}>
          Crafting immersive visual experiences that captivate audiences
          and elevate brands to cinematic excellence.
        </p>

        {/* CTA Button */}
        <a
          href="#work"
          className="hero__cta"
          ref={ctaRef}
          data-cursor-hover
        >
          Découvrir nos projets
          <span aria-hidden="true">→</span>
        </a>
      </div>

      {/* Scroll Indicator */}
      <div className="hero__scroll" ref={scrollRef}>
        <span className="hero__scroll-text">Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
};

export default Hero;

