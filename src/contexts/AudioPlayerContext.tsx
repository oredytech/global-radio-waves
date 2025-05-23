
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
  isStationPlaying: (stationId: string) => boolean;
  isStationLoading: (stationId: string) => boolean;
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
          console.log("Loaded saved station:", savedStation.name);
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
    
    console.log("Setting up audio event listeners");
    
    return setupAudioEventListeners(
      audioRef.current,
      () => {
        console.log("Audio event: playing");
        setIsPlaying(true);
        setIsLoading(false);
      },
      () => {
        console.log("Audio event: pause");
        setIsPlaying(false);
      },
      () => {
        console.log("Audio event: error");
        setIsLoading(false);
        setIsPlaying(false);
        toast.error("Problème avec cette station. Essayez-en une autre.");
      },
      () => {
        console.log("Audio event: waiting/buffering");
        setIsLoading(true);
      },
      () => {
        console.log("Audio event: ended");
        setIsPlaying(false);
      }
    );
  }, [audioRef.current]);
  
  const loadStation = (station: RadioStation) => {
    console.log("Request to load station:", station.name, station.id);
    
    // Always update the current station in state first
    setCurrentStation(station);
    
    // Now load the station's audio
    console.log("Loading station:", station.name, station.id);
    handleLoadStation(station);
  };
  
  const togglePlayPause = () => {
    console.log("Toggle play/pause for current station");
    if (!currentStation) {
      console.warn("Attempt to toggle play/pause but no station is selected");
      return;
    }
    handleTogglePlayPause(currentStation);
  };
  
  const setVolume = (newVolume: number) => {
    if (!audioRef.current) return;
    console.log("Setting volume to:", newVolume);
    audioRef.current.volume = newVolume;
    setVolumeState(newVolume);
  };
  
  // Helper function to check if a specific station is playing
  const isStationPlaying = (stationId: string) => {
    return isPlaying && currentStation?.id === stationId;
  };
  
  // Helper function to check if a specific station is loading
  const isStationLoading = (stationId: string) => {
    return isLoading && currentStation?.id === stationId;
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
        isStationPlaying,
        isStationLoading,
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
