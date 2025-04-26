import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RadioStation } from "@/services/radioService";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { toast } from "sonner";
import { Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchStationsByCountry, fetchStationsByTag } from "@/services/stationsService";
import StationDetailsCard from "@/components/station/StationDetailsCard";
import StationMetadata from "@/components/station/StationMetadata";
import SimilarStationsCarousel from "@/components/station/SimilarStationsCarousel";
import { useFavorites } from "@/hooks/useFavorites";
import { findStationBySlug, getCountryFlag, generateSlug } from "@/utils/stationUtils";
import StationPlayerControls from "@/components/station/StationPlayerControls";
import StationHeader from "@/components/station/StationHeader";

const StationPlayerPage: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { 
    currentStation, 
    isPlaying, 
    togglePlayPause, 
    loadStation,
    volume,
    setVolume,
    isLoading: playerLoading 
  } = useAudioPlayer();
  const [station, setStation] = useState<RadioStation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [localTime, setLocalTime] = useState<string>("");

  // Fetch similar stations by country
  const { data: similarByCountry = [] } = useQuery({
    queryKey: ["stations", "country", station?.country],
    queryFn: () => fetchStationsByCountry(station?.country || "", 5),
    enabled: !!station?.country,
  });
  
  // Fetch similar stations by genre/tag
  const { data: similarByTag = [] } = useQuery({
    queryKey: ["stations", "tag", station?.tags[0]],
    queryFn: () => fetchStationsByTag(station?.tags[0] || "", 5),
    enabled: !!station?.tags && station.tags.length > 0,
  });

  // Filter out current station from similar stations and combine results
  const similarStations = React.useMemo(() => {
    if (!station) return [];
    
    const combined = [...similarByCountry, ...similarByTag]
      .filter(s => s.id !== station.id)
      .reduce((unique: RadioStation[], item) => {
        // Remove duplicates
        return unique.some(s => s.id === item.id) ? unique : [...unique, item];
      }, []);
      
    return combined.slice(0, 5); // Limit to 5 stations
  }, [similarByCountry, similarByTag, station]);

  // Update local time of the station's country
  useEffect(() => {
    if (!station) return;
    
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        setLocalTime(formatter.format(now));
      } catch (error) {
        console.error("Error getting local time", error);
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [station]);

  useEffect(() => {
    if (!stationId) {
      navigate("/");
      return;
    }

    if (currentStation && generateSlug(currentStation.name) === stationId) {
      setStation(currentStation);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const savedStations = localStorage.getItem("allRadioStations");
      if (savedStations) {
        const stations = JSON.parse(savedStations) as RadioStation[];
        const foundStation = findStationBySlug(stations, stationId);

        if (foundStation) {
          setStation(foundStation);
          setIsLoading(false);
        } else {
          // If not found in localStorage, fetch from API
          fetch(
            "https://de1.api.radio-browser.info/json/stations/byname/" +
              stationId.replace(/-/g, " ") +
              "?limit=5"
          )
            .then((response) => response.json())
            .then((data) => {
              if (data && data.length > 0) {
                setStation(data[0]);
              } else {
                toast.error("Station non trouvée");
                navigate("/");
              }
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching station:", error);
              toast.error("Impossible de charger la station");
              setIsLoading(false);
              navigate("/");
            });
        }
      } else {
        // No saved stations, fetch from API
        fetch(
          "https://de1.api.radio-browser.info/json/stations/byname/" +
            stationId.replace(/-/g, " ") +
            "?limit=5"
        )
          .then((response) => response.json())
          .then((data) => {
            if (data && data.length > 0) {
              setStation(data[0]);
            } else {
              toast.error("Station non trouvée");
              navigate("/");
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching station:", error);
            toast.error("Impossible de charger la station");
            setIsLoading(false);
            navigate("/");
          });
      }
    } catch (error) {
      console.error("Error retrieving station:", error);
      toast.error("Problème lors du chargement des informations");
      setIsLoading(false);
    }
  }, [stationId, currentStation, navigate]);

  useEffect(() => {
    // Auto-load the station when found, but don't auto-play
    if (station && (!currentStation || station.id !== currentStation.id)) {
      loadStation(station);
    }
  }, [station, currentStation, loadStation]);

  const handlePlayPause = () => {
    if (station) {
      togglePlayPause();
    }
  };
  
  const handleFavoriteToggle = () => {
    if (station) {
      toggleFavorite(station);
    }
  };

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

  return (
    <div className="relative min-h-screen pb-32 pt-4">
      {/* Background with blur effect */}
      <div 
        className="fixed inset-0 z-0 opacity-20 bg-cover bg-center blur-xl"
        style={{ 
          backgroundImage: `url(${stationImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Dark overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/80 via-gowera-background/90 to-gowera-background" />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-6 pb-20">
        <StationHeader 
          station={station}
          stationImage={stationImage}
          isPlaying={isPlaying}
          countryFlag={countryFlag}
          localTime={localTime}
          stationTags={stationTags}
        />
        
        <StationPlayerControls 
          station={station}
          isPlaying={isPlaying}
          playerLoading={playerLoading}
          volume={volume}
          setVolume={setVolume}
          handlePlayPause={handlePlayPause}
          isStationFavorite={isStationFavorite}
          toggleFavorite={handleFavoriteToggle}
        />
        
        {/* Split content into two columns on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column (station details) */}
          <div className="lg:col-span-2">
            <StationDetailsCard station={station} />
            
            <div className="mt-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Globe className="mr-2 h-5 w-5" /> 
                Vibrations similaires
              </h2>
              <SimilarStationsCarousel stations={similarStations} />
            </div>
          </div>
          
          {/* Right column (metadata) */}
          <div className="lg:col-span-1">
            <StationMetadata station={station} />
          </div>
        </div>
        
        {/* Inspirational quote */}
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
