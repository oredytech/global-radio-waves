
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Newspaper, Globe, Music, Mail, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const NavBar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-t border-white/10 h-16 pb-safe-area">
      <div className="container mx-auto flex items-center justify-around h-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink 
                to="/" 
                className={({ isActive }) => `flex flex-col items-center justify-center ${isActive ? 'text-gowera-highlight' : 'text-gray-400'}`}
                end
              >
                <Home size={20} className="mb-1" />
                <span className="text-xs hidden md:block">Accueil</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">
              <p>Accueil</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink 
                to="/news" 
                className={({ isActive }) => `flex flex-col items-center justify-center ${isActive ? 'text-gowera-highlight' : 'text-gray-400'}`}
              >
                <Newspaper size={20} className="mb-1" />
                <span className="text-xs hidden md:block">Actualités</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">
              <p>Actualités</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink 
                to="/countries" 
                className={({ isActive }) => `flex flex-col items-center justify-center ${isActive ? 'text-gowera-highlight' : 'text-gray-400'}`}
              >
                <Globe size={20} className="mb-1" />
                <span className="text-xs hidden md:block">Radio par pays</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">
              <p>Radio par pays</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink 
                to="/categories" 
                className={({ isActive }) => `flex flex-col items-center justify-center ${isActive ? 'text-gowera-highlight' : 'text-gray-400'}`}
              >
                <Music size={20} className="mb-1" />
                <span className="text-xs hidden md:block">Radio par catégorie</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">
              <p>Radio par catégorie</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => `flex flex-col items-center justify-center ${isActive ? 'text-gowera-highlight' : 'text-gray-400'}`}
              >
                <Mail size={20} className="mb-1" />
                <span className="text-xs hidden md:block">Contacts</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">
              <p>Contacts</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink 
                to="/about" 
                className={({ isActive }) => `flex flex-col items-center justify-center ${isActive ? 'text-gowera-highlight' : 'text-gray-400'}`}
              >
                <Info size={20} className="mb-1" />
                <span className="text-xs hidden md:block">A propos</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">
              <p>A propos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </nav>
  );
};

export default NavBar;
