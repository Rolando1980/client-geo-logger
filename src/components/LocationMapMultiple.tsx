import React from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Solución para el ícono por defecto en Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationMapMultipleProps {
  visits: {
    id?: string;
    clientName: string;
    date: string;
    time: string;
    latitude: number;
    longitude: number;
  }[];
}

const LocationMapMultiple: React.FC<LocationMapMultipleProps> = ({ visits }) => {
  if (!visits || visits.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-100 rounded-md">
        <p className="text-brand-gray">No hay visitas registradas este mes.</p>
      </div>
    );
  }

  // Para centrar el mapa, usamos la posición del primer marcador
  const center: [number, number] = [visits[0].latitude, visits[0].longitude];

  return (
    <div className="rounded-md overflow-hidden">
      <div className="h-64 w-full rounded-md overflow-hidden border border-gray-200 mt-2">
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {visits.map((visit, index) => (
            <Marker key={visit.id || index} position={[visit.latitude, visit.longitude]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{visit.clientName}</p>
                  <p>
                    {visit.date} - {visit.time}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
          <ZoomControl position="bottomright" />
        </MapContainer>
      </div>
      <div className="flex justify-between text-xs text-brand-gray mt-2">
        <span>© OpenStreetMap</span>
        <span>200 m</span>
      </div>
    </div>
  );
};

export default LocationMapMultiple;
