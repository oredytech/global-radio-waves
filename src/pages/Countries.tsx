import React, { useState } from "react";
import RadioPlayer from "@/components/RadioPlayer";
import RadioCard from "@/components/RadioCard";
import CountryFilter from "@/components/CountryFilter";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { RadioStation, CountryInfo, fetchStationsByCountry } from "@/services/radioService";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2 } from "lucide-react";

const Countries: React.FC = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { currentStation } = useAudioPlayer();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  React.useEffect(() => {
    const fetchStations = async () => {
      if (!selectedCountry) return;
      
      setIsLoading(true);
      try {
        const result = await fetchStationsByCountry(selectedCountry, 50);
        setStations(result);
      } catch (error) {
        console.error("Error fetching country stations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStations();
  }, [selectedCountry]);

  const handleMenuClick = () => {
    console.log("Menu clicked from Countries page");
  };

  const filteredStations = debouncedSearchQuery
    ? stations.filter(station => 
        station.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    : stations;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-gowera-background">
      <main className="flex-1 container px-4 py-6 md:px-6">
        <div className="mb-8">
          <CountryFilter 
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">
            {selectedCountry
              ? `Stations de radio en ${selectedCountry}`
              : "Sélectionnez un pays"}
          </h2>
          
          {selectedCountry ? (
            isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-gowera-highlight" />
              </div>
            ) : filteredStations.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-gray-300">Aucune station trouvée</h3>
                <p className="mt-2 text-gray-400">Essayez un autre pays ou une autre recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredStations.map((station) => (
                  <RadioCard key={station.id} station={station} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-20 text-gray-400">
              Veuillez sélectionner un pays ci-dessus pour voir les stations disponibles
            </div>
          )}
        </div>
      </main>
      
      {currentStation && <RadioPlayer />}
    </div>
  );
};

export default Countries;
