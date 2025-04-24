import React, { useState, useEffect } from "react";
import StationGrid from "@/components/StationGrid";
import { RadioStation, fetchTopStations, searchStations, fetchStationsByContinent } from "@/services/radioService";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [africanStations, setAfricanStations] = useState<RadioStation[]>([]);
  const [continentStations, setContinentStations] = useState<RadioStation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAfrican, setIsLoadingAfrican] = useState(false);
  const [isLoadingContinent, setIsLoadingContinent] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
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
    if (selectedContinent) {
      setActiveTab("continent");
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
  }, [selectedContinent]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-gowera-background pb-24">
      <main className="flex-1 container px-4 py-6 md:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 sm:w-[600px]">
            <TabsTrigger value="popular">Stations populaires</TabsTrigger>
            <TabsTrigger value="africa">Afrique</TabsTrigger>
            {selectedContinent && <TabsTrigger value="continent">{selectedContinent}</TabsTrigger>}
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
              <>
                <div className="flex items-center gap-2 mb-6">
                  <Globe className="text-gowera-highlight" />
                  <h2 className="text-2xl font-bold text-white">Radios - {selectedContinent}</h2>
                </div>
                <StationGrid
                  stations={continentStations}
                  loading={isLoadingContinent}
                  emptyTitle="Aucune station trouvée"
                  emptySubtitle="Essayez plus tard ou vérifiez votre connexion"
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
