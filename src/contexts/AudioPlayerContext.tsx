
import React, { createContext, useContext, useState, useEffect } from "react";
import { RadioStation } from "@/services/radioService";
import { useAudioElement } from "@/hooks/useAudioElement";
import { setupAudioEventListeners } from "@/utils/audioHandlers";
import { useStationPersistence } from "@/hooks/useStationPersistence";
import { useStationsFetching } from "@/hooks/useStationsFetching";
import { usePlayPauseLogic } from "@/hooks/usePlayPauseLogic";
import { toast } from "sonner";

interface AudioPlayerContextType {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  volume: number;
  loadStation: (station: RadioStation) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  isLoading: boolean;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useAudioElement(volume);
  
  // Use the hooks but don't assign their return values
  useStationPersistence(currentStation);
  useStationsFetching();
  
  const { loadStation: handleLoadStation, togglePlayPause: handleTogglePlayPause } = usePlayPauseLogic({
    audioRef,
    setIsLoading,
    setIsPlaying
  });

  // Load saved station on mount
  useEffect(() => {
    const savedStationJson = localStorage.getItem('currentRadioStation');
    if (savedStationJson) {
      try {
        const savedStation = JSON.parse(savedStationJson);
        if (savedStation) {
          console.log("Station récupérée du stockage local:", savedStation.name);
          setCurrentStation(savedStation);
          // We load the station but don't auto-play it
        }
      } catch (e) {
        console.error("Error parsing saved station:", e);
      }
    }
  }, []);

  // Setup audio event listeners
  useEffect(() => {
    if (!audioRef.current) return;

    return setupAudioEventListeners(
      audioRef.current,
      () => {
        console.log("Événement playing déclenché");
        setIsPlaying(true);
        setIsLoading(false);
      },
      () => {
        console.log("Événement pause déclenché");
        setIsPlaying(false);
      },
      () => {
        console.log("Événement error déclenché");
        setIsLoading(false);
        setIsPlaying(false);
        toast.error("Erreur lors de la lecture de cette station. Essayez-en une autre.");
      },
      () => {
        console.log("Événement waiting déclenché");
        setIsLoading(true);
      }
    );
  }, [audioRef.current]);
  
  const loadStation = (station: RadioStation) => {
    console.log("Chargement de la station:", station.name);
    // S'assurer que nous mettons à jour l'état actuel avant de charger l'audio
    setCurrentStation(station);
    handleLoadStation(station);
  };
  
  const togglePlayPause = () => {
    console.log("Toggle play/pause pour:", currentStation?.name);
    handleTogglePlayPause(currentStation);
  };
  
  const setVolume = (newVolume: number) => {
    if (!audioRef.current) return;
    console.log("Volume ajusté à:", newVolume);
    audioRef.current.volume = newVolume;
    setVolumeState(newVolume);
  };
  
  return (
    <AudioPlayerContext.Provider
      value={{
        currentStation,
        isPlaying,
        volume,
        loadStation,
        togglePlayPause,
        setVolume,
        isLoading,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}
