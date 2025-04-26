
import { useState, useEffect } from 'react';
import { RadioStation } from "@/services/radioService";

export const useLocalTime = (station: RadioStation | null) => {
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    if (!station) return;
    
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        setLocalTime(formatter.format(now));
      } catch (error) {
        console.error("Error getting local time", error);
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, [station]);

  return localTime;
};
