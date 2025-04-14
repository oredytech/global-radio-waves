
import { CountryInfo, CategoryInfo } from "./types/radioTypes";
import { FALLBACK_COUNTRIES, FALLBACK_CATEGORIES } from "./constants/radioConstants";
import { fetchFromMultipleEndpoints } from "./utils/apiUtils";

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
