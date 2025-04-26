
import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchTopStations } from "@/services/radioService";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

const RandomListenSection = () => {
  // Safely access the AudioPlayer context with error handling
  let audioPlayerContext;
  try {
    audioPlayerContext = useAudioPlayer();
  } catch (error) {
    console.error("AudioPlayerContext not available:", error);
    // Render a version without audio player functionality
    return (
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614149162883-504ce4d13909')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <h2 className="text-2xl font-bold mb-3 text-white relative z-10">Voyagez sans billet. Écoutez sans limites.</h2>
          <p className="text-gray-300 mb-4 relative z-10">Découvrez les radios du monde entier</p>
          <Button 
            className="bg-gowera-highlight hover:bg-gowera-highlight/80 text-white rounded-full px-6 relative z-10"
            disabled={true}
          >
            <Play size={18} className="mr-2" />
            Écoute immédiate
          </Button>
        </div>
      </div>
    );
  }
  
  const { loadStation } = audioPlayerContext;

  const playRandomStation = async () => {
    try {
      const randomStations = await fetchTopStations(100);
      if (randomStations && randomStations.length > 0) {
        const randomIndex = Math.floor(Math.random() * randomStations.length);
        const randomStation = randomStations[randomIndex];
        loadStation(randomStation);
        toast.success("Lecture d'une station aléatoire");
      }
    } catch (error) {
      console.error("Error playing random station:", error);
      toast.error("Impossible de charger une station aléatoire");
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614149162883-504ce4d13909')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <h2 className="text-2xl font-bold mb-3 text-white relative z-10">Voyagez sans billet. Écoutez sans limites.</h2>
        <p className="text-gray-300 mb-4 relative z-10">Découvrez les radios du monde entier</p>
        <Button 
          onClick={playRandomStation}
          className="bg-gowera-highlight hover:bg-gowera-highlight/80 text-white rounded-full px-6 relative z-10"
        >
          <Play size={18} className="mr-2" />
          Écoute immédiate
        </Button>
      </div>
    </div>
  );
};

export default RandomListenSection;
