
import React from "react";
import { CategoryInfo } from "@/services/types/radioTypes";
import { Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GenreCardProps {
  genre: CategoryInfo;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre }) => {
  const navigate = useNavigate();
  
  return (
    <div
      onClick={() => navigate(`/stations/genre/${genre.name}`)}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-black/40 to-black/20 border border-white/10 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-white/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Music className="text-primary" size={24} />
          <span className="text-sm text-gray-400">{genre.stationCount} stations</span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{genre.name}</h3>
        
        <div className="mt-4">
          <span className="text-sm text-primary hover:text-primary/80 transition-colors">
            Explorer le genre →
          </span>
        </div>
      </div>
    </div>
  );
};

export default GenreCard;
