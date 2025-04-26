
import React from "react";
import { RadioStation } from "@/services/radioService";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import SeeAllButton from "@/components/SeeAllButton";

interface RecentlyPlayedProps {
  stations: RadioStation[];
}

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({ stations }) => {
  const { loadStation } = useAudioPlayer();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Écoutées récemment</h2>
        <SeeAllButton to="/recent" />
      </div>

      <div className="flex overflow-x-auto space-x-4 pb-4 snap-x">
        {stations.slice(0, 10).map((station) => (
          <div 
            key={station.id} 
            className="min-w-[160px] rounded-lg bg-white/10 p-3 flex flex-col items-center text-center snap-start cursor-pointer"
            onClick={() => loadStation(station)}
          >
            <div className="h-16 w-16 rounded-full bg-black/30 mb-3 overflow-hidden">
              <img 
                src={station.favicon || "https://placehold.co/100x100/333/888?text=Radio"}
                alt={station.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/100x100/333/888?text=Radio";
                }}
              />
            </div>
            <h3 className="text-sm font-medium text-white truncate w-full">{station.name}</h3>
            <p className="text-xs text-gray-400 truncate w-full">{station.country}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayed;
