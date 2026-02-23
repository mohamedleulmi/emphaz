/**
 * Cursor Component
 * Modern minimal cursor with smooth interpolation and hover effects
 */

import { useEffect, useRef, useState } from 'react';
import '../styles/Cursor.css';

const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Mouse position refs for smooth animation
  const mousePos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Add custom cursor class to body
    document.body.classList.add('has-custom-cursor');

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Mouse enter/leave viewport
    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    // Mouse down/up for click effect
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Hover detection using event delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.hasAttribute('data-cursor-hover');

      setIsHovering(!!isInteractive);
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    // Animation loop with smooth interpolation
    let rafId: number;
    const animate = () => {
      // Dot follows mouse quickly (lerp 0.2)
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.2;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.2;

      // Ring follows with more delay (lerp 0.1)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.08;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.08;

      // Apply transforms using translate3d for GPU acceleration
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${ringPos.current.x - 60}px, ${ringPos.current.y - 60}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Build cursor classes
  const cursorClasses = [
    'cursor',
    isHovering && 'cursor--hover',
    isHidden && 'cursor--hidden',
    isClicking && 'cursor--clicking',
  ].filter(Boolean).join(' ');

  return (
    <>
      <div ref={dotRef} className={cursorClasses}>
        <div className="cursor__dot" />
      </div>
      <div ref={ringRef} className="cursor__ring" />
    </>
  );
};

export default Cursor;
