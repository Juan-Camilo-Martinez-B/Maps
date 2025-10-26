"use client";

import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLng } from "@/lib/types";
import { calculateDistance } from "@/lib/utils/calculations";

// Iconos personalizados
const userIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSIxMiIgZmlsbD0iIzM0ODFmZiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+PGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iNSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickCapture({ onClick, disabled }: { onClick: (latlng: LatLng) => void; disabled: boolean }) {
  useMapEvents({
    click(e: any) {
      if (!disabled) {
        onClick([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
}

interface OSMRouteMapProps {
  userLocation: LatLng | null;
  selectedPoints: LatLng[];
  plannedRoute: LatLng[];
  trackingRoute: LatLng[];
  isTracking: boolean;
  onMapClick: (point: LatLng) => void;
  onMapReady: (map: any) => void;
}

export default function OSMRouteMap({
  userLocation,
  selectedPoints,
  plannedRoute,
  trackingRoute,
  isTracking,
  onMapClick,
  onMapReady,
}: OSMRouteMapProps) {
  const initialCenter: LatLng = userLocation || [6.25184, -75.56359];

  // Mostrar ruta de tracking o ruta planificada
  const displayRoute = isTracking ? trackingRoute : plannedRoute;
  const routeDistance = displayRoute.length > 0 ? calculateDistance(displayRoute) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl border-2 border-gray-300">
      <MapContainer
        center={initialCenter}
        zoom={15}
        className="h-[300px] sm:h-[400px] md:h-[500px] w-full"
        scrollWheelZoom
        ref={onMapReady}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCapture onClick={onMapClick} disabled={isTracking} />

        {/* Ubicación del usuario (punto de inicio) - SIEMPRE VISIBLE */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon} />
        )}

        {/* Punto de destino (modo planificación) */}
        {!isTracking && selectedPoints.length > 1 && (
          <Marker 
            position={selectedPoints[selectedPoints.length - 1]} 
            icon={destinationIcon}
          />
        )}

        {/* Ruta planificada (modo libre) */}
        {!isTracking && plannedRoute.length > 0 && (
          <Polyline
            positions={plannedRoute}
            pathOptions={{
              color: "#f59e0b",
              weight: 5,
              opacity: 0.8,
            }}
          />
        )}

        {/* Ruta de tracking (modo activo) */}
        {isTracking && trackingRoute.length > 1 && (
          <Polyline
            positions={trackingRoute}
            pathOptions={{
              color: "#10b981",
              weight: 5,
              opacity: 0.9,
            }}
          />
        )}
      </MapContainer>

      {/* Indicador de distancia */}
      {displayRoute.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-1000">
          <div
            className={`rounded-xl px-5 py-3 shadow-lg border ${
              isTracking
                ? "bg-green-600 text-white border-green-500"
                : "bg-blue-600 text-white border-blue-500"
            }`}
          >
            <div className="text-center">
              <div className="text-xs font-bold mb-1 uppercase tracking-wide text-white/90">
                {isTracking ? "Recorrido" : "Distancia"}
              </div>
              <div className="text-3xl font-bold text-white">
                {(routeDistance / 1000).toFixed(2)} <span className="text-xl">km</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instrucción cuando no está tracking */}
      {!isTracking && userLocation && plannedRoute.length === 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-1000 w-11/12 max-w-md">
          <div className="rounded-xl bg-gray-800/95 px-5 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm shadow-xl border border-gray-700">
            📍 Haz clic en el mapa para calcular una ruta desde tu ubicación
          </div>
        </div>
      )}
      
      {/* Mensaje cuando no hay ubicación */}
      {!isTracking && !userLocation && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-1000 w-11/12 max-w-md">
          <div className="rounded-xl bg-blue-600/95 px-5 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm shadow-xl border border-blue-500">
            📍 Permitiendo acceso a tu ubicación...
          </div>
        </div>
      )}
    </div>
  );
}


