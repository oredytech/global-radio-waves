
import { useEffect, useRef } from 'react';

export const useAudioElement = (volume: number) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Créer l'élément audio au montage du composant s'il n'existe pas déjà
    if (!audioRef.current) {
      console.log("Création d'un nouvel élément audio");
      const audio = new Audio();
      audio.volume = volume;
      audio.preload = "auto";
      audioRef.current = audio;
    }
    
    // S'assurer que l'audio est proprement nettoyé lors du démontage
    return () => {
      if (audioRef.current) {
        console.log("Nettoyage de l'élément audio");
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load();
        // Ne pas réinitialiser audioRef.current à null ici
      }
    };
  }, []);

  // Mettre à jour le volume quand il change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return audioRef;
};
