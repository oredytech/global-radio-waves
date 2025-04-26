
import React from "react";
import { RadioStation } from "@/services/radioService";
import SeeAllButton from "@/components/SeeAllButton";
import StationsLoading from "./stations/StationsLoading";
import StationListCard from "./stations/StationListCard";

interface PopularStationsProps {
  stations: RadioStation[];
  isLoading: boolean;
}

const PopularStations: React.FC<PopularStationsProps> = ({ stations, isLoading }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Stations populaires</h2>
        <SeeAllButton to="/popular" />
      </div>

      {isLoading ? (
        <StationsLoading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stations.slice(0, 6).map((station) => (
            <StationListCard key={station.id} station={station} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularStations;
