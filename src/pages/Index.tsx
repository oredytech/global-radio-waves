
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const featuredStations = [
    {
      id: "rfi",
      name: "RFI",
      logo: "/lovable-uploads/96fff88a-d602-42fe-8555-3b75a3e05ad4.png",
      link: "/station/rfi"
    },
    {
      id: "bbc",
      name: "BBC NEWS",
      logo: "/lovable-uploads/96fff88a-d602-42fe-8555-3b75a3e05ad4.png",
      link: "/station/bbc"
    },
    {
      id: "europe1",
      name: "EUROPE 1",
      logo: "/lovable-uploads/96fff88a-d602-42fe-8555-3b75a3e05ad4.png",
      link: "/station/europe1"
    },
    {
      id: "okapi",
      name: "OKAPI",
      logo: "/lovable-uploads/96fff88a-d602-42fe-8555-3b75a3e05ad4.png",
      link: "/station/okapi"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 z-10" />
        <img
          src="/lovable-uploads/96fff88a-d602-42fe-8555-3b75a3e05ad4.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 container mx-auto px-4 py-6 flex flex-col min-h-screen">
          <div className="mt-auto mb-32">
            <div className="relative max-w-lg mx-auto mb-8">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Rechercher une radio"
                  className="w-full h-12 pl-12 pr-12 rounded-full bg-white/20 backdrop-blur-md text-white placeholder:text-white/70 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={20} />
                <Button 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
              {featuredStations.map((station) => (
                <a
                  key={station.id}
                  href={station.link}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <img
                      src={station.logo}
                      alt={station.name}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <span className="text-xs text-white font-medium">{station.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white py-2 px-4 z-30">
        <p className="text-sm text-center font-medium text-gray-600">Actualités</p>
      </div>
    </div>
  );
};

export default Index;
