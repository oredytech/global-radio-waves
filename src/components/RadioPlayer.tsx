
import React from "react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const RadioPlayer: React.FC = () => {
  const { 
    currentStation, 
    isPlaying, 
    isLoading,
    volume, 
    togglePlayPause, 
    setVolume 
  } = useAudioPlayer();

  if (!currentStation) {
    return null;
  }

  const defaultImage = "https://placehold.co/60x60/ddd/888?text=Radio";

  return (
    <div className="player-container py-2 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 w-1/3">
            <img 
              src={currentStation.favicon || defaultImage} 
              alt={currentStation.name} 
              className="h-12 w-12 rounded-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImage;
              }}
            />
            <div className="overflow-hidden">
              <h3 className="font-medium truncate">{currentStation.name}</h3>
              <p className="text-xs text-gray-500 truncate">{currentStation.country}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={togglePlayPause}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </Button>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {isLoading ? "Loading..." : isPlaying ? "Now playing" : "Paused"}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 w-1/3 justify-end">
            <Volume2 className="h-5 w-5 text-gray-500" />
            <Slider 
              className="w-24" 
              defaultValue={[volume * 100]} 
              max={100} 
              step={1}
              onValueChange={(values) => {
                setVolume(values[0] / 100);
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
