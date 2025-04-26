
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Headphones, Globe, Music, Heart, Search } from "lucide-react";

const NavBar: React.FC = () => {
  return (
    <nav className="bottom-nav pb-safe-area border-t border-white/10">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center ${
            isActive ? "text-gowera-highlight" : "text-gray-500"
          }`
        }
        end
      >
        <Home size={20} />
        <span className="bottom-nav-label">Accueil</span>
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center ${
            isActive ? "text-gowera-highlight" : "text-gray-500"
          }`
        }
      >
        <Search size={20} />
        <span className="bottom-nav-label">Rechercher</span>
      </NavLink>

      <NavLink
        to="/countries"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center ${
            isActive ? "text-gowera-highlight" : "text-gray-500"
          }`
        }
      >
        <Globe size={20} />
        <span className="bottom-nav-label">Pays</span>
      </NavLink>

      <NavLink
        to="/genres"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center ${
            isActive ? "text-gowera-highlight" : "text-gray-500"
          }`
        }
      >
        <Music size={20} />
        <span className="bottom-nav-label">Genres</span>
      </NavLink>

      <NavLink
        to="/favorites"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center ${
            isActive ? "text-gowera-highlight" : "text-gray-500"
          }`
        }
      >
        <Heart size={20} />
        <span className="bottom-nav-label">Favoris</span>
      </NavLink>
    </nav>
  );
};

export default NavBar;
