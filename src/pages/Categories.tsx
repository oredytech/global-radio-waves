
import React, { useState } from "react";
import Header from "@/components/Header";
import RadioPlayer from "@/components/RadioPlayer";
import RadioCard from "@/components/RadioCard";
import CategoryFilter from "@/components/CategoryFilter";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { RadioStation, fetchStationsByTag } from "@/services/radioService";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2 } from "lucide-react";

const Categories: React.FC = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { currentStation } = useAudioPlayer();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Load stations when category is selected
  React.useEffect(() => {
    const fetchStations = async () => {
      if (!selectedCategory) return;
      
      setIsLoading(true);
      try {
        const result = await fetchStationsByTag(selectedCategory, 50);
        setStations(result);
      } catch (error) {
        console.error("Error fetching category stations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStations();
  }, [selectedCategory]);

  // Filter stations by search query
  const filteredStations = debouncedSearchQuery
    ? stations.filter(station => 
        station.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    : stations;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-gowera-background pb-24">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="flex-1 container px-4 py-6 md:px-6">
        <div className="mb-8">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">
            {selectedCategory
              ? `Stations de radio ${selectedCategory}`
              : "Sélectionnez une catégorie"}
          </h2>
          
          {selectedCategory ? (
            isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-gowera-highlight" />
              </div>
            ) : filteredStations.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-gray-300">Aucune station trouvée</h3>
                <p className="mt-2 text-gray-400">Essayez une autre catégorie ou une autre recherche</p>
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
              Veuillez sélectionner une catégorie ci-dessus pour voir les stations disponibles
            </div>
          )}
        </div>
      </main>
      
      {currentStation && <RadioPlayer />}
    </div>
  );
};

export default Categories;
