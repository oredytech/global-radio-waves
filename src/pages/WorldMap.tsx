
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Search, Map, List, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/useDebounce";
import { CountryInfo, fetchCountries } from "@/services/radioService";
import CountryCard from "@/components/world/CountryCard";
import CountryList from "@/components/world/CountryList";
import IndexHeader from "@/components/IndexHeader";
import { RadioPlayer } from "@/components/RadioPlayer";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { toast } from "sonner";

const continents = [
  { name: "Tous", value: "all" },
  { name: "Afrique", value: "africa" },
  { name: "Amérique", value: "america" },
  { name: "Asie", value: "asia" },
  { name: "Europe", value: "europe" },
  { name: "Océanie", value: "oceania" },
];

// Map countries to continents
const getContinentForCountry = (countryName: string): string => {
  const africanCountries = ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", 
    "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", 
    "Chad", "Comoros", "Congo", "Democratic Republic of the Congo", 
    "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", 
    "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", 
    "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", 
    "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", 
    "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", 
    "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", 
    "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", 
    "Zambia", "Zimbabwe"];
  
  const asianCountries = ["Afghanistan", "Armenia", "Azerbaijan", "Bahrain", 
    "Bangladesh", "Bhutan", "Brunei", "Cambodia", "China", "Cyprus", 
    "Georgia", "India", "Indonesia", "Iran", "Iraq", "Israel", "Japan", 
    "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", 
    "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal", "North Korea", 
    "Oman", "Pakistan", "Palestine", "Philippines", "Qatar", "Saudi Arabia", 
    "Singapore", "South Korea", "Sri Lanka", "Syria", "Taiwan", "Tajikistan", 
    "Thailand", "Timor-Leste", "Turkey", "Turkmenistan", "United Arab Emirates", 
    "Uzbekistan", "Vietnam", "Yemen"];
  
  const europeanCountries = ["Albania", "Andorra", "Austria", "Belarus", 
    "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Czech Republic", 
    "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", 
    "Iceland", "Ireland", "Italy", "Latvia", "Liechtenstein", "Lithuania", 
    "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", 
    "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", 
    "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", 
    "Switzerland", "Ukraine", "United Kingdom", "Vatican City"];
  
  const oceaniaCountries = ["Australia", "Fiji", "Kiribati", "Marshall Islands", 
    "Micronesia", "Nauru", "New Zealand", "Palau", "Papua New Guinea", 
    "Samoa", "Solomon Islands", "Tonga", "Tuvalu", "Vanuatu"];
  
  // All other countries are considered America (North and South combined)
  if (africanCountries.some(c => countryName.includes(c))) return "africa";
  if (asianCountries.some(c => countryName.includes(c))) return "asia";
  if (europeanCountries.some(c => countryName.includes(c))) return "europe";
  if (oceaniaCountries.some(c => countryName.includes(c))) return "oceania";
  
  // Default to America for any country not in the other lists
  return "america";
};

// Get continent-based color
const getContinentColor = (continent: string): string => {
  switch (continent) {
    case "africa": return "bg-gradient-to-br from-emerald-400/40 to-emerald-600/40";
    case "america": return "bg-gradient-to-br from-red-400/40 to-red-600/40";
    case "asia": return "bg-gradient-to-br from-yellow-400/40 to-yellow-600/40";
    case "europe": return "bg-gradient-to-br from-blue-400/40 to-blue-600/40";
    case "oceania": return "bg-gradient-to-br from-purple-400/40 to-purple-600/40";
    default: return "bg-gradient-to-br from-gray-400/40 to-gray-600/40";
  }
};

const WorldMap: React.FC = () => {
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<CountryInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContinent, setSelectedContinent] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showDrawer, setShowDrawer] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const navigate = useNavigate();
  const { currentStation } = useAudioPlayer();

  useEffect(() => {
    const loadCountries = async () => {
      setIsLoading(true);
      try {
        const fetchedCountries = await fetchCountries(200);
        // Add continent info to each country
        const countriesWithContinent = fetchedCountries.map(country => ({
          ...country,
          continent: getContinentForCountry(country.name)
        }));
        
        setCountries(countriesWithContinent);
        setFilteredCountries(countriesWithContinent);
      } catch (error) {
        console.error("Error loading countries:", error);
        toast.error("Erreur lors du chargement des pays");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCountries();
  }, []);
  
  useEffect(() => {
    let result = [...countries];
    
    // Apply search filter
    if (debouncedSearchQuery) {
      result = result.filter(country => 
        country.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }
    
    // Apply continent filter
    if (selectedContinent !== "all") {
      result = result.filter(country => country.continent === selectedContinent);
    }
    
    // Sort countries alphabetically
    result.sort((a, b) => a.name.localeCompare(b.name));
    
    setFilteredCountries(result);
  }, [debouncedSearchQuery, countries, selectedContinent]);
  
  const handleCountryClick = (country: CountryInfo) => {
    navigate(`/countries?country=${encodeURIComponent(country.name)}`);
  };
  
  const handleRandomCountry = () => {
    if (filteredCountries.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredCountries.length);
      const randomCountry = filteredCountries[randomIndex];
      navigate(`/countries?country=${encodeURIComponent(randomCountry.name)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-gowera-background pb-20">
      <IndexHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onMenuClick={() => setShowDrawer(true)}
      />
      
      <main className="flex-1 container px-4 py-6 md:px-6">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Explorez par pays</h1>
            <p className="text-gray-400 italic">
              "Un monde, des millions de mélodies. Où écouterez-vous aujourd'hui ?"
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10 bg-muted/50 text-white border-0 focus-visible:ring-0 w-full md:w-80"
                placeholder="Rechercher un pays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Tabs defaultValue="all" className="w-full md:w-auto">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
                  {continents.map((continent) => (
                    <TabsTrigger 
                      key={continent.value} 
                      value={continent.value}
                      onClick={() => setSelectedContinent(continent.value)}
                      className="text-xs md:text-sm"
                    >
                      {continent.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewMode === "grid" ? "bg-muted/50" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  <Map size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewMode === "list" ? "bg-muted/50" : ""}
                  onClick={() => setViewMode("list")}
                >
                  <List size={20} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4 md:p-6 backdrop-blur-sm border border-white/5">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gowera-highlight" />
              </div>
            ) : filteredCountries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-lg text-gray-400">Aucun pays trouvé</p>
                <Button 
                  variant="link" 
                  onClick={() => { 
                    setSearchQuery("");
                    setSelectedContinent("all");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredCountries.map((country) => (
                  <CountryCard 
                    key={country.name}
                    country={country}
                    onClick={() => handleCountryClick(country)}
                    colorClass={getContinentColor(country.continent)}
                  />
                ))}
              </div>
            ) : (
              <CountryList 
                countries={filteredCountries}
                onCountryClick={handleCountryClick}
                getColorClass={(country) => getContinentColor(country.continent)}
              />
            )}
          </div>
          
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleRandomCountry}
              className="group"
            >
              <span className="mr-2">🎲</span>
              Découvrir un pays aléatoire
              <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500 italic mt-4">
            "Chaque pays cache un chant. Trouvez-le."
          </div>
        </div>
      </main>
      
      {currentStation && <RadioPlayer />}
    </div>
  );
};

export default WorldMap;
