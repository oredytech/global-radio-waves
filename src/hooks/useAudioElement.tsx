
import { useEffect, useRef } from 'react';
import { toast } from "sonner";

export const useAudioElement = (volume: number) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element on component mount
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.preload = "auto";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  return audioRef;
};
