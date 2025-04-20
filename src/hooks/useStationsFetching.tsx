
import { useEffect } from 'react';

export const useStationsFetching = () => {
  useEffect(() => {
    const fetchAndStoreStations = async () => {
      try {
        const response = await fetch('https://de1.api.radio-browser.info/json/stations/topvote/100');
        if (response.ok) {
          const stations = await response.json();
          localStorage.setItem('allRadioStations', JSON.stringify(stations));
        }
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };
    
    fetchAndStoreStations();
  }, []);
};
