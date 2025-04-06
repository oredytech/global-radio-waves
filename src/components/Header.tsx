
import React from "react";
import { Radio, Search, Globe, Music } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Radio className="w-8 h-8 text-gowera-blue" />
          <h1 className="text-2xl font-bold tracking-tighter">
            <span className="text-gowera-blue">GOW</span>
            <span className="text-gowera-gold">E</span>
            <span className="text-gowera-red">RA</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <Globe size={18} />
            <span>Discover</span>
          </div>
          <div className="flex items-center space-x-2 text-sm font-medium">
            <Music size={18} />
            <span>Categories</span>
          </div>
        </div>
        
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Search stations..."
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
