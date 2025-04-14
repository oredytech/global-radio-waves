
import { toast } from "sonner";
import { API_ENDPOINTS } from "../constants/radioConstants";

// Attempt to fetch from multiple endpoints until one succeeds
export async function fetchFromMultipleEndpoints(path: string): Promise<any> {
  let lastError = null;
  
  for (const endpoint of API_ENDPOINTS) {
    try {
      const response = await fetch(`${endpoint}${path}`, {
        headers: {
          'User-Agent': 'GOWERA-Radio-App/1.0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      lastError = error;
      console.error(`Failed to fetch from ${endpoint}${path}`, error);
    }
  }
  
  throw lastError || new Error("All API endpoints failed");
}

// Handle API errors and provide user feedback
export const handleApiError = (error: any, message: string) => {
  console.error(message, error);
  toast.error(`Error: ${message}. Using backup data.`);
  return [];
};
