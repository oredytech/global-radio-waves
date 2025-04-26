
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-8 px-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-10 bg-white/10 border-white/10 text-white focus-visible:ring-gowera-highlight placeholder:text-gray-400 h-12 rounded-xl"
          placeholder="Rechercher des radios..."
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchSection;
