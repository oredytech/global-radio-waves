
import React, { useEffect, useRef } from "react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const RadioPlayer: React.FC = () => {
  const {
    currentStation,
    isPlaying,
    isLoading,
    volume,
    togglePlayPause,
    setVolume
  } = useAudioPlayer();
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure player stays at bottom of screen, above navbar
    if (playerRef.current) {
      const playerHeight = playerRef.current.offsetHeight;
      document.documentElement.style.setProperty('--player-height', `${playerHeight}px`);
    }
    return () => {
      document.documentElement.style.setProperty('--player-height', '0px');
    };
  }, [currentStation]);

  if (!currentStation) {
    return null;
  }

  const defaultImage = "https://placehold.co/60x60/333/888?text=Radio";
  const isMuted = volume === 0;

  return (
    <div 
      ref={playerRef} 
      className={cn(
        "player-container fixed bottom-16 left-0 right-0 z-30 bg-black/95 backdrop-blur-md border-t border-white/10 px-4 py-3", 
        "transition-all duration-300 ease-in-out"
      )}
    >
      <div className="container mx-auto px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 w-1/3">
            <div className="flex justify-center w-full">
              <img 
                src={currentStation.favicon || defaultImage} 
                alt={currentStation.name} 
                className="h-14 w-14 rounded-md object-cover" 
                onError={e => {
                  (e.target as HTMLImageElement).src = defaultImage;
                }} 
              />
              <div className="overflow-hidden ml-3">
                <h3 className="font-medium text-white truncate">{currentStation.name}</h3>
                <p className="text-xs text-gray-400 truncate">{currentStation.country}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center w-1/3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-white/10 text-white flex items-center justify-center" 
              onClick={togglePlayPause} 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 w-1/3 justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white hover:bg-transparent flex items-center justify-center" 
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
              onValueChange={values => {
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
