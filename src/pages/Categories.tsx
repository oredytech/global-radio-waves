import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import RadioCard from "@/components/RadioCard";
import { CategoryInfo, RadioStation, fetchCategories, fetchStationsByTag } from "@/services/radioService";
import { Loader2 } from "lucide-react";

interface CategoriesProps {
  
}

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  useEffect(() => {
    const fetchStations = async () => {
      if (selectedCategory) {
        setIsLoading(true);
        try {
          const stationsData = await fetchStationsByTag(selectedCategory);
          setStations(stationsData);
        } catch (error) {
          console.error(`Error fetching stations for category ${selectedCategory}:`, error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStations();
  }, [selectedCategory]);

  const handleMenuClick = () => {
    // Menu handling can be implemented here if needed
    console.log("Menu clicked from Categories page");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-gowera-background">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onMenuClick={handleMenuClick}
      />
      
      <main className="flex-1 container px-4 py-6 md:px-6">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">
            {selectedCategory ? `${selectedCategory} radio stations` : "Radio Categories"}
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-gowera-highlight" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {selectedCategory ? (
                stations.map((station) => (
                  <RadioCard key={station.id} station={station} />
                ))
              ) : (
                categories.map((category) => (
                  <div key={category.name} className="cursor-pointer" onClick={() => setSelectedCategory(category.name)}>
                    <div className="bg-gowera-surface p-4 rounded-lg">
                      <h3 className="font-medium text-sm truncate text-white">{category.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{category.stationCount} stations</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Categories;
