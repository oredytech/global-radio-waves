
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RadioPlayer from "@/components/RadioPlayer";
import RadioCard from "@/components/RadioCard";
import CountryFilter from "@/components/CountryFilter";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { RadioStation, CountryInfo, fetchStationsByCountry } from "@/services/radioService";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import IndexHeader from "@/components/IndexHeader";

const Countries: React.FC = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"popular" | "recent" | "name">("popular");
  
  const { currentStation } = useAudioPlayer();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract country from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const country = queryParams.get('country');
    if (country) {
      setSelectedCountry(country);
    }
  }, [location.search]);
  
  React.useEffect(() => {
    const fetchStations = async () => {
      if (!selectedCountry) return;
      
      setIsLoading(true);
      try {
        const result = await fetchStationsByCountry(selectedCountry, 100);
        setStations(result);
        toast.success(`${result.length} stations trouvées pour ${selectedCountry}`);
      } catch (error) {
        console.error("Error fetching country stations:", error);
        toast.error(`Erreur lors du chargement des stations pour ${selectedCountry}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStations();
  }, [selectedCountry]);

  const handleMenuClick = () => {
    console.log("Menu clicked from Countries page");
  };
  
  const handleBackToWorldMap = () => {
    navigate('/world-map');
  };

  const filteredStations = debouncedSearchQuery
    ? stations.filter(station => 
        station.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    : stations;
    
  // Sort stations based on sortOrder
  const sortedStations = [...filteredStations].sort((a, b) => {
    switch (sortOrder) {
      case "popular":
        return b.votes - a.votes;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return b.clickCount - a.clickCount;
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-gowera-background">
      <IndexHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onMenuClick={handleMenuClick}
      />
      
      <main className="flex-1 container px-4 py-6 md:px-6">
        <div className="mb-8 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBackToWorldMap}
            className="text-white"
          >
            <ArrowLeft size={20} />
          </Button>
          
          {!selectedCountry ? (
            <div>
              <h1 className="text-2xl font-bold text-white">Explorez par pays</h1>
              <p className="text-sm text-gray-400">Sélectionnez un pays pour découvrir ses stations</p>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-white">
                Radio en {selectedCountry}
              </h1>
              <p className="text-sm text-gray-400">
                {sortedStations.length} stations disponibles
              </p>
            </div>
          )}
        </div>
        
        <div className="mb-8">
          {!selectedCountry && (
            <CountryFilter 
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
            />
          )}
        </div>
        
        {selectedCountry && (
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              variant={sortOrder === "popular" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortOrder("popular")}
            >
              Populaires
            </Button>
            <Button
              variant={sortOrder === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortOrder("recent")}
            >
              Récentes
            </Button>
            <Button
              variant={sortOrder === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortOrder("name")}
            >
              A-Z
            </Button>
          </div>
        )}
        
        <div>
          {selectedCountry ? (
            isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-gowera-highlight" />
              </div>
            ) : sortedStations.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-gray-300">Aucune station trouvée</h3>
                <p className="mt-2 text-gray-400">Essayez un autre pays ou une autre recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {sortedStations.map((station) => (
                  <RadioCard key={station.id} station={station} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p>Votre voyage sonore commence ici.</p>
              <p className="mt-4">Veuillez sélectionner un pays ci-dessus pour voir les stations disponibles</p>
            </div>
          )}
        </div>
      </main>
      
      {currentStation && <RadioPlayer />}
    </div>
  );
};

export default Countries;
