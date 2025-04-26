
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
    
    // Always pause the current audio first before changing source
    audioRef.current.pause();
    
    // Clear the current source
    audioRef.current.src = "";
    
    // Ensure the browser knows we're changing the source
    try {
      audioRef.current.load();
    } catch (e) {
      console.log("Error during load:", e);
    }
    
    // Set the new source
    audioRef.current.src = station.url;
    
    // Force reload with the new source
    try {
      audioRef.current.load();
    } catch (e) {
      console.log("Error during second load:", e);
    }
    
    // Now play the new station
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
          setIsPlaying(false);
          toast.error("Could not play this station. Please try another one.");
        });
    }
  };
  
  const togglePlayPause = (currentStation: RadioStation | null) => {
    if (!audioRef.current || !currentStation) return;
    
    if (audioRef.current.paused) {
      setIsLoading(true);
      
      // If source is empty or has changed, set it
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
            setIsPlaying(false);
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
