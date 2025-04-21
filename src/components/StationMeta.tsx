
import React from "react";
import { RadioStation } from "@/services/radioService";

interface StationMetaProps {
  station: RadioStation;
}

const StationMeta: React.FC<StationMetaProps> = ({ station }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <div className="text-center md:text-left">
      <h3 className="text-sm uppercase text-gray-400 mb-1">Pays</h3>
      <p className="font-medium">{station.country}</p>
    </div>
    <div className="text-center md:text-left">
      <h3 className="text-sm uppercase text-gray-400 mb-1">Langue</h3>
      <p className="font-medium">{station.language || "Non spécifiée"}</p>
    </div>
    {station.tags && Array.isArray(station.tags) && station.tags.length > 0 && (
      <div className="md:col-span-2 text-center md:text-left">
        <h3 className="text-sm uppercase text-gray-400 mb-1">Catégories</h3>
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {station.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-black/30 text-white text-xs px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default StationMeta;
