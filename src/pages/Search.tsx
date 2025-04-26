
import React, { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RadioStation, searchStations } from "@/services/radioService";
import { useDebounce } from "@/hooks/useDebounce";
import StationGrid from "@/components/StationGrid";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchStations(debouncedQuery);
        setResults(searchResults);
      } catch (error) {
        console.error("Error searching stations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-gowera-background pb-24">
      <main className="flex-1 container px-4 py-6 md:px-6">
        <div className="mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10 bg-white/10 border-white/10 text-white focus-visible:ring-gowera-highlight placeholder:text-gray-400 h-12 rounded-xl"
              placeholder="Rechercher des radios par nom, pays, genre..."
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {debouncedQuery ? (
          <div>
            <h2 className="text-lg font-medium mb-4 text-white">
              {results.length > 0
                ? `Résultats pour "${debouncedQuery}"`
                : `Aucun résultat pour "${debouncedQuery}"`}
            </h2>
            <StationGrid
              stations={results}
              loading={isLoading}
              emptyTitle="Aucune radio trouvée"
              emptySubtitle="Essayez d'autres termes de recherche"
            />
          </div>
        ) : (
          <div className="py-10 text-center">
            <SearchIcon className="mx-auto text-gray-500 mb-4" size={48} />
            <h2 className="text-xl font-medium text-gray-300">
              Recherchez des radios
            </h2>
            <p className="mt-2 text-gray-400">
              Entrez le nom d'une radio, un pays, un genre musical...
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
