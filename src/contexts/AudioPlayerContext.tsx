
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { RadioStation } from "@/services/radioService";
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

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      
      // Add event listeners
      audioRef.current.addEventListener("playing", () => {
        setIsPlaying(true);
        setIsLoading(false);
      });
      
      audioRef.current.addEventListener("pause", () => {
        setIsPlaying(false);
      });
      
      audioRef.current.addEventListener("error", (e) => {
        console.error("Audio error:", e);
        setIsLoading(false);
        setIsPlaying(false);
        toast.error("Error playing this station. Please try another one.");
      });
      
      audioRef.current.addEventListener("waiting", () => {
        setIsLoading(true);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        // Remove all event listeners
        audioRef.current.removeEventListener("playing", () => {});
        audioRef.current.removeEventListener("pause", () => {});
        audioRef.current.removeEventListener("error", () => {});
        audioRef.current.removeEventListener("waiting", () => {});
      }
    };
  }, []);
  
  // Load and play a station
  const loadStation = (station: RadioStation) => {
    if (!audioRef.current) return;
    
    // Only load if it's a different station
    if (!currentStation || currentStation.id !== station.id) {
      setIsLoading(true);
      setCurrentStation(station);
      audioRef.current.src = station.url;
      audioRef.current.load();
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        setIsLoading(false);
        toast.error("Could not play this station. Please try another one.");
      });
    } else {
      // If it's the same station, just toggle play/pause
      togglePlayPause();
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current || !currentStation) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setIsLoading(true);
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        setIsLoading(false);
        toast.error("Could not play this station. Please try again.");
      });
    }
  };
  
  // Set volume
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
}

// Custom hook for using the audio player context
export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}
