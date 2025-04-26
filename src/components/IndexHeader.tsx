
import React from "react";
import { Search, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface IndexHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuClick: () => void;
}

const IndexHeader: React.FC<IndexHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onMenuClick,
}) => {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="container flex flex-col items-center justify-between h-auto md:h-16 px-4 md:px-6 space-y-4 md:space-y-0">
        {isMobile ? (
          <div className="w-full flex justify-center py-2">
            <h1 className="text-2xl font-bold tracking-tighter">
              <span className="text-primary">GOWERA</span>
            </h1>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl font-bold tracking-tighter">
              <span className="text-primary">GOWERA</span>
            </h1>
            <div className="hidden md:flex items-center space-x-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/70 text-white">
                <ChevronLeft size={18} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/70 text-white">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4 w-full">
          <div className="relative w-full max-w-xs md:max-w-sm">
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                className="mr-1 text-white"
              >
                <Search size={22} />
              </Button>
            ) : (
              <>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  className="pl-10 bg-muted/50 text-white border-0 focus-visible:ring-0 placeholder:text-gray-400"
                  placeholder="Rechercher..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={onMenuClick}
          >
            <Menu size={24} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default IndexHeader;
