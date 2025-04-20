
import React from "react";
import { Copyright, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gowera-surface border-t border-white/10 py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">GOWERA</h3>
            <p className="text-gray-400 text-sm">
              Découvrez les meilleures radios du monde entier. Écoutez, explorez et connectez-vous.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-gowera-highlight transition-colors">Accueil</a></li>
              <li><a href="/news" className="text-gray-400 hover:text-gowera-highlight transition-colors">Actualités</a></li>
              <li><a href="/countries" className="text-gray-400 hover:text-gowera-highlight transition-colors">Pays</a></li>
              <li><a href="/categories" className="text-gray-400 hover:text-gowera-highlight transition-colors">Catégories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gowera-highlight transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gowera-highlight transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gowera-highlight transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gowera-highlight transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="flex items-center justify-center text-gray-400 text-sm">
            <Copyright size={16} className="mr-2" /> {new Date().getFullYear()} GOWERA. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
