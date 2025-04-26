
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RadioStation } from "@/services/radioService";
import StationWaveform from './StationWaveform';

interface StationHeaderProps {
  station: RadioStation;
  stationImage: string;
  isPlaying: boolean;
  countryFlag: string;
  localTime: string;
  stationTags: string[];
}

const StationHeader: React.FC<StationHeaderProps> = ({
  station,
  stationImage,
  isPlaying,
  countryFlag,
  localTime,
  stationTags,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-white mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Retour
      </Button>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <div className="relative shrink-0">
          <img 
            src={stationImage} 
            alt={station.name} 
            className="w-40 h-40 rounded-lg object-cover shadow-xl border border-white/10"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/800x300/333/888?text=Radio";
            }}
          />
          {isPlaying && (
            <div className="absolute -top-2 -left-2">
              <StationWaveform />
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-white/10 text-white hover:bg-white/20">Radio</Badge>
            {stationTags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-white border-white/20">
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl font-bold text-white mt-1">{station.name}</h1>
          
          <div className="flex items-center text-gray-300">
            <Globe className="h-4 w-4 mr-1" />
            <span className="mr-2">{countryFlag}</span>
            <span>{station.country}</span>
            
            {localTime && (
              <div className="ml-4 flex items-center text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>{localTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationHeader;
