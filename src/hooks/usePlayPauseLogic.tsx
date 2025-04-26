
import { useState } from 'react';
import { RadioStation } from '@/services/radioService';
import { toast } from "sonner";
import { resetAudio } from '@/utils/audioHandlers';

interface UsePlayPauseLogicProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  setIsLoading: (loading: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const usePlayPauseLogic = ({ audioRef, setIsLoading, setIsPlaying }: UsePlayPauseLogicProps) => {
  const loadStation = (station: RadioStation) => {
    if (!audioRef.current) return;
    
    console.log("Loading station:", station.name, station.url);
    setIsLoading(true);
    
    // Reset the audio element completely
    resetAudio(audioRef.current);
    
    // Short timeout to ensure clean slate before setting new source
    setTimeout(() => {
      if (!audioRef.current) return;
      
      // Set the new source
      audioRef.current.src = station.url;
      
      // Force reload with the new source
      try {
        audioRef.current.load();
      } catch (e) {
        console.error("Error during load:", e);
        setIsLoading(false);
        setIsPlaying(false);
        toast.error("Problème lors du chargement de la station");
        return;
      }
      
      // Now play the new station
      console.log("Playing new station:", station.name);
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Playback started successfully");
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            setIsLoading(false);
            setIsPlaying(false);
            toast.error("Impossible de lire cette station. Essayez-en une autre.");
          });
      } else {
        console.log("Play promise was undefined");
        setIsLoading(false);
      }
    }, 100); // Small delay to ensure clean transition
  };
  
  const togglePlayPause = (currentStation: RadioStation | null) => {
    if (!audioRef.current || !currentStation) return;
    
    if (audioRef.current.paused) {
      setIsLoading(true);
      
      // If source is empty or has changed, set it
      if (!audioRef.current.src || audioRef.current.src === '') {
        console.log("Source was empty, setting to:", currentStation.url);
        audioRef.current.src = currentStation.url;
        try {
          audioRef.current.load();
        } catch (e) {
          console.error("Error loading audio:", e);
        }
      }
      
      console.log("Playing station:", currentStation.name);
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Playback resumed successfully");
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            setIsLoading(false);
            setIsPlaying(false);
            toast.error("Problème lors de la lecture. Veuillez réessayer.");
          });
      } else {
        console.log("Play promise was undefined on resume");
        setIsLoading(false);
      }
    } else {
      console.log("Pausing playback");
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  return { loadStation, togglePlayPause };
};
