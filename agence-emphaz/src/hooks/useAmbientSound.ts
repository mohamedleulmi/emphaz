/**
 * useAmbientSound Hook
 * Manages ambient sound playback with smooth fade in/out
 * Auto-plays immediately on load (or after first interaction if blocked by browser)
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAmbientSoundOptions {
  src: string;
  volume?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  loop?: boolean;
  autoPlay?: boolean;
}

interface UseAmbientSoundReturn {
  isPlaying: boolean;
  isMuted: boolean;
  isReady: boolean;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
}

export function useAmbientSound({
  src,
  volume = 0.3,
  fadeInDuration = 2000,
  fadeOutDuration = 500,
  loop = true,
  autoPlay = true,
}: UseAmbientSoundOptions): UseAmbientSoundReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const targetVolumeRef = useRef(volume);

  // Fade in function
  const fadeIn = useCallback(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const targetVolume = targetVolumeRef.current;
    const steps = 50;
    const stepDuration = fadeInDuration / steps;
    const volumeStep = targetVolume / steps;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    audio.volume = 0;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);

          let currentStep = 0;
          fadeIntervalRef.current = window.setInterval(() => {
            currentStep++;
            audio.volume = Math.min(volumeStep * currentStep, targetVolume);

            if (currentStep >= steps) {
              if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
              }
            }
          }, stepDuration);
        })
        .catch(() => {
          // Autoplay was blocked, will retry on user interaction
          console.log('Autoplay blocked, waiting for user interaction...');
        });
    }
  }, [fadeInDuration]);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = 0;
    audio.preload = 'auto';

    audio.addEventListener('canplaythrough', () => {
      setIsReady(true);
    });

    audio.addEventListener('ended', () => {
      if (!loop) {
        setIsPlaying(false);
      }
    });

    audioRef.current = audio;

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      audio.pause();
      audio.src = '';
    };
  }, [src, loop]);

  // Try to autoplay when ready
  useEffect(() => {
    if (isReady && autoPlay && !hasStarted) {
      fadeIn();
    }
  }, [isReady, autoPlay, hasStarted, fadeIn]);

  // Fade out function
  const fadeOut = useCallback(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const currentVolume = audio.volume;
    const steps = 25;
    const stepDuration = fadeOutDuration / steps;
    const volumeStep = currentVolume / steps;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    let currentStep = 0;
    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      audio.volume = Math.max(currentVolume - (volumeStep * currentStep), 0);

      if (currentStep >= steps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
        audio.pause();
        setIsPlaying(false);
      }
    }, stepDuration);
  }, [fadeOutDuration]);

  // Play function
  const play = useCallback(() => {
    if (!isReady || !audioRef.current) return;
    fadeIn();
  }, [isReady, fadeIn]);

  // Pause function
  const pause = useCallback(() => {
    if (!audioRef.current) return;
    fadeOut();
  }, [fadeOut]);

  // Toggle function
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
      setIsMuted(true);
    } else {
      play();
      setIsMuted(false);
    }
  }, [isPlaying, play, pause]);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    targetVolumeRef.current = Math.max(0, Math.min(1, newVolume));
    if (audioRef.current && isPlaying) {
      audioRef.current.volume = targetVolumeRef.current;
    }
  }, [isPlaying]);

  // Fallback: Auto-play on first user interaction if autoplay was blocked
  useEffect(() => {
    if (hasStarted || !isReady || !autoPlay) return;

    const handleInteraction = () => {
      if (!hasStarted) {
        fadeIn();
      }
    };

    // Listen for user interaction as fallback
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('scroll', handleInteraction, { once: true });
    window.addEventListener('mousemove', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
    };
  }, [hasStarted, isReady, autoPlay, fadeIn]);

  return {
    isPlaying,
    isMuted,
    isReady,
    toggle,
    play,
    pause,
    setVolume,
  };
}

