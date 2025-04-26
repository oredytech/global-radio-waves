
import React from "react";
import { CountryInfo } from "@/services/radioService";

interface CountryCardProps {
  country: CountryInfo & { continent?: string };
  onClick: () => void;
  colorClass: string;
}

const CountryCard: React.FC<CountryCardProps> = ({ country, onClick, colorClass }) => {
  const countryCode = country.code?.toUpperCase();
  const flagUrl = countryCode ? `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png` : null;
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/30 ${colorClass} backdrop-blur-sm border border-white/10`}
      onClick={onClick}
    >
      <div className="aspect-square flex flex-col items-center justify-center p-4 text-center">
        {flagUrl ? (
          <div className="w-12 h-8 mb-3 overflow-hidden rounded shadow-sm">
            <img 
              src={flagUrl} 
              alt={`Drapeau ${country.name}`} 
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="w-12 h-8 mb-3 bg-gray-700 rounded flex items-center justify-center text-xs">
            {country.name.substring(0, 2).toUpperCase()}
          </div>
        )}
        
        <h3 className="font-bold text-white text-lg leading-tight mb-1">{country.name}</h3>
        <p className="text-xs text-white/80">
          {country.stationCount} {country.stationCount > 1 ? "stations" : "station"}
        </p>
      </div>
    </div>
  );
};

export default CountryCard;
