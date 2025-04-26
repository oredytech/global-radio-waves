
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Shuffle } from "lucide-react";
import { fetchCategories } from "@/services/metadataService";
import GenreCard from "@/components/genres/GenreCard";
import { CategoryInfo } from "@/services/types/radioTypes";
import GenresGrid from "@/components/genres/GenresGrid";
import GenresHeader from "@/components/genres/GenresHeader";

const GenresExplorer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "name">("popular");

  const { data: genres = [], isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: () => fetchCategories(100),
  });

  const filteredGenres = genres
    .filter((genre) =>
      genre.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "popular") {
        return b.stationCount - a.stationCount;
      }
      return a.name.localeCompare(b.name);
    });

  const handleRandomGenre = () => {
    if (filteredGenres.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredGenres.length);
      const randomGenre = filteredGenres[randomIndex];
      // Navigate to the genre's stations
      window.location.href = `/stations/genre/${randomGenre.name}`;
    }
  };

  return (
    <div className="container mx-auto px-4 pt-16 pb-32">
      <GenresHeader />
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder="Tapez votre vibe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/20 border-white/10 text-white"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex-1 md:flex-none"
            onClick={() => setSortBy(sortBy === "popular" ? "name" : "popular")}
          >
            Trier par {sortBy === "popular" ? "nom" : "popularité"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 md:flex-none"
            onClick={handleRandomGenre}
          >
            <Shuffle className="mr-2" size={18} />
            Surprends-moi
          </Button>
        </div>
      </div>

      <GenresGrid genres={filteredGenres} isLoading={isLoading} />
    </div>
  );
};

export default GenresExplorer;
