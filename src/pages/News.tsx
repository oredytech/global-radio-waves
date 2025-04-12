
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import RadioCard from "@/components/RadioCard";
import RadioPlayer from "@/components/RadioPlayer";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { RadioStation, fetchNewsStations } from "@/services/radioService";
import { Loader2 } from "lucide-react";

const News: React.FC = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { currentStation } = useAudioPlayer();
  
  useEffect(() => {
    const loadNewsStations = async () => {
      setIsLoading(true);
      try {
        const data = await fetchNewsStations(30);
        setStations(data);
      } catch (error) {
        console.error("Error fetching news stations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNewsStations();
  }, []);

  const filteredStations = searchQuery
    ? stations.filter(station => 
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stations;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-gowera-background pb-24">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="flex-1 container px-4 py-6 md:px-6">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">
            Actualités Radio
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-gowera-highlight" />
            </div>
          ) : filteredStations.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium text-gray-300">Aucune station trouvée</h3>
              <p className="mt-2 text-gray-400">Essayez de modifier votre recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredStations.map((station) => (
                <RadioCard key={station.id} station={station} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      {currentStation && <RadioPlayer />}
    </div>
  );
};

export default News;
