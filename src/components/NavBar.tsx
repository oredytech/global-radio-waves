
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Globe, Music, Mail, Info } from "lucide-react";

const NavBar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white py-2 px-4 flex justify-around items-center z-50 border-t border-gray-200">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-xs ${
            isActive ? "text-blue-500" : "text-gray-400"
          }`
        }
        end
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/countries"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-xs ${
            isActive ? "text-blue-500" : "text-gray-400"
          }`
        }
      >
        <Globe size={20} />
        <span>Pays</span>
      </NavLink>

      <NavLink
        to="/categories"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-xs ${
            isActive ? "text-blue-500" : "text-gray-400"
          }`
        }
      >
        <Music size={20} />
        <span>Catégorie</span>
      </NavLink>

      <NavLink
        to="/contact"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-xs ${
            isActive ? "text-blue-500" : "text-gray-400"
          }`
        }
      >
        <Mail size={20} />
        <span>Contacts</span>
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-xs ${
            isActive ? "text-blue-500" : "text-gray-400"
          }`
        }
      >
        <Info size={20} />
        <span>A propos</span>
      </NavLink>
    </nav>
  );
};

export default NavBar;
