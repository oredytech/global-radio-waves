import { RadioStation } from "./types/radioTypes";
import { FALLBACK_STATIONS } from "./constants/radioConstants";
import { fetchFromMultipleEndpoints, handleApiError } from "./utils/apiUtils";

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

export const fetchNewsStations = async (limit: number = 20): Promise<RadioStation[]> => {
  try {
    const data = await fetchFromMultipleEndpoints(`/stations/bytag/news?limit=${limit}&hidebroken=true`);
    return data.length > 0 ? data : FALLBACK_STATIONS.filter(s => s.tags.includes("news"));
  } catch (error) {
    console.warn(`Using fallback news stations due to API error`, error);
    return FALLBACK_STATIONS.filter(s => s.tags.includes("news"));
  }
};

const AFRICAN_COUNTRIES = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", 
  "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", 
  "Chad", "Comoros", "Congo", "Democratic Republic of the Congo", 
  "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", 
  "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", 
  "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", 
  "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", 
  "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", 
  "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", 
  "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", 
  "Zambia", "Zimbabwe"
];

export const fetchAfricanStations = async (limit: number = 100): Promise<RadioStation[]> => {
  try {
    let allStations: RadioStation[] = [];
    
    const majorCountries = ["South Africa", "Nigeria", "Kenya", "Ghana", "Egypt", "Morocco", "Tanzania", "Congo", "Democratic Republic of the Congo"];
    
    for (const country of majorCountries) {
      try {
        const countryStations = await fetchFromMultipleEndpoints(`/stations/bycountry/${country}?limit=${Math.ceil(limit / majorCountries.length)}&hidebroken=true`);
        if (countryStations && countryStations.length > 0) {
          allStations = [...allStations, ...countryStations];
        }
      } catch (error) {
        console.warn(`Error fetching stations for ${country}`, error);
      }
    }
    
    if (allStations.length > 0) {
      return allStations.slice(0, limit);
    }
    
    return FALLBACK_STATIONS.filter(s => 
      AFRICAN_COUNTRIES.some(country => 
        s.country.includes(country)
      )
    );
  } catch (error) {
    console.warn("Using fallback African stations due to API error", error);
    return FALLBACK_STATIONS.filter(s => 
      AFRICAN_COUNTRIES.some(country => 
        s.country.includes(country)
      )
    );
  }
};
