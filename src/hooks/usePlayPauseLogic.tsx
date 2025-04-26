
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
      
      try {
        // Set the new source
        audioRef.current.src = station.url;
        console.log("Set audio source to:", station.url);
        
        // Force reload with the new source
        audioRef.current.load();
        console.log("Reloaded audio element");
        
        // Now play the new station
        console.log("Playing new station:", station.name);
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Playback started successfully for:", station.name);
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error playing audio:", error, "for station:", station.name);
              setIsLoading(false);
              setIsPlaying(false);
              toast.error("Impossible de lire cette station. Essayez-en une autre.");
            });
        } else {
          console.log("Play promise was undefined for station:", station.name);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Error during load/play setup:", e);
        setIsLoading(false);
        setIsPlaying(false);
        toast.error("Problème lors du chargement de la station");
      }
    }, 100); // Small delay to ensure clean transition
  };
  
  const togglePlayPause = (currentStation: RadioStation | null) => {
    if (!audioRef.current || !currentStation) {
      console.error("Cannot toggle play/pause: Missing audio element or current station");
      return;
    }
    
    console.log("Toggle play/pause for station:", currentStation.name);
    
    if (audioRef.current.paused) {
      setIsLoading(true);
      
      // If source is empty or has changed, set it
      if (!audioRef.current.src || audioRef.current.src === '' || !audioRef.current.src.includes(currentStation.url)) {
        console.log("Audio source needs update, current:", audioRef.current.src, "setting to:", currentStation.url);
        audioRef.current.src = currentStation.url;
        try {
          audioRef.current.load();
          console.log("Reloaded audio with new source");
        } catch (e) {
          console.error("Error loading audio:", e);
          setIsLoading(false);
          return;
        }
      }
      
      console.log("Playing station:", currentStation.name);
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Playback resumed successfully for:", currentStation.name);
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error playing audio:", error, "for station:", currentStation.name);
            setIsLoading(false);
            setIsPlaying(false);
            toast.error("Problème lors de la lecture. Veuillez réessayer.");
          });
      } else {
        console.log("Play promise was undefined on resume for station:", currentStation.name);
        setIsLoading(false);
      }
    } else {
      console.log("Pausing playback for station:", currentStation.name);
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  return { loadStation, togglePlayPause };
};
