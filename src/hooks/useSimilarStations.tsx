
import { useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { RadioStation } from "@/services/radioService";
import { fetchStationsByCountry, fetchStationsByTag } from "@/services/stationsService";

export const useSimilarStations = (station: RadioStation | null) => {
  // Fetch similar stations by country
  const { data: similarByCountry = [] } = useQuery({
    queryKey: ["stations", "country", station?.country],
    queryFn: () => fetchStationsByCountry(station?.country || "", 5),
    enabled: !!station?.country,
  });
  
  // Fetch similar stations by genre/tag
  const { data: similarByTag = [] } = useQuery({
    queryKey: ["stations", "tag", station?.tags[0]],
    queryFn: () => fetchStationsByTag(station?.tags[0] || "", 5),
    enabled: !!station?.tags && station.tags.length > 0,
  });

  // Filter out current station from similar stations and combine results
  const similarStations = useMemo(() => {
    if (!station) return [];
    
    const combined = [...similarByCountry, ...similarByTag]
      .filter(s => s.id !== station.id)
      .reduce((unique: RadioStation[], item) => {
        return unique.some(s => s.id === item.id) ? unique : [...unique, item];
      }, []);
      
    return combined.slice(0, 5);
  }, [similarByCountry, similarByTag, station]);

  return similarStations;
};
