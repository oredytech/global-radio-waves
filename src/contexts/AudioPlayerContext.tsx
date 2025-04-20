
import React, { createContext, useContext, useState, useEffect } from "react";
import { RadioStation } from "@/services/radioService";
import { toast } from "sonner";
import { useAudioElement } from "@/hooks/useAudioElement";
import { setupAudioEventListeners } from "@/utils/audioHandlers";
import { useStationPersistence } from "@/hooks/useStationPersistence";
import { useStationsFetching } from "@/hooks/useStationsFetching";

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
  
  // Initialize persistence hooks
  useStationPersistence(currentStation);
  useStationsFetching();

  useEffect(() => {
    if (!audioRef.current) return;

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      toast.error("Error playing this station. Please try another one.");
    };
    
    const handleWaiting = () => {
      setIsLoading(true);
    };

    return setupAudioEventListeners(
      audioRef.current,
      handlePlaying,
      handlePause,
      handleError,
      handleWaiting
    );
  }, [audioRef.current]);
  
  const loadStation = (station: RadioStation) => {
    if (!audioRef.current) return;
    
    setCurrentStation(station);
    setIsLoading(true);
    
    audioRef.current.pause();
    audioRef.current.src = "";
    
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = station.url;
        audioRef.current.load();
        
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
              toast.error("Could not play this station. Please try another one.");
            });
        }
      }
    }, 100);
  };
  
  const togglePlayPause = () => {
    if (!audioRef.current || !currentStation) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      
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
            toast.error("Could not play this station. Please try again.");
          });
      }
    }
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
