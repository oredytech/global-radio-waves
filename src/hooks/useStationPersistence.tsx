
import { useEffect } from 'react';
import { RadioStation } from '@/services/radioService';

export const useStationPersistence = (currentStation: RadioStation | null) => {
  // Save current station when it changes
  useEffect(() => {
    if (currentStation) {
      localStorage.setItem('currentRadioStation', JSON.stringify(currentStation));
    }
  }, [currentStation]);

  // Load saved station on mount (only runs once)
  useEffect(() => {
    // This function only loads data but doesn't need to return anything
    const getSavedStation = () => {
      const savedStation = localStorage.getItem('currentRadioStation');
      if (savedStation) {
        try {
          // Just return the parsed station, but don't return from useEffect
          return JSON.parse(savedStation);
        } catch (e) {
          console.error("Error retrieving station:", e);
        }
      }
      return null;
    };
    
    // Call the function but don't return its result from useEffect
    getSavedStation();
    
    // No cleanup needed for this effect, so we don't return anything
  }, []);
};
