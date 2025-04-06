
import React, { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { CountryInfo, fetchCountries } from "@/services/radioService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface CountryFilterProps {
  selectedCountry: string | null;
  onSelectCountry: (country: string | null) => void;
}

const CountryFilter: React.FC<CountryFilterProps> = ({ selectedCountry, onSelectCountry }) => {
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadCountries = async () => {
      setIsLoading(true);
      const data = await fetchCountries();
      setCountries(data);
      setIsLoading(false);
    };
    
    loadCountries();
  }, []);

  // Add Congo and DRC if they're not in the list
  useEffect(() => {
    const ensureCountries = () => {
      const congoBrazza = countries.find(c => c.name === "Congo");
      const congoKinshasa = countries.find(c => c.name === "Democratic Republic of the Congo");
      
      if (!congoBrazza || !congoKinshasa) {
        setCountries(prev => {
          const newList = [...prev];
          
          if (!congoBrazza) {
            newList.push({ name: "Congo", code: "CG", stationCount: 10 });
          }
          
          if (!congoKinshasa) {
            newList.push({ name: "Democratic Republic of the Congo", code: "CD", stationCount: 15 });
          }
          
          return newList;
        });
      }
    };
    
    if (countries.length > 0) {
      ensureCountries();
    }
  }, [countries]);

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <Globe className="h-5 w-5" />
        <h2 className="text-lg font-bold">Countries</h2>
      </div>
      
      <ScrollArea className="whitespace-nowrap pb-2">
        <div className="flex space-x-2">
          <Button 
            variant={selectedCountry === null ? "default" : "outline"} 
            size="sm" 
            className="whitespace-nowrap"
            onClick={() => onSelectCountry(null)}
          >
            All Countries
          </Button>
          
          {isLoading ? (
            <div className="flex space-x-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : (
            countries.map((country) => (
              <Button
                key={country.code}
                variant={selectedCountry === country.name ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => onSelectCountry(country.name)}
              >
                {country.name}
                <span className="ml-1 text-xs opacity-60">({country.stationCount})</span>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CountryFilter;
