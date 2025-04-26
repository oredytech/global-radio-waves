
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RadioStation } from "@/services/radioService";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { toast } from "sonner";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  HeartOff, 
  Globe, 
  Clock, 
  Loader2,
  ArrowLeft,
  Share2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { fetchStationsByCountry, fetchStationsByTag } from "@/services/stationsService";
import StationWaveform from "@/components/station/StationWaveform";
import StationDetailsCard from "@/components/station/StationDetailsCard";
import StationMetadata from "@/components/station/StationMetadata";
import SimilarStationsCarousel from "@/components/station/SimilarStationsCarousel";
import { useFavorites } from "@/hooks/useFavorites";

// Helper functions
const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

const findStationBySlug = (
  stations: RadioStation[],
  slug: string
): RadioStation | undefined =>
  stations.find((s) => generateSlug(s.name) === slug);

const getCountryFlag = (countryCode: string) => {
  // Convert country code to flag emoji (each letter is converted to a regional indicator symbol emoji)
  if (!countryCode || countryCode.length !== 2) return "🌍";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

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
        // This is a simple approximation as we don't have timezone data
        // In a real app, you'd use a timezone API or database
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
  const stationTags = station.tags || [];
  const stationLang = station.language || "Non spécifié";
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
        {/* Back button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Retour
        </Button>
        
        {/* Station header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="relative shrink-0">
            <img 
              src={stationImage} 
              alt={station.name} 
              className="w-40 h-40 rounded-lg object-cover shadow-xl border border-white/10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImage;
              }}
            />
            {isPlaying && (
              <div className="absolute -top-2 -left-2">
                <StationWaveform />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/10 text-white hover:bg-white/20">Radio</Badge>
              {stationTags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-white border-white/20">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl font-bold text-white mt-1">{station.name}</h1>
            
            <div className="flex items-center text-gray-300">
              <Globe className="h-4 w-4 mr-1" />
              <span className="mr-2">{countryFlag}</span>
              <span>{station.country}</span>
              
              {localTime && (
                <div className="ml-4 flex items-center text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{localTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Player controls section */}
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
                onClick={handleFavoriteToggle}
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
