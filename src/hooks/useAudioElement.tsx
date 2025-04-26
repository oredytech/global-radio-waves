
import { useEffect, useRef } from 'react';
import { toast } from "sonner";

export const useAudioElement = (volume: number) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element on component mount
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.preload = "auto";
    audioRef.current.crossOrigin = "anonymous"; // Help with CORS issues
    
    // Add metadata loading handler
    audioRef.current.addEventListener('loadedmetadata', () => {
      console.log('Audio metadata loaded');
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load();
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
