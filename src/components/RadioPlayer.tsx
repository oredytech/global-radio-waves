
import React, { useEffect, useRef } from "react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Play, Pause, Volume2, VolumeX, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useFavorites } from "@/hooks/useFavorites";
import { useNavigate } from "react-router-dom";
import { generateSlug } from "@/lib/utils";

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
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();
  
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

  const toggleFavoriteStation = () => {
    if (!currentStation) return;
    toggleFavorite(currentStation);
    
    if (isFavorite(currentStation.id)) {
      toast.success("Station retirée des favoris");
    } else {
      toast.success("Station ajoutée aux favoris");
    }
  };

  const handleStationClick = () => {
    if (!currentStation) return;
    const stationSlug = generateSlug(currentStation.name);
    navigate(`/station/${stationSlug}`);
  };

  const defaultImage = "https://placehold.co/60x60/333/888?text=Radio";
  const stationImage = currentStation.favicon || defaultImage;
  const isMuted = volume === 0;
  const stationFavorite = isFavorite(currentStation.id);

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
          {/* Station info */}
          <div className="flex items-center space-x-4 w-1/3">
            <div className="flex justify-center w-full">
              <img 
                src={stationImage} 
                alt={currentStation.name} 
                className="h-14 w-14 rounded-md object-cover cursor-pointer" 
                onClick={handleStationClick}
                onError={e => {
                  (e.target as HTMLImageElement).src = defaultImage;
                }} 
              />
              <div className="overflow-hidden ml-3 cursor-pointer" onClick={handleStationClick}>
                <h3 className="font-medium text-white truncate">{currentStation.name}</h3>
                <p className="text-xs text-gray-400 truncate">{currentStation.country || "Radio mondiale"}</p>
              </div>
            </div>
          </div>
          
          {/* Playback controls */}
          <div className="flex items-center justify-center w-1/3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-white/10 text-white flex items-center justify-center" 
              onClick={togglePlayPause} 
              disabled={isLoading}
              aria-label={isPlaying ? "Pause" : "Play"}
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
          
          {/* Volume and favorite controls */}
          <div className="flex items-center space-x-2 w-1/3 justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full h-8 w-8"
              onClick={toggleFavoriteStation}
              aria-label={stationFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              {stationFavorite ? (
                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              ) : (
                <Heart className="h-5 w-5" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white hover:bg-transparent flex items-center justify-center" 
              onClick={() => setVolume(isMuted ? 0.5 : 0)}
              aria-label={isMuted ? "Activer le son" : "Couper le son"}
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
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
