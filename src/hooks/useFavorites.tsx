
import { useState, useEffect } from 'react';
import { RadioStation } from '@/services/radioService';
import { toast } from "sonner";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<RadioStation[]>([]);

  useEffect(() => {
    // Load favorites from localStorage on mount
    const storedFavorites = localStorage.getItem('favoriteStations');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Error parsing favorites from localStorage:", e);
      }
    }
  }, []);

  const addFavorite = (station: RadioStation) => {
    const updatedFavorites = [...favorites, station];
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteStations', JSON.stringify(updatedFavorites));
    toast.success("Station ajoutée aux favoris");
  };

  const removeFavorite = (stationId: string) => {
    const updatedFavorites = favorites.filter(station => station.id !== stationId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteStations', JSON.stringify(updatedFavorites));
    toast.success("Station retirée des favoris");
  };

  const toggleFavorite = (station: RadioStation) => {
    const isExistingFavorite = favorites.some(fav => fav.id === station.id);
    
    if (isExistingFavorite) {
      removeFavorite(station.id);
    } else {
      addFavorite(station);
    }
  };

  const isFavorite = (stationId: string) => {
    return favorites.some(fav => fav.id === stationId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
};
