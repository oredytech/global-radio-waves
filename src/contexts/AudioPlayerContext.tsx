
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

export const AudioPlayerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Persistence of last station state
  useEffect(() => {
    const savedStation = localStorage.getItem('currentRadioStation');
    if (savedStation) {
      try {
        const parsedStation = JSON.parse(savedStation);
        setCurrentStation(parsedStation);
        // Don't autoplay to avoid autoplay issues
      } catch (e) {
        console.error("Error retrieving station:", e);
      }
    }
    
    // Store all stations in localStorage for easier retrieval in station detail page
    const fetchAndStoreStations = async () => {
      try {
        const response = await fetch('https://de1.api.radio-browser.info/json/stations/topvote/100');
        if (response.ok) {
          const stations = await response.json();
          localStorage.setItem('allRadioStations', JSON.stringify(stations));
        }
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };
    
    fetchAndStoreStations();
  }, []);

  // Create audio element on mount
  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.preload = "auto";
      
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

  // Save current station when it changes
  useEffect(() => {
    if (currentStation) {
      localStorage.setItem('currentRadioStation', JSON.stringify(currentStation));
    }
  }, [currentStation]);
  
  // Load and play a station
  const loadStation = (station: RadioStation) => {
    if (!audioRef.current) {
      // Create audio element if it doesn't exist yet
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    
    // Always update state so RadioPlayer component is rendered
    setCurrentStation(station);
    setIsLoading(true);
    
    try {
      // Stop any currently playing audio
      audioRef.current.pause();
      
      // Clear src property before loading new URL
      audioRef.current.src = "";
      
      // Load audio with the new URL
      audioRef.current.src = station.url;
      audioRef.current.load();
      
      // Force play with user interaction
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
    } catch (error) {
      console.error("Error loading audio:", error);
      setIsLoading(false);
      toast.error("Error loading station. Please try again.");
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current || !currentStation) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      
      // Ensure audio source is set
      if (!audioRef.current.src || audioRef.current.src === '') {
        audioRef.current.src = currentStation.url;
        audioRef.current.load();
      }
      
      // Force play with user interaction
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
};

// Custom hook for using the audio player context
export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}
