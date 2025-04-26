
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExtendedCountryInfo } from '@/hooks/useCountryFiltering';

interface RandomCountryButtonProps {
  countries: ExtendedCountryInfo[];
  onRandomCountry: (country: ExtendedCountryInfo) => void;
}

const RandomCountryButton: React.FC<RandomCountryButtonProps> = ({ countries, onRandomCountry }) => {
  const handleRandomCountry = () => {
    if (countries.length > 0) {
      const randomIndex = Math.floor(Math.random() * countries.length);
      const randomCountry = countries[randomIndex];
      onRandomCountry(randomCountry);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleRandomCountry}
      className="group"
    >
      <span className="mr-2">🎲</span>
      Découvrir un pays aléatoire
      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
    </Button>
  );
};

export default RandomCountryButton;
