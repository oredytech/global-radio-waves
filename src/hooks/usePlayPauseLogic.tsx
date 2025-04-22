
import { useRef } from 'react';
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
    if (!audioRef.current || !station) return;
    
    console.log("Chargement de la nouvelle station:", station.name, "URL:", station.url);
    
    // Mettre à jour l'état immédiatement pour feedback utilisateur
    setIsLoading(true);
    setIsPlaying(false);
    
    // Toujours arrêter la lecture en cours
    audioRef.current.pause();
    
    // Nettoyer complètement la source
    audioRef.current.src = "";
    // Forcer le déchargement des ressources audio
    audioRef.current.load();
    
    // Enregistrer l'URL actuelle
    lastUrlRef.current = station.url;
    
    // Court délai pour assurer que l'audio précédent est bien déchargé
    setTimeout(() => {
      if (audioRef.current && lastUrlRef.current === station.url) {
        // Définir la nouvelle source
        audioRef.current.src = station.url;
        audioRef.current.load();
        
        // Tenter la lecture
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
    }, 50); // Délai réduit au minimum pour transition rapide
  };
  
  const togglePlayPause = (currentStation: RadioStation | null) => {
    if (!audioRef.current || !currentStation) return;
    
    if (audioRef.current.paused) {
      setIsLoading(true);
      
      // Vérifier si la source actuelle correspond à la station
      const currentSource = audioRef.current.src;
      const stationSource = currentStation.url;
      
      // Si la source ne correspond pas, la définir
      if (!currentSource || !currentSource.includes(stationSource)) {
        console.log("Mise à jour de la source audio:", currentStation.url);
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
