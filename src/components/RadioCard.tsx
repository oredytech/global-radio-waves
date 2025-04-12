
import React, { useState } from "react";
import { Play, Pause } from "lucide-react";
import { RadioStation } from "@/services/radioService";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RadioCardProps {
  station: RadioStation;
}

const RadioCard: React.FC<RadioCardProps> = ({ station }) => {
  const { loadStation, currentStation, isPlaying, togglePlayPause } = useAudioPlayer();
  const [imageError, setImageError] = useState(false);
  
  const isCurrentStation = currentStation?.id === station.id;
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentStation) {
      togglePlayPause();
    } else {
      loadStation(station);
    }
  };
  
  const defaultImage = "https://placehold.co/100x100/333/888?text=Radio";
  
  // Improved image handling with fallback
  const stationImage = imageError || !station.favicon ? defaultImage : station.favicon;
  
  return (
    <div 
      className={cn(
        "radio-card flex flex-col h-48 cursor-pointer transition-all duration-300 group",
        isCurrentStation && "radio-playing"
      )}
      onClick={() => loadStation(station)}
    >
      <div className="relative flex-1 bg-black/50 shadow-md overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={stationImage}
            alt={station.name}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-60 transition-opacity duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300">
          <Button
            className={cn(
              "size-12 rounded-full p-0 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300",
              isCurrentStation && isPlaying ? "bg-gowera-highlight text-black" : "bg-gowera-highlight text-black"
            )}
            onClick={handlePlayClick}
          >
            {isCurrentStation && isPlaying ? (
              <Pause size={22} />
            ) : (
              <Play size={22} className="ml-0.5" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="p-3 bg-gowera-surface">
        <h3 className="font-medium text-sm truncate text-white">{station.name}</h3>
        <p className="text-xs text-gray-400 mt-1">{station.country}</p>
      </div>
    </div>
  );
};

export default RadioCard;
