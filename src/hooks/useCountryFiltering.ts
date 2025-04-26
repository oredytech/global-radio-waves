
import { useState, useEffect } from 'react';
import { CountryInfo } from '@/services/types/radioTypes';
import { getContinentForCountry } from '@/components/world/constants';

export interface ExtendedCountryInfo extends CountryInfo {
  continent?: string;
}

export const useCountryFiltering = (initialCountries: ExtendedCountryInfo[]) => {
  const [countries, setCountries] = useState<ExtendedCountryInfo[]>(initialCountries);
  const [filteredCountries, setFilteredCountries] = useState<ExtendedCountryInfo[]>(initialCountries);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("all");

  useEffect(() => {
    let result = [...countries];
    
    if (searchQuery) {
      result = result.filter(country => 
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedContinent !== "all") {
      result = result.filter(country => country.continent === selectedContinent);
    }
    
    result.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredCountries(result);
  }, [searchQuery, countries, selectedContinent]);

  return {
    countries,
    setCountries,
    filteredCountries,
    searchQuery,
    setSearchQuery,
    selectedContinent,
    setSelectedContinent
  };
};
