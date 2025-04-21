
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllArticles } from "@/services/newsService";
import { RadioStation } from "@/services/radioService";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { toast } from "sonner";
import StationCover from "@/components/StationCover";
import StationHeader from "@/components/StationHeader";
import StationMeta from "@/components/StationMeta";
import StationArticles from "@/components/StationArticles";

// Helper functions
const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
const findStationBySlug = (
  stations: RadioStation[],
  slug: string
): RadioStation | undefined =>
  stations.find((s) => generateSlug(s.name) === slug);

const StationDetail: React.FC = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const { currentStation, isPlaying, togglePlayPause, loadStation } =
    useAudioPlayer();
  const [station, setStation] = useState<RadioStation | null>(null);
  const navigate = useNavigate();

  const { data: articles } = useQuery({
    queryKey: ["news"],
    queryFn: () => fetchAllArticles(8),
  });
  const recentArticles = articles?.slice(0, 8) || [];

  useEffect(() => {
    if (!stationId) {
      navigate("/");
      return;
    }

    // If the current station matches the URL slug, use that
    if (currentStation && generateSlug(currentStation.name) === stationId) {
      setStation(currentStation);
      return;
    }

    try {
      const savedStations = localStorage.getItem("allRadioStations");
      if (savedStations) {
        const stations = JSON.parse(savedStations) as RadioStation[];
        const foundStation = findStationBySlug(stations, stationId);

        if (foundStation) {
          setStation(foundStation);
        } else {
          toast.info("Station information is being loaded...");
          // Try fetching directly from API if not in localstorage
          fetch(
            "https://de1.api.radio-browser.info/json/stations/byname/" +
              stationId.replace(/-/g, " ") +
              "?limit=5"
          )
            .then((response) => response.json())
            .then((data) => {
              if (data && data.length > 0) {
                setStation(data[0]);
              } else {
                toast.error("Station not found");
              }
            })
            .catch((error) => {
              console.error("Error fetching station:", error);
              toast.error("Failed to load station");
            });
        }
      } else {
        toast.info("Loading station data...");
        // Try fetching directly from API
        fetch(
          "https://de1.api.radio-browser.info/json/stations/byname/" +
            stationId.replace(/-/g, " ") +
            "?limit=5"
        )
          .then((response) => response.json())
          .then((data) => {
            if (data && data.length > 0) {
              setStation(data[0]);
            } else {
              toast.error("Station not found");
            }
          })
          .catch((error) => {
            console.error("Error fetching station:", error);
            toast.error("Failed to load station");
          });
      }
    } catch (error) {
      console.error("Error retrieving station:", error);
      toast.error("Failed to load station information");
    }
  }, [stationId, currentStation, navigate]);

  useEffect(() => {
    // If we have station data but it's not loaded in the audio player, load it
    if (station && (!currentStation || station.id !== currentStation.id)) {
      loadStation(station);
    }
  }, [station, currentStation, loadStation]);

  if (!station) {
    return (
      <div className="container mx-auto px-4 py-20">
        <a
          href="/"
          className="flex items-center text-gowera-highlight mb-4 hover:underline"
        >
          {/* Consider using ArrowLeft icon here */}
          <span className="mr-2">&#8592;</span>
          Retour à l'accueil
        </a>
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
      <StationHeader
        station={station}
        isCurrentlyPlaying={isCurrentlyPlaying}
        handlePlayClick={handlePlayClick}
      />
      <StationCover
        imageUrl={coverImage}
        alt={station.name}
        defaultImage={defaultImage}
      />
      <div className="bg-gowera-surface p-6 rounded-lg shadow-lg mb-6">
        <StationMeta station={station} />
      </div>
      <StationArticles articles={recentArticles} />
    </div>
  );
};

export default StationDetail;
