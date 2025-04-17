
import React, { useState } from "react";
import { Play, Pause } from "lucide-react";
import { RadioStation } from "@/services/radioService";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface RadioCardProps {
  station: RadioStation;
}

const RadioCard: React.FC<RadioCardProps> = ({ station }) => {
  const { loadStation, currentStation, isPlaying, togglePlayPause } = useAudioPlayer();
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  
  const isCurrentStation = currentStation?.id === station.id;
  
  // Generate a slug from station name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };
  
  const stationSlug = generateSlug(station.name);
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // First load/toggle the station
    if (isCurrentStation) {
      togglePlayPause();
    } else {
      loadStation(station);
    }
    
    // Navigate after a small delay to ensure audio processing has started
    setTimeout(() => {
      navigate(`/station/${stationSlug}`);
    }, 100);
  };
  
  const defaultImage = "https://placehold.co/100x100/333/888?text=Radio";
  
  // Improved image handling with fallback
  const stationImage = imageError || !station.favicon ? defaultImage : station.favicon;
  
  return (
    <Link
      to={`/station/${stationSlug}`}
      className={cn(
        "radio-card flex flex-col h-48 cursor-pointer transition-all duration-300 group",
        isCurrentStation && "radio-playing"
      )}
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
              "size-12 rounded-full p-0 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center",
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
      
      <div className="p-3 bg-gowera-surface flex flex-col items-center justify-center text-center">
        <h3 className="font-medium text-sm truncate text-white w-full">{station.name}</h3>
        <p className="text-xs text-gray-400 mt-1 w-full">{station.country}</p>
      </div>
    </Link>
  );
};

export default RadioCard;
