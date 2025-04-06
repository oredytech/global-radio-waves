
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

const API_BASE_URL = "https://de1.api.radio-browser.info/json";

// Helper function to handle API errors
const handleApiError = (error: any, message: string) => {
  console.error(message, error);
  toast.error(`Error: ${message}`);
  return [];
};

export const fetchTopStations = async (limit: number = 20): Promise<RadioStation[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stations/topvote/${limit}`);
    if (!response.ok) throw new Error("Failed to fetch top stations");
    
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error, "Could not load top stations");
  }
};

export const fetchStationsByCountry = async (country: string, limit: number = 20): Promise<RadioStation[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stations/bycountry/${country}?limit=${limit}&hidebroken=true`);
    if (!response.ok) throw new Error(`Failed to fetch stations for ${country}`);
    
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error, `Could not load stations for ${country}`);
  }
};

export const fetchStationsByTag = async (tag: string, limit: number = 20): Promise<RadioStation[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stations/bytag/${tag}?limit=${limit}&hidebroken=true`);
    if (!response.ok) throw new Error(`Failed to fetch stations for tag ${tag}`);
    
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error, `Could not load ${tag} stations`);
  }
};

export const searchStations = async (query: string, limit: number = 20): Promise<RadioStation[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stations/search?name=${query}&limit=${limit}&hidebroken=true`);
    if (!response.ok) throw new Error("Search failed");
    
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error, "Search failed");
  }
};

export const fetchCountries = async (limit: number = 50): Promise<CountryInfo[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/countries`);
    if (!response.ok) throw new Error("Failed to fetch countries");
    
    const data = await response.json();
    return data
      .filter((country: any) => country.stationcount > 5)
      .sort((a: any, b: any) => b.stationcount - a.stationcount)
      .slice(0, limit)
      .map((country: any) => ({
        name: country.name,
        code: country.iso_3166_1,
        stationCount: country.stationcount
      }));
  } catch (error) {
    return handleApiError(error, "Could not load countries");
  }
};

export const fetchCategories = async (limit: number = 20): Promise<CategoryInfo[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    
    const data = await response.json();
    return data
      .filter((tag: any) => tag.stationcount > 100)
      .sort((a: any, b: any) => b.stationcount - a.stationcount)
      .slice(0, limit)
      .map((tag: any) => ({
        name: tag.name,
        stationCount: tag.stationcount
      }));
  } catch (error) {
    return handleApiError(error, "Could not load categories");
  }
};
