
import React, { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for the default icon issue in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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

  const position: [number, number] = [latitude, longitude];

  return (
    <div className="rounded-md overflow-hidden">
      <div className="p-4 bg-brand-gray-light/30 rounded-md">
        <div className="flex items-start mb-2">
          <div className="w-full">
            <p className="font-medium mb-1">Ubicación actual:</p>
            <p className="text-brand-gray">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>
        </div>
        
        {/* Map Container */}
        <div className="h-52 w-full rounded-md overflow-hidden border border-gray-200 mt-2">
          <MapContainer 
            center={position} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} />
            <ZoomControl position="bottomright" />
          </MapContainer>
        </div>

        <div className="flex justify-between text-xs text-brand-gray mt-2">
          <span>© OpenStreetMap</span>
          <span>200 m</span>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
