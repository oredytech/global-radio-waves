
import React from "react";
import { Radio, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Radio className="w-8 h-8 text-gowera-highlight" />
            <h1 className="text-2xl font-bold tracking-tighter">
              <span className="text-gowera-blue">GOW</span>
              <span className="text-gowera-gold">E</span>
              <span className="text-gowera-red">RA</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/70 text-white">
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/70 text-white">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        <div className="relative w-full max-w-xs md:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10 bg-muted/50 text-white border-0 focus-visible:ring-0 placeholder:text-gray-400"
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
