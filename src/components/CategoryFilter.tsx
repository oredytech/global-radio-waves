
import React, { useState, useEffect } from "react";
import { Music } from "lucide-react";
import { CategoryInfo, fetchCategories } from "@/services/radioService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      setIsLoading(false);
    };
    
    loadCategories();
  }, []);

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <Music className="h-5 w-5" />
        <h2 className="text-lg font-bold">Categories</h2>
      </div>
      
      <ScrollArea className="whitespace-nowrap pb-2">
        <div className="flex space-x-2">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"} 
            size="sm"
            className="whitespace-nowrap"
            onClick={() => onSelectCategory(null)}
          >
            All Categories
          </Button>
          
          {isLoading ? (
            <div className="flex space-x-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : (
            categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => onSelectCategory(category.name)}
              >
                {category.name}
                <span className="ml-1 text-xs opacity-60">({category.stationCount})</span>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
