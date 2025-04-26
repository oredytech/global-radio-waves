
import React from "react";
import { RadioStation } from "@/services/radioService";
import { Globe, Headphones, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StationMetadataProps {
  station: RadioStation;
}

const StationMetadata: React.FC<StationMetadataProps> = ({ station }) => {
  const openWebsite = (url: string) => {
    if (!url) return;
    
    // Add http:// if it doesn't have it
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = 'http://' + url;
    }
    
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  // Extract bitrate from url or use a default
  const getBitrate = () => {
    // Just for display - in a real app you'd get this from the API
    return "128 kbps";
  };
  
  // Estimate listeners based on votes and clicks
  const getListeners = () => {
    if (typeof station.votes === 'number' && typeof station.clickCount === 'number') {
      // Simple algorithm to estimate current listeners
      const estimatedListeners = Math.floor((station.votes * 2 + station.clickCount / 10) / 2);
      return estimatedListeners > 0 ? estimatedListeners : "Inconnu";
    }
    return "Inconnu";
  };

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Informations techniques</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Pays</span>
          <span className="text-white font-medium">{station.country || "Non spécifié"}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Langue</span>
          <span className="text-white font-medium">{station.language || "Non spécifiée"}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Qualité audio</span>
          <span className="text-white font-medium">{getBitrate()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Auditeurs</span>
          <span className="text-white font-medium">{getListeners()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Votes</span>
          <span className="text-white font-medium">{station.votes || 0}</span>
        </div>
        
        {station.url && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 border-white/20 text-white hover:bg-white/10"
              onClick={() => openWebsite(station.url)}
            >
              <Globe className="h-4 w-4" />
              Flux Audio Direct
            </Button>
          </div>
        )}
        
        {/* Site web - if homepage is available */}
        {station.homepage && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 border-white/20 text-white hover:bg-white/10"
              onClick={() => openWebsite(station.homepage)}
            >
              <Globe className="h-4 w-4" />
              Site Officiel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationMetadata;
