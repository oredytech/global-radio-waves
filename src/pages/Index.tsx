
import React, { useState, useEffect } from "react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { RadioStation, fetchTopStations, searchStations } from "@/services/radioService";
import { useDebounce } from "@/hooks/useDebounce";
import MenuDrawer from "@/components/MenuDrawer";
import SearchSection from "@/components/home/SearchSection";
import RandomListenSection from "@/components/home/RandomListenSection";
import TrendingStations from "@/components/home/TrendingStations";
import RecentlyPlayed from "@/components/home/RecentlyPlayed";
import PopularStations from "@/components/home/PopularStations";
import ExplorationButtons from "@/components/ExplorationButtons";

const Index = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [featuredStations, setFeaturedStations] = useState<RadioStation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const continents = ['Afrique', 'Europe', 'Amérique du Nord', 'Amérique du Sud', 'Asie', 'Océanie'];
  const continentMapping: Record<string, string> = {
    'Afrique': 'Africa',
    'Europe': 'Europe',
    'Amérique du Nord': 'North America',
    'Amérique du Sud': 'South America',
    'Asie': 'Asia',
    'Océanie': 'Oceania'
  };

  useEffect(() => {
    const fetchStationsList = async () => {
      setIsLoading(true);
      try {
        const result = debouncedSearchQuery 
          ? await searchStations(debouncedSearchQuery)
          : await fetchTopStations(50);
        setStations(result);
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStationsList();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoadingFeatured(true);
      try {
        const result = await fetchTopStations(12);
        if (result && result.length > 0) {
          const shuffled = [...result].sort(() => 0.5 - Math.random());
          setFeaturedStations(shuffled.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching featured stations:", error);
      } finally {
        setIsLoadingFeatured(false);
      }
    };
    
    fetchFeatured();
  }, []);

  const handleContinentClick = (continent: string) => {
    setSelectedContinent(continent);
    setDrawerOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gowera-background pb-20">
      <main className="flex-1 px-4 pt-4 pb-6">
        <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <RandomListenSection />
        <TrendingStations stations={featuredStations} isLoading={isLoadingFeatured} />
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Explorez par catégorie</h2>
          <ExplorationButtons />
        </div>
        <RecentlyPlayed stations={stations} />
        <PopularStations stations={stations} isLoading={isLoading} />
      </main>

      <MenuDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onContinentClick={handleContinentClick}
        continents={continents}
        selectedContinent={selectedContinent}
      />
    </div>
  );
};

export default Index;
