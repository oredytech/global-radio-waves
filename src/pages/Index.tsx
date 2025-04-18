import React, { useState, useEffect } from "react";
import RadioCard from "@/components/RadioCard";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { 
  RadioStation, 
  fetchTopStations, 
  searchStations,
  fetchAfricanStations,
  fetchStationsByContinent
} from "@/services/radioService";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, Globe } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [africanStations, setAfricanStations] = useState<RadioStation[]>([]);
  const [continentStations, setContinentStations] = useState<RadioStation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAfrican, setIsLoadingAfrican] = useState(false);
  const [isLoadingContinent, setIsLoadingContinent] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  
  const isMobile = useIsMobile();
  const { currentStation } = useAudioPlayer();
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
    const fetchStations = async () => {
      setIsLoading(true);
      let result: RadioStation[] = [];
      
      try {
        if (debouncedSearchQuery) {
          result = await searchStations(debouncedSearchQuery);
        } else {
          result = await fetchTopStations(50);
        }
        
        setStations(result);
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStations();
  }, [debouncedSearchQuery]);
  
  useEffect(() => {
    if (activeTab === "africa") {
      const fetchAfrican = async () => {
        setIsLoadingAfrican(true);
        try {
          const result = await fetchAfricanStations(50);
          setAfricanStations(result);
        } catch (error) {
          console.error("Error fetching African stations:", error);
        } finally {
          setIsLoadingAfrican(false);
        }
      };
      
      fetchAfrican();
    }
  }, [activeTab]);
  
  useEffect(() => {
    if (selectedContinent && activeTab === "continent") {
      const fetchContinentStations = async () => {
        setIsLoadingContinent(true);
        try {
          const englishName = continentMapping[selectedContinent] || selectedContinent;
          const result = await fetchStationsByContinent(englishName, 50);
          setContinentStations(result);
        } catch (error) {
          console.error(`Error fetching stations for ${selectedContinent}:`, error);
        } finally {
          setIsLoadingContinent(false);
        }
      };
      
      fetchContinentStations();
    }
  }, [selectedContinent, activeTab]);
  
  const handleMenuClick = () => {
    setDrawerOpen(true);
  };
  
  const handleContinentClick = (continent: string) => {
    setSelectedContinent(continent);
    setActiveTab("continent");
    setDrawerOpen(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-gowera-background pb-24">
      <main className="flex-1 container px-4 py-6 md:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
            <TabsTrigger value="popular">Stations populaires</TabsTrigger>
            <TabsTrigger value="africa">Afrique</TabsTrigger>
          </TabsList>

          <TabsContent value="popular">
            <h2 className="text-2xl font-bold mb-6 text-white">
              {debouncedSearchQuery
                ? `Résultats pour "${debouncedSearchQuery}"`
                : "Stations de radio populaires"}
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-gowera-highlight" />
              </div>
            ) : stations.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-gray-300">Aucune station trouvée</h3>
                <p className="mt-2 text-gray-400">Essayez de modifier votre recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {stations.map((station) => (
                  <RadioCard key={station.id} station={station} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="africa">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="text-gowera-highlight" />
              <h2 className="text-2xl font-bold text-white">Radios africaines</h2>
            </div>
            
            {isLoadingAfrican ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-gowera-highlight" />
              </div>
            ) : africanStations.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-gray-300">Aucune station africaine trouvée</h3>
                <p className="mt-2 text-gray-400">Essayez plus tard ou vérifiez votre connexion</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {africanStations.map((station) => (
                  <RadioCard key={station.id} station={station} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="continent">
            {selectedContinent && (
              <div className="flex items-center gap-2 mb-6">
                <Globe className="text-gowera-highlight" />
                <h2 className="text-2xl font-bold text-white">Radios - {selectedContinent}</h2>
              </div>
            )}
            
            {isLoadingContinent ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-gowera-highlight" />
              </div>
            ) : continentStations.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-gray-300">Aucune station trouvée</h3>
                <p className="mt-2 text-gray-400">Essayez plus tard ou vérifiez votre connexion</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {continentStations.map((station) => (
                  <RadioCard key={station.id} station={station} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
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
                <h3 className="font-bold text-white mb-4">Découvrez par continent</h3>
                <ul className="space-y-3">
                  {continents.map((continent) => (
                    <li 
                      key={continent} 
                      className={`text-gray-300 hover:text-gowera-highlight cursor-pointer transition-colors flex items-center ${continent === selectedContinent ? 'text-gowera-highlight font-medium' : ''}`}
                      onClick={() => handleContinentClick(continent)}
                    >
                      <ChevronRight size={16} className="mr-2" />
                      {continent}
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
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Index;
