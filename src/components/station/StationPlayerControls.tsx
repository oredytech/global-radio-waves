
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Heart, Loader2, Pause, Play, Share2, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { RadioStation } from "@/services/radioService";

interface StationPlayerControlsProps {
  station: RadioStation;
  isPlaying: boolean;
  playerLoading: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  handlePlayPause: () => void;
  isStationFavorite: boolean;
  toggleFavorite: () => void;
}

const StationPlayerControls: React.FC<StationPlayerControlsProps> = ({
  station,
  isPlaying,
  playerLoading,
  volume,
  setVolume,
  handlePlayPause,
  isStationFavorite,
  toggleFavorite,
}) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Écouter ${station?.name} sur GOWERA`,
        text: `Découvrez ${station?.name} depuis ${station?.country} sur GOWERA - L'application des radios du monde entier`,
        url: window.location.href,
      }).catch(err => {
        console.error('Erreur lors du partage:', err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier");
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl mb-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <Button 
            variant="default" 
            size="lg" 
            className="h-16 w-16 rounded-full bg-gowera-highlight hover:bg-gowera-highlight/80 text-black" 
            onClick={handlePlayPause}
            disabled={playerLoading}
          >
            {playerLoading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col w-full md:w-auto">
          <div className="text-xl font-semibold text-white mb-1 text-center md:text-left">
            {isPlaying ? "En lecture" : "Prêt à être écouté"}
          </div>
          <div className="text-sm text-gray-400 mb-3 text-center md:text-left">
            Plongez dans l'univers de {station.name}
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white hover:bg-white/10" 
              onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
            >
              {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <div className="flex-1">
              <Slider 
                className="w-full" 
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
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={isStationFavorite ? "text-red-500" : "text-gray-400"} 
            onClick={toggleFavorite}
          >
            {isStationFavorite ? (
              <Heart className="h-6 w-6 fill-red-500" />
            ) : (
              <Heart className="h-6 w-6" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400" 
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StationPlayerControls;
