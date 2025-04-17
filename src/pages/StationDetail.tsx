import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllArticles } from "@/services/newsService";
import { RadioStation } from "@/services/radioService";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Play, Pause, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ArticleCard from "@/components/ArticleCard";
import { toast } from "sonner";

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

const findStationBySlug = (stations: RadioStation[], slug: string): RadioStation | undefined => {
  return stations.find(s => generateSlug(s.name) === slug);
};

const StationDetail: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const { currentStation, isPlaying, togglePlayPause, loadStation } = useAudioPlayer();
  const [station, setStation] = useState<RadioStation | null>(null);
  const navigate = useNavigate();
  
  const { data: articles } = useQuery({
    queryKey: ['news'],
    queryFn: () => fetchAllArticles(8),
  });
  
  const recentArticles = articles?.slice(0, 8) || [];
  
  useEffect(() => {
    if (!stationId) {
      navigate('/');
      return;
    }
    
    if (currentStation && generateSlug(currentStation.name) === stationId) {
      setStation(currentStation);
      return;
    }
    
    try {
      const savedStations = localStorage.getItem('allRadioStations');
      if (savedStations) {
        const stations = JSON.parse(savedStations) as RadioStation[];
        const foundStation = findStationBySlug(stations, stationId);
        
        if (foundStation) {
          setStation(foundStation);
          if (foundStation.id !== currentStation?.id) {
            loadStation(foundStation);
          }
        } else {
          toast.info("Station information is being loaded...");
        }
      } else {
        toast.info("Loading station data...");
      }
    } catch (error) {
      console.error("Error retrieving station:", error);
      toast.error("Failed to load station information");
    }
  }, [stationId, currentStation, navigate, loadStation]);
  
  if (!station) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Link to="/" className="flex items-center text-gowera-highlight mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to home
        </Link>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gowera-highlight"></div>
        </div>
      </div>
    );
  }
  
  const isCurrentlyPlaying = currentStation?.id === station.id && isPlaying;
  const defaultImage = "https://placehold.co/800x300/333/888?text=Radio";
  const coverImage = station.favicon || defaultImage;
  
  const handlePlayClick = () => {
    if (currentStation?.id === station.id) {
      togglePlayPause();
    } else {
      loadStation(station);
    }
  };
  
  return (
    <div className="container mx-auto px-4 pb-32 pt-16">
      <div className="mb-8">
        <Link to="/" className="flex items-center text-gowera-highlight mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>
        <h1 className="text-3xl font-bold mb-2">Écoutez en direct</h1>
        <p className="text-gray-400">Découvrez les meilleures stations de radio en ligne</p>
      </div>
      
      <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-6 bg-gowera-surface">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40"
          style={{ 
            backgroundImage: `url(${coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={station.favicon || defaultImage} 
            alt={station.name}
            className="h-24 w-24 rounded-lg object-cover z-10 shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
        </div>
      </div>
      
      <div className="bg-gowera-surface p-6 rounded-lg shadow-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-2 md:mb-0 text-center md:text-left">{station.name}</h1>
          
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="text-center md:text-left">
            <h3 className="text-sm uppercase text-gray-400 mb-1">Pays</h3>
            <p className="font-medium">{station.country}</p>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-sm uppercase text-gray-400 mb-1">Langue</h3>
            <p className="font-medium">{station.language || "Non spécifiée"}</p>
          </div>
          
          {station.tags && Array.isArray(station.tags) && station.tags.length > 0 && (
            <div className="md:col-span-2 text-center md:text-left">
              <h3 className="text-sm uppercase text-gray-400 mb-1">Catégories</h3>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {station.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-black/30 text-white text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Actualités récentes</h2>
          <div className="flex items-center text-sm text-gray-400">
            <span>Dernières actualités</span>
          </div>
        </div>
        
        {recentArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentArticles.map(article => (
              <ArticleCard 
                key={article.id}
                article={article}
              />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center bg-gowera-surface border-none">
            <p>Pas d'actualités récentes disponibles</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StationDetail;
