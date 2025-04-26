
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { RadioStation } from "@/services/radioService";
import { findStationBySlug, generateSlug } from "@/utils/stationUtils";

export const useStationLoader = (
  stationId: string | undefined,
  currentStation: RadioStation | null,
  loadStation: (station: RadioStation) => void
) => {
  const navigate = useNavigate();
  const [station, setStation] = useState<RadioStation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!stationId) {
      navigate("/");
      return;
    }

    if (currentStation && generateSlug(currentStation.name) === stationId) {
      setStation(currentStation);
      setIsLoading(false);
      return;
    }

    const loadStationData = async () => {
      try {
        setIsLoading(true);
        const savedStations = localStorage.getItem("allRadioStations");
        
        if (savedStations) {
          const stations = JSON.parse(savedStations) as RadioStation[];
          const foundStation = findStationBySlug(stations, stationId);

          if (foundStation) {
            setStation(foundStation);
            setIsLoading(false);
            return;
          }
        }

        // If not found in localStorage, fetch from API
        const response = await fetch(
          `https://de1.api.radio-browser.info/json/stations/byname/${stationId.replace(/-/g, " ")}?limit=5`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          setStation(data[0]);
        } else {
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
  }, [stationId, currentStation, navigate]);

  useEffect(() => {
    // Auto-load the station when found, but don't auto-play
    if (station && (!currentStation || station.id !== currentStation.id)) {
      loadStation(station);
    }
  }, [station, currentStation, loadStation]);

  return { station, isLoading };
};
