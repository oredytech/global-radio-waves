
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="container flex items-center justify-center h-16">
        <h1 className="text-2xl font-bold tracking-tighter">
          <span className="text-primary">GOWERA</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
