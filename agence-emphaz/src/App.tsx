/**
 * App Component
 * Main application entry with smooth scroll, custom cursor, and Hero section
 */

import { useState } from 'react';
import { useLenis, useAmbientSound } from './hooks';
import { Cursor, SoundToggle, EnterScreen } from './components';
import { Hero, Stats } from './sections';
import './styles/globals.css';

function App() {
  // Track if user has entered the experience
  const [hasEntered, setHasEntered] = useState(false);

  // Initialize Lenis smooth scroll
  useLenis({
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
  });

  // Initialize ambient sound - autoPlay disabled, we control it manually
  const { isPlaying, toggle, play } = useAmbientSound({
    src: '/sounds/ambient.wav',
    volume: 0.25,
    fadeInDuration: 3000,
    loop: true,
    autoPlay: false, // We'll trigger it on enter
  });

  // Handle entering the experience
  const handleEnter = () => {
    setHasEntered(true);
    play(); // Start the sound immediately after user interaction
  };

  return (
    <>
      {/* Cinematic Enter Screen */}
      {!hasEntered && <EnterScreen onEnter={handleEnter} />}

      {/* Custom Cursor */}
      <Cursor />

      {/* Sound Toggle Button - only show after entering */}
      {hasEntered && <SoundToggle isPlaying={isPlaying} onToggle={toggle} />}

      {/* Main Content */}
      <main>
        <Hero />
        <Stats />

        {/* Placeholder section for scroll testing */}
        <section style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg-secondary)'
        }}>
          <h2 style={{ color: 'var(--color-text-muted)' }}>
            More content coming soon...
          </h2>
        </section>
      </main>
    </>
  );
}

export default App;
