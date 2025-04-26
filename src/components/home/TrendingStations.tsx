
import React from "react";
import { RadioStation } from "@/services/radioService";
import SeeAllButton from "@/components/SeeAllButton";
import StationsLoading from "./stations/StationsLoading";
import StationImageCard from "./stations/StationImageCard";

interface TrendingStationsProps {
  stations: RadioStation[];
  isLoading: boolean;
}

const TrendingStations: React.FC<TrendingStationsProps> = ({ stations, isLoading }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Radios en tendance</h2>
        <SeeAllButton to="/featured" />
      </div>

      {isLoading ? (
        <StationsLoading />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stations.map((station) => (
            <StationImageCard key={station.id} station={station} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingStations;
