
import React from "react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
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

  const defaultImage = "https://placehold.co/60x60/333/888?text=Radio";
  const isMuted = volume === 0;

  return (
    <div className="player-container py-3 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 w-1/3">
            <img 
              src={currentStation.favicon || defaultImage} 
              alt={currentStation.name} 
              className="h-14 w-14 rounded-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImage;
              }}
            />
            <div className="overflow-hidden">
              <h3 className="font-medium text-white truncate">{currentStation.name}</h3>
              <p className="text-xs text-gray-400 truncate">{currentStation.country}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-white/10 text-white"
                onClick={togglePlayPause}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-0.5" />
                )}
              </Button>
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {isLoading ? "Loading..." : isPlaying ? "Now playing" : "Paused"}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 w-1/3 justify-end">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-transparent"
              onClick={() => setVolume(isMuted ? 0.5 : 0)}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider 
              className="w-28" 
              defaultValue={[volume * 100]} 
              value={[volume * 100]}
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
