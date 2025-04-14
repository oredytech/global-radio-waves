
import { RadioStation } from "./types/radioTypes";
import { FALLBACK_STATIONS } from "./constants/radioConstants";
import { fetchFromMultipleEndpoints } from "./utils/apiUtils";

export const fetchTopStations = async (limit: number = 20): Promise<RadioStation[]> => {
  try {
    const data = await fetchFromMultipleEndpoints(`/stations/topvote/${limit}`);
    return data.length > 0 ? data : FALLBACK_STATIONS;
  } catch (error) {
    console.warn("Using fallback stations due to API error", error);
    return FALLBACK_STATIONS;
  }
};

export const fetchStationsByCountry = async (country: string, limit: number = 20): Promise<RadioStation[]> => {
  try {
    const data = await fetchFromMultipleEndpoints(`/stations/bycountry/${country}?limit=${limit}&hidebroken=true`);
    return data.length > 0 ? data : FALLBACK_STATIONS.filter(s => s.country === country);
  } catch (error) {
    console.warn(`Using fallback stations for ${country} due to API error`, error);
    return FALLBACK_STATIONS.filter(s => s.country === country || s.country.includes(country));
  }
};

export const fetchStationsByTag = async (tag: string, limit: number = 20): Promise<RadioStation[]> => {
  try {
    const data = await fetchFromMultipleEndpoints(`/stations/bytag/${tag}?limit=${limit}&hidebroken=true`);
    return data.length > 0 ? data : FALLBACK_STATIONS.filter(s => s.tags.includes(tag.toLowerCase()));
  } catch (error) {
    console.warn(`Using fallback stations for ${tag} due to API error`, error);
    return FALLBACK_STATIONS.filter(s => s.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  }
};

export const searchStations = async (query: string, limit: number = 20): Promise<RadioStation[]> => {
  try {
    const data = await fetchFromMultipleEndpoints(`/stations/search?name=${query}&limit=${limit}&hidebroken=true`);
    return data.length > 0 ? data : FALLBACK_STATIONS.filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase()) || 
      s.country.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.warn(`Using fallback search for "${query}" due to API error`, error);
    return FALLBACK_STATIONS.filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase()) || 
      s.country.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Fetch news radio stations
export const fetchNewsStations = async (limit: number = 20): Promise<RadioStation[]> => {
  try {
    const data = await fetchFromMultipleEndpoints(`/stations/bytag/news?limit=${limit}&hidebroken=true`);
    return data.length > 0 ? data : FALLBACK_STATIONS.filter(s => s.tags.includes("news"));
  } catch (error) {
    console.warn(`Using fallback news stations due to API error`, error);
    return FALLBACK_STATIONS.filter(s => s.tags.includes("news"));
  }
};
