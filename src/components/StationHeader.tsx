
import React from "react";
import { Play, Pause, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { RadioStation } from "@/services/radioService";

interface StationHeaderProps {
  station: RadioStation;
  isCurrentlyPlaying: boolean;
  handlePlayClick: () => void;
}

const StationHeader: React.FC<StationHeaderProps> = ({
  station,
  isCurrentlyPlaying,
  handlePlayClick,
}) => (
  <div className="mb-8">
    <Link
      to="/"
      className="flex items-center text-gowera-highlight mb-4 hover:underline"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Retour à l'accueil
    </Link>
    <h1 className="text-3xl font-bold mb-2">Écoutez en direct</h1>
    <p className="text-gray-400">Découvrez les meilleures stations de radio en ligne</p>
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 mt-6">
      <h2 className="text-2xl font-bold mb-2 md:mb-0 text-center md:text-left">
        {station.name}
      </h2>
      <Button
        onClick={handlePlayClick}
        className="bg-gowera-highlight text-black hover:bg-gowera-highlight/90 flex items-center justify-center px-6"
      >
        {isCurrentlyPlaying ? (
          <>
            <Pause className="mr-2 h-5 w-5" /> Pause
          </>
        ) : (
          <>
            <Play className="mr-2 h-5 w-5" /> Ecouter
          </>
        )}
      </Button>
    </div>
  </div>
);

export default StationHeader;
