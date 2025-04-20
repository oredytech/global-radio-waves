
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
        setIsPlaying(true);
        setIsLoading(false);
      },
      () => setIsPlaying(false),
      () => {
        setIsLoading(false);
        setIsPlaying(false);
        toast.error("Error playing this station. Please try another one.");
      },
      () => setIsLoading(true)
    );
  }, [audioRef.current]);
  
  const loadStation = (station: RadioStation) => {
    setCurrentStation(station);
    handleLoadStation(station);
  };
  
  const togglePlayPause = () => {
    handleTogglePlayPause(currentStation);
  };
  
  const setVolume = (newVolume: number) => {
    if (!audioRef.current) return;
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
