
import React from "react";
import { RadioStation } from "@/services/radioService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SimilarStationsCarouselProps {
  stations: RadioStation[];
}

const SimilarStationsCarousel: React.FC<SimilarStationsCarouselProps> = ({ stations }) => {
  const navigate = useNavigate();
  
  // Helper function to generate station URL
  const generateStationUrl = (station: RadioStation) => {
    const slug = station.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    return `/station-player/${slug}`;
  };

  const handleStationClick = (station: RadioStation) => {
    navigate(generateStationUrl(station));
  };

  if (stations.length === 0) {
    return (
      <div className="text-center py-6 border border-dashed border-white/20 rounded-xl bg-black/20">
        <p className="text-gray-400">Aucune station similaire trouvée</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4">
      <div className="flex space-x-4">
        {stations.map((station) => (
          <div 
            key={station.id}
            className="flex-shrink-0 w-60 bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all cursor-pointer"
            onClick={() => handleStationClick(station)}
          >
            <div className="h-32 bg-gray-800 overflow-hidden">
              <img 
                src={station.favicon || "https://placehold.co/400x200/333/888?text=Radio"} 
                alt={station.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/400x200/333/888?text=Radio";
                }}
              />
            </div>
            
            <div className="p-3">
              <h3 className="font-semibold text-white truncate" title={station.name}>
                {station.name}
              </h3>
              
              <p className="text-xs text-gray-400 mb-2 truncate">
                {station.country}
              </p>
              
              {station.tags && station.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {station.tags.slice(0, 2).map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-white whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="flex-shrink-0 w-32 flex items-center justify-center">
          <Button 
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => navigate("/world-map")}
          >
            Voir plus <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimilarStationsCarousel;
