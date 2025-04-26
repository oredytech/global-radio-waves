
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { RadioStation } from "@/services/radioService";
import { findStationBySlug, generateSlug } from "@/utils/stationUtils";

export const useStationLoader = (
  stationSlug: string | undefined,
  currentStation: RadioStation | null,
  loadStation: (station: RadioStation) => void
) => {
  const navigate = useNavigate();
  const [station, setStation] = useState<RadioStation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!stationSlug) {
      navigate("/");
      return;
    }

    // Check if the current station matches the slug
    if (currentStation && generateSlug(currentStation.name) === stationSlug) {
      console.log("useStationLoader: Using current station:", currentStation.name);
      setStation(currentStation);
      setIsLoading(false);
      return;
    }

    const loadStationData = async () => {
      try {
        setIsLoading(true);
        console.log("useStationLoader: Trying to find station for slug:", stationSlug);
        const savedStations = localStorage.getItem("allRadioStations");
        
        if (savedStations) {
          const stations = JSON.parse(savedStations) as RadioStation[];
          const foundStation = findStationBySlug(stations, stationSlug);

          if (foundStation) {
            console.log("useStationLoader: Found station in localStorage:", foundStation.name);
            setStation(foundStation);
            setIsLoading(false);
            return;
          }
        }

        // If not found in localStorage, fetch from API
        console.log("useStationLoader: Fetching station from API for slug:", stationSlug);
        const response = await fetch(
          `https://de1.api.radio-browser.info/json/stations/byname/${stationSlug.replace(/-/g, " ")}?limit=5`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const matchingStation = data.find(
            (s: any) => generateSlug(s.name) === stationSlug
          ) || data[0];
          
          console.log("useStationLoader: Found station from API:", matchingStation.name);
          setStation(matchingStation);
        } else {
          console.error("useStationLoader: Station not found for slug:", stationSlug);
          toast.error("Station non trouvée");
          navigate("/");
        }
      } catch (error) {
        console.error("Error retrieving station:", error);
        toast.error("Problème lors du chargement des informations");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadStationData();
  }, [stationSlug, currentStation, navigate, loadStation]);

  return { station, isLoading };
};
