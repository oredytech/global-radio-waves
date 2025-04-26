
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Music, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ExplorationButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card 
        className="bg-gradient-to-br from-blue-900/80 to-blue-700/50 border-none cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => navigate('/countries')}
      >
        <CardContent className="p-4 flex flex-col items-center">
          <Globe className="text-white mb-2" size={24} />
          <span className="text-sm font-medium text-white">Par pays</span>
        </CardContent>
      </Card>

      <Card 
        className="bg-gradient-to-br from-purple-900/80 to-purple-700/50 border-none cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => navigate('/genres')}
      >
        <CardContent className="p-4 flex flex-col items-center">
          <Music className="text-white mb-2" size={24} />
          <span className="text-sm font-medium text-white">Par genre</span>
        </CardContent>
      </Card>

      <Card 
        className="bg-gradient-to-br from-green-900/80 to-green-700/50 border-none cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => navigate('/favorites')}
      >
        <CardContent className="p-4 flex flex-col items-center">
          <Headphones className="text-white mb-2" size={24} />
          <span className="text-sm font-medium text-white">Populaires</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExplorationButtons;
