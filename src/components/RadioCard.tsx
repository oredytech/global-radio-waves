
import React from "react";
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
  
  const isCurrentStation = currentStation?.id === station.id;
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentStation) {
      togglePlayPause();
    } else {
      loadStation(station);
    }
  };
  
  const defaultImage = "https://placehold.co/100x100/ddd/888?text=Radio";
  
  return (
    <div 
      className={cn(
        "radio-card flex flex-col h-48 cursor-pointer transition-all duration-300 group",
        isCurrentStation && "radio-playing"
      )}
      onClick={() => loadStation(station)}
    >
      <div className="relative flex-1 bg-gray-100">
        <img
          src={station.favicon || defaultImage}
          alt={station.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
          <Button
            className={cn(
              "size-10 rounded-full p-0 opacity-0 group-hover:opacity-100",
              isCurrentStation && isPlaying ? "bg-gowera-gold text-black" : "bg-white text-black"
            )}
            onClick={handlePlayClick}
          >
            {isCurrentStation && isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-0.5" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{station.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{station.country}</p>
      </div>
    </div>
  );
};

export default RadioCard;
