
import React from "react";
import { RadioStation } from "@/services/radioService";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import SeeAllButton from "@/components/SeeAllButton";
import { Button } from "@/components/ui/button";
import { Play, Pause, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentlyPlayedProps {
  stations: RadioStation[];
}

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({ stations }) => {
  const { loadStation, currentStation, togglePlayPause, isStationPlaying, isStationLoading } = useAudioPlayer();

  const handlePlayStation = (station: RadioStation, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (currentStation?.id === station.id) {
      togglePlayPause();
    } else {
      loadStation(station);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Écoutées récemment</h2>
        <SeeAllButton to="/recent" />
      </div>

      <div className="flex overflow-x-auto space-x-4 pb-4 snap-x">
        {stations.slice(0, 10).map((station) => {
          const isThisStationPlaying = isStationPlaying(station.id);
          const isThisStationLoading = isStationLoading(station.id);
          
          return (
            <div 
              key={station.id} 
              className="min-w-[160px] rounded-lg bg-white/10 p-3 flex flex-col items-center text-center snap-start cursor-pointer relative group"
            >
              <div className="h-16 w-16 rounded-full bg-black/30 mb-3 overflow-hidden relative">
                <img 
                  src={station.favicon || "https://placehold.co/100x100/333/888?text=Radio"}
                  alt={station.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/100x100/333/888?text=Radio";
                  }}
                />
                <Button
                  variant="default"
                  size="icon"
                  className={cn(
                    "absolute inset-0 m-auto size-8 rounded-full bg-gowera-highlight/80 hover:bg-gowera-highlight text-black opacity-0 group-hover:opacity-100 transition-opacity",
                    isThisStationPlaying && "opacity-100"
                  )}
                  onClick={(e) => handlePlayStation(station, e)}
                  disabled={isThisStationLoading}
                >
                  {isThisStationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isThisStationPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </Button>
              </div>
              <h3 className="text-sm font-medium text-white truncate w-full">{station.name}</h3>
              <p className="text-xs text-gray-400 truncate w-full">{station.country}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlyPlayed;
