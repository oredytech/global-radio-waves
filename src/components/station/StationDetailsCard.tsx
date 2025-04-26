
import React from "react";
import { RadioStation } from "@/services/radioService";

interface StationDetailsCardProps {
  station: RadioStation;
}

const StationDetailsCard: React.FC<StationDetailsCardProps> = ({ station }) => {
  // Generate a description if not provided
  const generateDescription = () => {
    const tags = station.tags?.join(', ') || '';
    const country = station.country || 'du monde';
    const lang = station.language || '';
    
    return `${station.name} est une station de radio ${tags ? 'spécialisée en ' + tags : ''} diffusant depuis ${country}${lang ? ' principalement en ' + lang : ''}. Cette radio offre une expérience d'écoute unique, vous permettant de découvrir des sonorités${country !== 'du monde' ? ' de ' + country : ' internationales'}.`;
  };
  
  const description = generateDescription();

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">À propos de la station</h2>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300">{description}</p>
        
        <p className="text-gray-300 mt-4">
          Immergez-vous dans l'univers de cette station et laissez-vous transporter par ses vibrations uniques.
          Chaque radio raconte une histoire, offre une perspective et vous connecte à une culture.
        </p>
      </div>
      
      {station.tags && station.tags.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">Genres musicaux</h3>
          <div className="flex flex-wrap gap-2">
            {station.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-white/10 text-sm text-white rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StationDetailsCard;
