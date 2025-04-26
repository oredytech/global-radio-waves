
import React from "react";
import RadioCard from "@/components/RadioCard";
import { RadioStation } from "@/services/radioService";

interface StationGridProps {
  stations: RadioStation[];
  loading: boolean;
  emptyTitle: string;
  emptySubtitle: string;
}

const StationGrid: React.FC<StationGridProps> = ({
  stations,
  loading,
  emptyTitle,
  emptySubtitle,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="text-gowera-highlight text-2xl animate-spin">⏳</span>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-medium text-gray-300">{emptyTitle}</h3>
        <p className="mt-2 text-gray-400">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {stations.map((station) => (
        <RadioCard key={station.id} station={station} />
      ))}
    </div>
  );
};

export default StationGrid;
