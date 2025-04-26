
import React from "react";
import { CategoryInfo } from "@/services/types/radioTypes";
import GenreCard from "./GenreCard";

interface GenresGridProps {
  genres: CategoryInfo[];
  isLoading: boolean;
}

const GenresGrid: React.FC<GenresGridProps> = ({ genres, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-black/20 animate-pulse rounded-xl h-48"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {genres.map((genre) => (
        <GenreCard key={genre.name} genre={genre} />
      ))}
    </div>
  );
};

export default GenresGrid;
