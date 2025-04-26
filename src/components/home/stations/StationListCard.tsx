
import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioStation } from "@/services/radioService";
import { useNavigate } from "react-router-dom";
import { generateSlug } from "@/lib/utils";

interface StationListCardProps {
  station: RadioStation;
}

const StationListCard: React.FC<StationListCardProps> = ({ station }) => {
  const navigate = useNavigate();

  const handleStationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const stationSlug = generateSlug(station.name);
    navigate(`/station-player/${stationSlug}`);
  };

  return (
    <Card 
      className="bg-white/10 border-white/10 overflow-hidden cursor-pointer"
      onClick={handleStationClick}
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
            onClick={(e) => {
              e.stopPropagation();
              handleStationClick(e);
            }}
          >
            <Play size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StationListCard;
