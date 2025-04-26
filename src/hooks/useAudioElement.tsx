
import { useEffect, useRef } from 'react';

export const useAudioElement = (volume: number) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element on first render
  useEffect(() => {
    // Destroy any existing audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load();
      audioRef.current = null;
    }
    
    // Create fresh audio element
    const audio = new Audio();
    audio.volume = volume;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audio.autoplay = false;
    
    // Store reference
    audioRef.current = audio;
    
    // Debug listener
    audio.addEventListener('loadedmetadata', () => {
      console.log('Audio metadata loaded:', audio.src);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        try {
          audioRef.current.load();
        } catch (e) {
          console.error("Error during audio cleanup:", e);
        }
        audioRef.current = null;
      }
    };
  }, []);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return audioRef;
};
