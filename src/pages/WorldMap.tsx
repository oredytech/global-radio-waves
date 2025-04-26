
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Search, Map, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchCountries } from "@/services/radioService";
import CountryCard from "@/components/world/CountryCard";
import CountryList from "@/components/world/CountryList";
import IndexHeader from "@/components/IndexHeader";
import RadioPlayer from "@/components/RadioPlayer";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { toast } from "sonner";
import { continents, getContinentForCountry } from "@/components/world/constants";
import { useCountryFiltering, ExtendedCountryInfo } from "@/hooks/useCountryFiltering";
import RandomCountryButton from "@/components/world/RandomCountryButton";

const WorldMap: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showDrawer, setShowDrawer] = useState(false);
  const navigate = useNavigate();
  const { currentStation } = useAudioPlayer();
  
  const {
    countries,
    setCountries,
    filteredCountries,
    searchQuery,
    setSearchQuery,
    selectedContinent,
    setSelectedContinent
  } = useCountryFiltering([]);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const loadCountries = async () => {
      setIsLoading(true);
      try {
        const fetchedCountries = await fetchCountries(200);
        const countriesWithContinent = fetchedCountries.map(country => ({
          ...country,
          continent: getContinentForCountry(country.name)
        }));
        setCountries(countriesWithContinent);
      } catch (error) {
        console.error("Error loading countries:", error);
        toast.error("Erreur lors du chargement des pays");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCountries();
  }, [setCountries]);

  const handleCountryClick = (country: ExtendedCountryInfo) => {
    navigate(`/countries?country=${encodeURIComponent(country.name)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-gowera-background pb-20">
      <IndexHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onMenuClick={() => setShowDrawer(true)}
      />
      
      <main className="flex-1 container px-4 py-6 md:px-6">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Explorez par pays</h1>
            <p className="text-gray-400 italic">
              "Un monde, des millions de mélodies. Où écouterez-vous aujourd'hui ?"
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <Tabs defaultValue="all" className="w-full md:w-auto">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
                {continents.map((continent) => (
                  <TabsTrigger 
                    key={continent.value} 
                    value={continent.value}
                    onClick={() => setSelectedContinent(continent.value)}
                    className="text-xs md:text-sm"
                  >
                    {continent.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className={viewMode === "grid" ? "bg-muted/50" : ""}
                onClick={() => setViewMode("grid")}
              >
                <Map size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={viewMode === "list" ? "bg-muted/50" : ""}
                onClick={() => setViewMode("list")}
              >
                <List size={20} />
              </Button>
            </div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4 md:p-6 backdrop-blur-sm border border-white/5">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gowera-highlight" />
              </div>
            ) : filteredCountries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-lg text-gray-400">Aucun pays trouvé</p>
                <Button 
                  variant="link" 
                  onClick={() => { 
                    setSearchQuery("");
                    setSelectedContinent("all");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredCountries.map((country) => (
                  <CountryCard 
                    key={country.name}
                    country={country}
                    onClick={() => handleCountryClick(country)}
                    colorClass={getContinentColor(country.continent || "")}
                  />
                ))}
              </div>
            ) : (
              <CountryList 
                countries={filteredCountries}
                onCountryClick={handleCountryClick}
                getColorClass={(country) => getContinentColor(country.continent || "")}
              />
            )}
          </div>
          
          <div className="flex justify-center">
            <RandomCountryButton 
              countries={filteredCountries}
              onRandomCountry={handleCountryClick}
            />
          </div>
          
          <div className="text-center text-sm text-gray-500 italic mt-4">
            "Chaque pays cache un chant. Trouvez-le."
          </div>
        </div>
      </main>
      
      {currentStation && <RadioPlayer />}
    </div>
  );
};

export default WorldMap;
