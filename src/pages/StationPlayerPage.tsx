
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { getCountryFlag } from "@/utils/stationUtils";
import StationPlayerControls from "@/components/station/StationPlayerControls";
import StationHeader from "@/components/station/StationHeader";
import StationDetailsCard from "@/components/station/StationDetailsCard";
import StationMetadata from "@/components/station/StationMetadata";
import SimilarStationsCarousel from "@/components/station/SimilarStationsCarousel";
import { useStationLoader } from "@/hooks/useStationLoader";
import { useSimilarStations } from "@/hooks/useSimilarStations";
import { useLocalTime } from "@/hooks/useLocalTime";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const StationPlayerPage: React.FC = () => {
  const { stationSlug } = useParams<{ stationSlug: string }>();
  const navigate = useNavigate();
  const { 
    currentStation, 
    isStationPlaying,
    isStationLoading,
    togglePlayPause, 
    loadStation,
    volume,
    setVolume,
  } = useAudioPlayer();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const { station, isLoading } = useStationLoader(stationSlug, currentStation, loadStation);
  const similarStations = useSimilarStations(station);
  const localTime = useLocalTime(station);

  useEffect(() => {
    if (station && (!currentStation || currentStation.id !== station.id)) {
      console.log("StationPlayerPage: Loading station into player:", station.name, station.id);
      loadStation(station);
    }
  }, [station, currentStation, loadStation]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 pb-32 flex flex-col items-center justify-center bg-gradient-to-b from-gowera-background to-black">
        <Loader2 className="h-12 w-12 animate-spin text-gowera-highlight mb-4" />
        <h2 className="text-xl text-white font-semibold">Chargement de la station...</h2>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen pt-16 pb-32 flex flex-col items-center justify-center bg-gradient-to-b from-gowera-background to-black">
        <h2 className="text-xl text-white font-semibold mb-4">Station non trouvée</h2>
        <Button onClick={() => navigate(-1)}>Retour</Button>
      </div>
    );
  }

  const defaultImage = "https://placehold.co/800x300/333/888?text=Radio";
  const stationImage = station.favicon || defaultImage;
  const stationTags = Array.isArray(station.tags) ? station.tags : 
                     (station.tags ? (typeof station.tags === 'string' ? [station.tags] : []) : []);
  const isStationFavorite = isFavorite(station.id);
  const countryFlag = station.country ? getCountryFlag(station.country.substring(0, 2)) : "🌍";
  const isCurrentStationPlaying = isStationPlaying(station.id);
  const isCurrentStationLoading = isStationLoading(station.id);

  const handlePlayPause = () => {
    console.log("StationPlayerPage: Play/pause button clicked for station:", station.name);
    if (currentStation?.id !== station.id) {
      console.log("StationPlayerPage: Loading station for play:", station.name);
      loadStation(station);
    } else {
      console.log("StationPlayerPage: Toggling play/pause for current station:", station.name);
      togglePlayPause();
    }
  };

  return (
    <div className="relative min-h-screen pb-32 pt-4">
      <div 
        className="fixed inset-0 z-0 opacity-20 bg-cover bg-center blur-xl"
        style={{ 
          backgroundImage: `url(${stationImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/80 via-gowera-background/90 to-gowera-background" />
      
      <div className="container mx-auto px-4 relative z-10 pt-6 pb-20">
        <Header />
        
        <StationHeader 
          station={station}
          stationImage={stationImage}
          isPlaying={isCurrentStationPlaying}
          countryFlag={countryFlag}
          localTime={localTime}
          stationTags={stationTags}
        />
        
        <StationPlayerControls 
          station={station}
          isPlaying={isCurrentStationPlaying}
          playerLoading={isCurrentStationLoading}
          volume={volume}
          setVolume={setVolume}
          handlePlayPause={handlePlayPause}
          isStationFavorite={isStationFavorite}
          toggleFavorite={() => toggleFavorite(station)}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <StationDetailsCard station={station} />
            
            <div className="mt-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Vibrations similaires
              </h2>
              <SimilarStationsCarousel stations={similarStations} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <StationMetadata station={station} />
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <blockquote className="italic text-lg text-gray-400 max-w-2xl mx-auto">
            "Chaque fréquence est un battement du cœur du monde."
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default StationPlayerPage;
