"use client";

import L from "leaflet";
import { useMemo } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMapEvents } from "react-leaflet";

// Fix default icon paths for Leaflet in Next.js
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export type LatLng = [number, number];
export type Mode = "free";

function ClickCapture({ onAddPoint }: { onAddPoint: (latlng: LatLng) => void }) {
  useMapEvents({
    click(e: any) {
      onAddPoint([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function OSMRouteMap({
  initialCenter = [6.25184, -75.56359],
  initialZoom = 13,
  mode,
  points,
  onAddFreePointAction,
  route,
  onMapReadyAction,
  userLocation,
}: {
  initialCenter?: LatLng;
  initialZoom?: number;
  mode: Mode;
  points: LatLng[];
  onAddFreePointAction: (p: LatLng) => void;
  route: LatLng[];
  onMapReadyAction?: (map: any) => void;
  userLocation?: LatLng | null;
}) {

  const polylineOpts = useMemo(
    () => ({ color: "#f59e0b", weight: 5, opacity: 0.9 }),
    []
  );

  function handleMapClickAdd(p: LatLng) {
    onAddFreePointAction(p);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        className="h-[420px] w-full"
        scrollWheelZoom
        ref={onMapReadyAction}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCapture onAddPoint={handleMapClickAdd} />
        
        {/* Marcador de ubicación del usuario (punto inicial) - ROJO */}
        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={new L.Icon({
              iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDkuNCAxMi41IDI4LjUgMTIuNSAyOC41UzI1IDIxLjkgMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMHptMCAxNy41Yy0yLjggMC01LTIuMi01LTVzMi4yLTUgNS01IDUgMi4yIDUgNS0yLjIgNS01IDV6IiBmaWxsPSIjZmYwMDAwIi8+PC9zdmc+",
              iconRetinaUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDkuNCAxMi41IDI4LjUgMTIuNSAyOC41UzI1IDIxLjkgMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMHptMCAxNy41Yy0yLjggMC01LTIuMi01LTVzMi4yLTUgNS01IDUgMi4yIDUgNS0yLjIgNS01IDV6IiBmaWxsPSIjZmYwMDAwIi8+PC9zdmc+",
              shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
              iconSize: [30, 49],
              iconAnchor: [15, 49],
            })}
          />
        )}
        
        {/* Marcador de destino */}
        {points.length > 1 && (
          <Marker position={points[points.length - 1]} icon={defaultIcon} />
        )}
        
        {/* Línea de ruta */}
        {route.length > 0 && (
          <Polyline positions={route} pathOptions={{ color: "#f59e0b", weight: 4, opacity: 0.8 }} />
        )}
      </MapContainer>

      {/* Cuadro de distancia - solo aparece cuando hay ruta */}
      {route.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-1000">
          <div className="rounded-xl bg-white px-5 py-3 shadow-lg border-2 border-yellow-400">
            <div className="text-center">
              <div className="text-xs text-gray-600 font-medium mb-1">Distancia</div>
              <div className="text-2xl font-bold text-gray-900">
                {computeDistanceKm(route).toFixed(2)} <span className="text-lg">km</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function computeDistanceKm(points: LatLng[]) {
  if (points.length < 2) return 0;
  let meters = 0;
  for (let i = 1; i < points.length; i++) {
    meters += haversine(points[i - 1], points[i]);
  }
  return meters / 1000;
}

function haversine(a: LatLng, b: LatLng) {
  const R = 6371000; // meters
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}


