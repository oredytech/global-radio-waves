
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { RadioStation } from "@/services/radioService";
import StationGrid from "@/components/StationGrid";
import { useFavorites } from "@/hooks/useFavorites";
import Header from "@/components/Header";

const Favorites = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { favorites } = useFavorites();

  useEffect(() => {
    // Simulate loading for a smoother transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gowera-background pb-24">
      <Header />
      <main className="flex-1 container px-4 py-6 md:px-6">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="text-gowera-highlight" size={24} />
          <h2 className="text-2xl font-bold text-white">Vos radios favorites</h2>
        </div>

        <StationGrid
          stations={favorites}
          loading={isLoading}
          emptyTitle="Aucune radio dans vos favoris"
          emptySubtitle="Ajoutez des radios à vos favoris en cliquant sur le coeur"
        />
      </main>
    </div>
  );
};

export default Favorites;
