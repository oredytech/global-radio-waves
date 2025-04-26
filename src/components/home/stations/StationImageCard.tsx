
import React from "react";
import { RadioStation } from "@/services/radioService";
import { useNavigate } from "react-router-dom";
import { generateSlug } from "@/lib/utils";

interface StationImageCardProps {
  station: RadioStation;
}

const StationImageCard: React.FC<StationImageCardProps> = ({ station }) => {
  const navigate = useNavigate();

  const handleStationClick = () => {
    const stationSlug = generateSlug(station.name);
    navigate(`/station/${stationSlug}`);
  };

  return (
    <div 
      className="aspect-square bg-white/10 rounded-lg overflow-hidden relative group cursor-pointer"
      onClick={handleStationClick}
    >
      <img 
        src={station.favicon || "https://placehold.co/100x100/333/888?text=Radio"} 
        alt={station.name}
        className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://placehold.co/100x100/333/888?text=Radio";
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-2">
        <div className="bg-black/60 p-2 rounded-lg backdrop-blur-sm">
          <h3 className="text-sm font-medium text-white truncate">{station.name}</h3>
          <p className="text-xs text-gray-300 truncate">{station.country}</p>
        </div>
      </div>
    </div>
  );
};

export default StationImageCard;
