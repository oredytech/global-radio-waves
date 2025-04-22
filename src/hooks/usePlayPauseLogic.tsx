
import { useState, useRef, useEffect } from 'react';
import { RadioStation } from '@/services/radioService';
import { toast } from "sonner";

interface UsePlayPauseLogicProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  setIsLoading: (loading: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const usePlayPauseLogic = ({ audioRef, setIsLoading, setIsPlaying }: UsePlayPauseLogicProps) => {
  // Gardons une trace de la dernière URL pour éviter les rechargements inutiles
  const lastUrlRef = useRef<string | null>(null);

  const loadStation = (station: RadioStation) => {
    if (!audioRef.current) return;
    
    setIsLoading(true);
    setIsPlaying(false); // Assurons-nous que l'état isPlaying est bien mis à false avant de charger
    
    // Toujours pauser l'audio actuel avant de changer la source
    audioRef.current.pause();
    
    // Vider complètement la source actuelle
    audioRef.current.src = "";
    audioRef.current.load();
    
    console.log("Chargement de la nouvelle station:", station.name, "URL:", station.url);
    lastUrlRef.current = station.url;
    
    // Petit délai pour assurer une transition propre entre les états
    setTimeout(() => {
      if (audioRef.current && lastUrlRef.current === station.url) {
        // Définir la nouvelle source et charger
        audioRef.current.src = station.url;
        audioRef.current.load();
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Lecture réussie pour", station.name);
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Erreur de lecture audio:", error);
              setIsLoading(false);
              setIsPlaying(false);
              toast.error("Impossible de lire cette station. Essayez-en une autre.");
            });
        }
      }
    }, 300); // Augmentation du délai pour une transition plus sûre
  };
  
  const togglePlayPause = (currentStation: RadioStation | null) => {
    if (!audioRef.current || !currentStation) return;
    
    if (audioRef.current.paused) {
      setIsLoading(true);
      
      // Si la source est vide ou a changé, la définir
      if (!audioRef.current.src || audioRef.current.src === '') {
        console.log("Définition de la source:", currentStation.url);
        audioRef.current.src = currentStation.url;
        audioRef.current.load();
      }
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Lecture réussie après togglePlayPause");
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Erreur de lecture audio:", error);
            setIsLoading(false);
            setIsPlaying(false);
            toast.error("Impossible de lire cette station. Essayez à nouveau.");
          });
      }
    } else {
      console.log("Pause de la lecture");
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  return { loadStation, togglePlayPause };
};
