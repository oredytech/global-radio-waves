
import React from "react";
import { NavLink } from "react-router-dom";
import { Newspaper, Globe, Music, Mail } from "lucide-react";

const NavBar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-t border-white/10 h-16 pb-safe-area">
      <div className="container mx-auto flex items-center justify-around h-full">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center justify-center text-xs ${isActive ? 'text-gowera-highlight' : 'text-gray-400'}`}
          end
        >
          <Newspaper size={20} className="mb-1" />
          <span>Actualités</span>
        </NavLink>
        
        <NavLink 
          to="/countries" 
          className={({ isActive }) => `flex flex-col items-center justify-center text-xs ${isActive ? 'text-gowera-highlight' : 'text-gray-400'}`}
        >
          <Globe size={20} className="mb-1" />
          <span>Radio par pays</span>
        </NavLink>
        
        <NavLink 
          to="/categories" 
          className={({ isActive }) => `flex flex-col items-center justify-center text-xs ${isActive ? 'text-gowera-highlight' : 'text-gray-400'}`}
        >
          <Music size={20} className="mb-1" />
          <span>Radio par catégorie</span>
        </NavLink>
        
        <NavLink 
          to="/contact" 
          className={({ isActive }) => `flex flex-col items-center justify-center text-xs ${isActive ? 'text-gowera-highlight' : 'text-gray-400'}`}
        >
          <Mail size={20} className="mb-1" />
          <span>Contacts</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
