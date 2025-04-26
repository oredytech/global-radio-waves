
import React from "react";
import { Loader2 } from "lucide-react";
import { RadioStation } from "@/services/radioService";
import SeeAllButton from "@/components/SeeAllButton";

interface TrendingStationsProps {
  stations: RadioStation[];
  isLoading: boolean;
}

const TrendingStations: React.FC<TrendingStationsProps> = ({ stations, isLoading }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Radios en tendance</h2>
        <SeeAllButton to="/featured" />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-gowera-highlight" size={30} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stations.map((station) => (
            <div key={station.id} className="aspect-square bg-white/10 rounded-lg overflow-hidden relative group cursor-pointer">
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
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingStations;
