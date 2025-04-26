
import React, { useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import { RadioStation } from "@/services/radioService";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { generateSlug } from "@/lib/utils";

interface RadioCardProps {
  station: RadioStation;
}

const RadioCard: React.FC<RadioCardProps> = ({ station }) => {
  const { loadStation, currentStation, isPlaying, isLoading, togglePlayPause } = useAudioPlayer();
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  
  // Check if this specific card's station is the one currently playing
  const isCurrentStation = currentStation?.id === station.id;
  const isThisStationPlaying = isCurrentStation && isPlaying;
  const isThisStationLoading = isLoading && isCurrentStation;
  
  const stationSlug = generateSlug(station.name);
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCurrentStation) {
      togglePlayPause();
    } else {
      loadStation(station);
    }
  };
  
  const handleCardClick = () => {
    navigate(`/station/${stationSlug}`);
  };
  
  const defaultImage = "https://placehold.co/100x100/333/888?text=Radio";
  const stationImage = imageError || !station.favicon ? defaultImage : station.favicon;
  
  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "radio-card flex flex-col h-48 cursor-pointer transition-all duration-300 group",
        isCurrentStation && "radio-playing",
      )}
      data-station-id={station.id}
    >
      <div className="relative flex-1 bg-black/50 shadow-md overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={stationImage}
            alt={station.name}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-50 transition-opacity duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center">
          <Button
            className={cn(
              "size-12 rounded-full p-0 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300",
              isThisStationPlaying ? "bg-gowera-highlight text-black" : "bg-gowera-highlight text-black"
            )}
            onClick={handlePlayClick}
            disabled={isThisStationLoading}
          >
            {isThisStationLoading ? (
              <Loader2 className="m-auto animate-spin" />
            ) : isThisStationPlaying ? (
              <Pause className="m-auto" />
            ) : (
              <Play className="m-auto" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="p-3 bg-gowera-surface flex flex-col items-center justify-center text-center">
        <h3 className="font-medium text-sm truncate text-white w-full">{station.name}</h3>
        <p className="text-xs text-gray-400 mt-1 w-full truncate">{station.country}</p>
      </div>
    </div>
  );
};

export default RadioCard;
