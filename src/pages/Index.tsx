import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import RadioPlayer from "@/components/RadioPlayer";
import RadioCard from "@/components/RadioCard";
import CountryFilter from "@/components/CountryFilter";
import CategoryFilter from "@/components/CategoryFilter";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { 
  RadioStation, 
  fetchTopStations, 
  fetchStationsByCountry, 
  fetchStationsByTag, 
  searchStations 
} from "@/services/radioService";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, ChevronRight } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const isMobile = useIsMobile();
  const { currentStation } = useAudioPlayer();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      let result: RadioStation[] = [];
      
      try {
        if (debouncedSearchQuery) {
          result = await searchStations(debouncedSearchQuery);
        } else if (selectedCountry) {
          result = await fetchStationsByCountry(selectedCountry);
        } else if (selectedCategory) {
          result = await fetchStationsByTag(selectedCategory);
        } else {
          result = await fetchTopStations(50);
          
          const congoStations = await fetchStationsByCountry("Congo", 10);
          const drcStations = await fetchStationsByCountry("Democratic Republic of the Congo", 10);
          
          if (congoStations.length > 0 || drcStations.length > 0) {
            result = [...congoStations, ...drcStations, ...result];
            result = result.filter((station, index, self) => 
              index === self.findIndex((s) => s.id === station.id)
            );
          }
        }
        
        setStations(result);
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStations();
  }, [debouncedSearchQuery, selectedCountry, selectedCategory]);
  
  const handleMenuClick = () => {
    setDrawerOpen(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-gowera-background pb-24">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onMenuClick={handleMenuClick}
      />
      
      <main className="flex-1 container px-4 py-6 md:px-6">
        <div className="mb-8 space-y-4">
          <CountryFilter 
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
          
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">
            {debouncedSearchQuery
              ? `Search results for "${debouncedSearchQuery}"`
              : selectedCountry
              ? `Radio stations in ${selectedCountry}`
              : selectedCategory
              ? `${selectedCategory} radio stations`
              : "Popular radio stations"}
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-gowera-highlight" />
            </div>
          ) : stations.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium text-gray-300">No stations found</h3>
              <p className="mt-2 text-gray-400">Try changing your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {stations.map((station) => (
                <RadioCard key={station.id} station={station} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="h-[85%]">
          <DrawerHeader className="border-b border-white/10">
            <DrawerTitle className="text-white">Menu supplémentaire</DrawerTitle>
            <DrawerClose className="absolute right-4 top-4" />
          </DrawerHeader>
          <ScrollArea className="h-full p-6">
            <div className="space-y-6">
              <div className="bg-gowera-surface p-4 rounded-lg">
                <h3 className="font-bold text-white mb-4">Découvrez par genre</h3>
                <ul className="space-y-3">
                  {['Pop', 'Rock', 'Jazz', 'Hip Hop', 'Classical', 'Electronic', 'Reggae', 'Blues', 'Folk'].map((genre) => (
                    <li key={genre} className="text-gray-300 hover:text-gowera-highlight cursor-pointer transition-colors flex items-center">
                      <ChevronRight size={16} className="mr-2" />
                      {genre}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gowera-surface p-4 rounded-lg">
                <h3 className="font-bold text-white mb-4">Radios tendances</h3>
                <ul className="space-y-3">
                  {['Radio Okapi', 'Radio France', 'BBC World Service', 'Voice of America', 'RFI Afrique'].map((station) => (
                    <li key={station} className="text-gray-300 hover:text-gowera-highlight cursor-pointer transition-colors flex items-center">
                      <ChevronRight size={16} className="mr-2" />
                      {station}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gowera-surface p-4 rounded-lg">
                <h3 className="font-bold text-white mb-4">Continents</h3>
                <ul className="space-y-3">
                  {['Africa', 'Europe', 'North America', 'South America', 'Asia', 'Oceania'].map((continent) => (
                    <li key={continent} className="text-gray-300 hover:text-gowera-highlight cursor-pointer transition-colors flex items-center">
                      <ChevronRight size={16} className="mr-2" />
                      {continent}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
      
      {currentStation && <RadioPlayer />}
    </div>
  );
};

export default Index;
