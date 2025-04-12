
import { toast } from "sonner";

export interface RadioStation {
  id: string;
  name: string;
  url: string;
  favicon: string;
  country: string;
  language: string;
  tags: string[];
  votes: number;
  clickCount: number;
}

export interface CountryInfo {
  name: string;
  code: string;
  stationCount: number;
}

export interface CategoryInfo {
  name: string;
  stationCount: number;
}

// Multiple API endpoints for redundancy
const API_ENDPOINTS = [
  "https://de1.api.radio-browser.info/json",
  "https://fr1.api.radio-browser.info/json",
  "https://nl1.api.radio-browser.info/json"
];

// Fallback data for countries
const FALLBACK_COUNTRIES: CountryInfo[] = [
  { name: "Congo", code: "CG", stationCount: 10 },
  { name: "Democratic Republic of the Congo", code: "CD", stationCount: 15 },
  { name: "France", code: "FR", stationCount: 500 },
  { name: "United States", code: "US", stationCount: 1000 },
  { name: "United Kingdom", code: "GB", stationCount: 400 },
  { name: "Germany", code: "DE", stationCount: 300 },
  { name: "Canada", code: "CA", stationCount: 200 },
  { name: "Australia", code: "AU", stationCount: 150 },
  { name: "Brazil", code: "BR", stationCount: 180 },
  { name: "Japan", code: "JP", stationCount: 120 }
];

// Fallback data for categories
const FALLBACK_CATEGORIES: CategoryInfo[] = [
  { name: "News", stationCount: 500 },
  { name: "Music", stationCount: 2000 },
  { name: "Talk", stationCount: 300 },
  { name: "Sports", stationCount: 150 },
  { name: "Culture", stationCount: 100 },
  { name: "Pop", stationCount: 400 },
  { name: "Rock", stationCount: 350 },
  { name: "Jazz", stationCount: 200 },
  { name: "Classical", stationCount: 180 },
  { name: "Hip Hop", stationCount: 250 }
];

// Fallback stations for when API fails
const FALLBACK_STATIONS: RadioStation[] = [
  {
    id: "fallback-1",
    name: "Radio Congo",
    url: "https://streamingv2.shoutcast.com/radio-congo",
    favicon: "https://placehold.co/100x100/333/888?text=Radio+Congo",
    country: "Congo",
    language: "French",
    tags: ["news", "music"],
    votes: 10,
    clickCount: 50
  },
  {
    id: "fallback-2",
    name: "DRC FM",
    url: "https://streamingv2.shoutcast.com/drc-fm",
    favicon: "https://placehold.co/100x100/333/888?text=DRC+FM",
    country: "Democratic Republic of the Congo",
    language: "French",
    tags: ["news", "talk"],
    votes: 15,
    clickCount: 75
  },
  {
    id: "fallback-3",
    name: "France Info",
    url: "https://direct.franceinfo.fr/live/franceinfo-midfi.mp3",
    favicon: "https://placehold.co/100x100/333/888?text=France+Info",
    country: "France",
    language: "French",
    tags: ["news"],
    votes: 100,
    clickCount: 5000
  },
  {
    id: "fallback-4",
    name: "BBC World Service",
    url: "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service",
    favicon: "https://placehold.co/100x100/333/888?text=BBC",
    country: "United Kingdom",
    language: "English",
    tags: ["news"],
    votes: 200,
    clickCount: 10000
  },
  {
    id: "fallback-5",
    name: "CNN Radio",
    url: "https://tunein.com/cnn/",
    favicon: "https://placehold.co/100x100/333/888?text=CNN",
    country: "United States",
    language: "English",
    tags: ["news"],
    votes: 150,
    clickCount: 8000
  }
];

// Attempt to fetch from multiple endpoints until one succeeds
async function fetchFromMultipleEndpoints(path: string): Promise<any> {
  let lastError = null;
  
  for (const endpoint of API_ENDPOINTS) {
    try {
      const response = await fetch(`${endpoint}${path}`, {
        headers: {
          'User-Agent': 'GOWERA-Radio-App/1.0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      lastError = error;
      console.error(`Failed to fetch from ${endpoint}${path}`, error);
    }
  }
  
  throw lastError || new Error("All API endpoints failed");
}

// Handle API errors and provide user feedback
const handleApiError = (error: any, message: string) => {
  console.error(message, error);
  toast.error(`Error: ${message}. Using backup data.`);
  return [];
};

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

export const fetchCountries = async (limit: number = 50): Promise<CountryInfo[]> => {
  try {
    const data = await fetchFromMultipleEndpoints(`/countries`);
    if (data && data.length > 0) {
      return data
        .filter((country: any) => country.stationcount > 5)
        .sort((a: any, b: any) => b.stationcount - a.stationcount)
        .slice(0, limit)
        .map((country: any) => ({
          name: country.name,
          code: country.iso_3166_1,
          stationCount: country.stationcount
        }));
    } else {
      throw new Error("No country data returned from API");
    }
  } catch (error) {
    console.warn("Using fallback countries due to API error", error);
    return FALLBACK_COUNTRIES;
  }
};

export const fetchCategories = async (limit: number = 20): Promise<CategoryInfo[]> => {
  try {
    const data = await fetchFromMultipleEndpoints(`/tags`);
    if (data && data.length > 0) {
      return data
        .filter((tag: any) => tag.stationcount > 100)
        .sort((a: any, b: any) => b.stationcount - a.stationcount)
        .slice(0, limit)
        .map((tag: any) => ({
          name: tag.name,
          stationCount: tag.stationcount
        }));
    } else {
      throw new Error("No category data returned from API");
    }
  } catch (error) {
    console.warn("Using fallback categories due to API error", error);
    return FALLBACK_CATEGORIES;
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
