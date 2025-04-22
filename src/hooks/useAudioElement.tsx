
import { useEffect, useRef } from 'react';

export const useAudioElement = (volume: number) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Créer l'élément audio au montage du composant s'il n'existe pas déjà
    if (!audioRef.current) {
      console.log("Création d'un nouvel élément audio");
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.preload = "auto";
      
      // S'assurer que l'audio est proprement nettoyé lors du démontage
      const currentAudio = audioRef.current;
      
      return () => {
        console.log("Nettoyage de l'élément audio");
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.src = "";
          currentAudio.load();
        }
      };
    }
  }, []);

  // Mettre à jour le volume quand il change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return audioRef;
};
