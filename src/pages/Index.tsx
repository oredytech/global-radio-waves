import React, { useState, useEffect } from "react";
import StationGrid from "@/components/StationGrid";
import MenuDrawer from "@/components/MenuDrawer";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import {
  RadioStation,
  fetchTopStations,
  searchStations,
  fetchAfricanStations,
  fetchStationsByContinent
} from "@/services/radioService";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, Search, Globe, Play, ChevronRight, Radio, Headphones, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ExplorationButtons from "@/components/ExplorationButtons";
import SeeAllButton from "@/components/SeeAllButton";

const Index = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [africanStations, setAfricanStations] = useState<RadioStation[]>([]);
  const [continentStations, setContinentStations] = useState<RadioStation[]>([]);
  const [featuredStations, setFeaturedStations] = useState<RadioStation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAfrican, setIsLoadingAfrican] = useState(false);
  const [isLoadingContinent, setIsLoadingContinent] = useState(false);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  const { loadStation } = useAudioPlayer();
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

  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchStationsList = async () => {
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

  const handleMenuClick = () => setDrawerOpen(true);
  
  const handleContinentClick = (continent: string) => {
    setSelectedContinent(continent);
    setActiveTab("continent");
    setDrawerOpen(false);
  };

  const playRandomStation = async () => {
    try {
      const randomStations = await fetchTopStations(100);
      if (randomStations && randomStations.length > 0) {
        const randomIndex = Math.floor(Math.random() * randomStations.length);
        const randomStation = randomStations[randomIndex];
        loadStation(randomStation);
        toast.success("Lecture d'une station aléatoire");
      }
    } catch (error) {
      console.error("Error playing random station:", error);
      toast.error("Impossible de charger une station aléatoire");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gowera-background pb-20">
      <main className="flex-1 px-4 pt-4 pb-6">
        {/* Search Section */}
        <div className="mb-8 px-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10 bg-white/10 border-white/10 text-white focus-visible:ring-gowera-highlight placeholder:text-gray-400 h-12 rounded-xl"
              placeholder="Rechercher des radios..."
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Random Listen Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614149162883-504ce4d13909')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <h2 className="text-2xl font-bold mb-3 text-white relative z-10">Voyagez sans billet. Écoutez sans limites.</h2>
            <p className="text-gray-300 mb-4 relative z-10">Découvrez les radios du monde entier</p>
            <Button 
              onClick={playRandomStation}
              className="bg-gowera-highlight hover:bg-gowera-highlight/80 text-white rounded-full px-6 relative z-10"
            >
              <Play size={18} className="mr-2" />
              Écoute immédiate
            </Button>
          </div>
        </div>

        {/* Featured Stations */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Radios en tendance</h2>
            <SeeAllButton to="/featured" />
          </div>

          {isLoadingFeatured ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-gowera-highlight" size={30} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredStations.map((station) => (
                <div key={station.id} className="aspect-square bg-white/10 rounded-lg overflow-hidden relative group cursor-pointer">
                  <img 
                    src={station.favicon || "https://placehold.co/100x100/333/888?text=Radio"} 
                    alt={station.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/100x100/333/888?text=Radio";
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-2">
                    <div className="bg-black/60 p-2 rounded-lg backdrop-blur-sm">
                      <h3 className="text-sm font-medium text-white truncate">{station.name}</h3>
                      <p className="text-xs text-gray-300 truncate">{station.country}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        className="bg-gowera-highlight hover:bg-gowera-highlight/80 text-white rounded-full w-12 h-12 flex items-center justify-center"
                        onClick={() => loadStation(station)}
                      >
                        <Play size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Explorez par catégorie</h2>
          <ExplorationButtons />
        </div>

        {/* Recent Stations */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Écoutées récemment</h2>
            <SeeAllButton to="/recent" />
          </div>

          <div className="flex overflow-x-auto space-x-4 pb-4 snap-x">
            {stations.slice(0, 10).map((station) => (
              <div 
                key={station.id} 
                className="min-w-[160px] rounded-lg bg-white/10 p-3 flex flex-col items-center text-center snap-start cursor-pointer"
                onClick={() => loadStation(station)}
              >
                <div className="h-16 w-16 rounded-full bg-black/30 mb-3 overflow-hidden">
                  <img 
                    src={station.favicon || "https://placehold.co/100x100/333/888?text=Radio"}
                    alt={station.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/100x100/333/888?text=Radio";
                    }}
                  />
                </div>
                <h3 className="text-sm font-medium text-white truncate w-full">{station.name}</h3>
                <p className="text-xs text-gray-400 truncate w-full">{station.country}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Stations Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Stations populaires</h2>
            <SeeAllButton to="/popular" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-gowera-highlight" size={30} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stations.slice(0, 6).map((station) => (
                <Card 
                  key={station.id}
                  className="bg-white/10 border-white/10 overflow-hidden cursor-pointer"
                  onClick={() => loadStation(station)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-16 w-16 bg-black/30 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={station.favicon || "https://placehold.co/100x100/333/888?text=Radio"}
                        alt={station.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/100x100/333/888?text=Radio";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{station.name}</h3>
                      <p className="text-sm text-gray-400">{station.country}</p>
                    </div>
                    <div className="ml-auto">
                      <Button 
                        size="sm"
                        className="rounded-full w-9 h-9 p-0 bg-gowera-highlight hover:bg-gowera-highlight/80"
                      >
                        <Play size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
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
