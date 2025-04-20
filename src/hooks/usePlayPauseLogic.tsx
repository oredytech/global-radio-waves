
import { useState } from 'react';
import { RadioStation } from '@/services/radioService';
import { toast } from "sonner";

interface UsePlayPauseLogicProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  setIsLoading: (loading: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const usePlayPauseLogic = ({ audioRef, setIsLoading, setIsPlaying }: UsePlayPauseLogicProps) => {
  const loadStation = (station: RadioStation) => {
    if (!audioRef.current) return;
    
    setIsLoading(true);
    audioRef.current.pause();
    audioRef.current.src = "";
    
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = station.url;
        audioRef.current.load();
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error playing audio:", error);
              setIsLoading(false);
              toast.error("Could not play this station. Please try another one.");
            });
        }
      }
    }, 100);
  };
  
  const togglePlayPause = (currentStation: RadioStation | null) => {
    if (!audioRef.current || !currentStation) return;
    
    if (audioRef.current.paused) {
      setIsLoading(true);
      
      if (!audioRef.current.src || audioRef.current.src === '') {
        audioRef.current.src = currentStation.url;
        audioRef.current.load();
      }
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            setIsLoading(false);
            toast.error("Could not play this station. Please try again.");
          });
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  return { loadStation, togglePlayPause };
};
