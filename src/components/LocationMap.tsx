
import React from "react";
import { MapPin } from "lucide-react";

interface LocationMapProps {
  latitude: number | null;
  longitude: number | null;
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude }) => {
  if (!latitude || !longitude) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-100 rounded-md">
        <p className="text-brand-gray">Obteniendo ubicación...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden">
      <div className="p-4 bg-brand-gray-light/30 rounded-md">
        <div className="flex items-start">
          <div className="w-full">
            <p className="font-medium mb-1">Ubicación actual:</p>
            <p className="text-brand-gray">
              Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
