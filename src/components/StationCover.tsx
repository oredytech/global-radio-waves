
import React from "react";

interface StationCoverProps {
  imageUrl: string;
  alt: string;
  defaultImage?: string;
}

const StationCover: React.FC<StationCoverProps> = ({ imageUrl, alt, defaultImage }) => (
  <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-6 bg-gowera-surface">
    <div
      className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40"
      style={{
        backgroundImage: `url(${imageUrl || defaultImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>
    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <img
        src={imageUrl || defaultImage}
        alt={alt}
        className="h-24 w-24 rounded-lg object-cover z-10 shadow-lg"
        onError={(e) => {
          if (defaultImage) (e.target as HTMLImageElement).src = defaultImage;
        }}
      />
    </div>
  </div>
);

export default StationCover;
