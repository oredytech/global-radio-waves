
import React from "react";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioStation } from "@/services/radioService";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import SeeAllButton from "@/components/SeeAllButton";

interface PopularStationsProps {
  stations: RadioStation[];
  isLoading: boolean;
}

const PopularStations: React.FC<PopularStationsProps> = ({ stations, isLoading }) => {
  const { loadStation } = useAudioPlayer();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Stations populaires</h2>
        <SeeAllButton to="/popular" />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-gowera-highlight" size={30} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stations.slice(0, 6).map((station) => (
            <Card 
              key={station.id}
              className="bg-white/10 border-white/10 overflow-hidden cursor-pointer"
              onClick={() => loadStation(station)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-16 w-16 bg-black/30 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={station.favicon || "https://placehold.co/100x100/333/888?text=Radio"}
                    alt={station.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/100x100/333/888?text=Radio";
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-white">{station.name}</h3>
                  <p className="text-sm text-gray-400">{station.country}</p>
                </div>
                <div className="ml-auto">
                  <Button 
                    size="sm"
                    className="rounded-full w-9 h-9 p-0 bg-gowera-highlight hover:bg-gowera-highlight/80"
                  >
                    <Play size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularStations;
