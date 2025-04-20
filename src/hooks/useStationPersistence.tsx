
import { useEffect } from 'react';
import { RadioStation } from '@/services/radioService';

export const useStationPersistence = (currentStation: RadioStation | null) => {
  // Save current station when it changes
  useEffect(() => {
    if (currentStation) {
      localStorage.setItem('currentRadioStation', JSON.stringify(currentStation));
    }
  }, [currentStation]);

  // Load saved station on mount
  useEffect(() => {
    const savedStation = localStorage.getItem('currentRadioStation');
    if (savedStation) {
      try {
        return JSON.parse(savedStation);
      } catch (e) {
        console.error("Error retrieving station:", e);
      }
    }
    return null;
  }, []);
};
