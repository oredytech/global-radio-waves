
import React, { useState, useEffect } from "react";
import StationGrid from "@/components/StationGrid";
import MenuDrawer from "@/components/MenuDrawer";
import IndexHeader from "@/components/IndexHeader";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-gowera-background pb-24">
      <IndexHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} onMenuClick={handleMenuClick} />
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
            <StationGrid
              stations={stations}
              loading={isLoading}
              emptyTitle="Aucune station trouvée"
              emptySubtitle="Essayez de modifier votre recherche"
            />
          </TabsContent>

          <TabsContent value="africa">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="text-gowera-highlight" />
              <h2 className="text-2xl font-bold text-white">Radios africaines</h2>
            </div>
            <StationGrid
              stations={africanStations}
              loading={isLoadingAfrican}
              emptyTitle="Aucune station africaine trouvée"
              emptySubtitle="Essayez plus tard ou vérifiez votre connexion"
            />
          </TabsContent>

          <TabsContent value="continent">
            {selectedContinent && (
              <div className="flex items-center gap-2 mb-6">
                <Globe className="text-gowera-highlight" />
                <h2 className="text-2xl font-bold text-white">Radios - {selectedContinent}</h2>
              </div>
            )}
            <StationGrid
              stations={continentStations}
              loading={isLoadingContinent}
              emptyTitle="Aucune station trouvée"
              emptySubtitle="Essayez plus tard ou vérifiez votre connexion"
            />
          </TabsContent>
        </Tabs>
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
