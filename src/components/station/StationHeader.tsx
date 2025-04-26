
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
    <div className="mb-6">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-white mb-4" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Retour
      </Button>
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
        <div className="relative shrink-0">
          <img 
            src={stationImage} 
            alt={station.name} 
            className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow-xl border border-white/10"
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
        
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <Badge className="bg-white/10 text-white hover:bg-white/20">Radio</Badge>
            {stationTags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-white border-white/20">
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold text-white mt-1 break-words">{station.name}</h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-gray-300">
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-1" />
              <span className="mr-1">{countryFlag}</span>
              <span className="truncate max-w-[150px] md:max-w-full">{station.country}</span>
            </div>
            
            {localTime && (
              <div className="flex items-center text-gray-400">
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
