"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { useStore } from "@/lib/store/useStore";
import { fetchRoute } from "@/lib/services/routeService";
import { useGeolocation } from "@/hooks/useGeolocation";
import MapPlaceholder from "./MapPlaceholder";
import type { LatLng } from "@/lib/types";
import { toast } from "sonner";

const OSMRouteMap = dynamic(() => import("./OSMRouteMap"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

export default function MapClient() {
  const {
    userLocation,
    setUserLocation,
    selectedPoints,
    setSelectedPoints,
    plannedRoute,
    setPlannedRoute,
    mapMode,
    isTracking,
    currentActivity,
    addRoutePoint,
  } = useStore();

  const [mapRef, setMapRef] = useState<any>(null);
  const lastTrackedPointRef = useRef<LatLng | null>(null);

  // Obtener ubicación del usuario
  const { location, error } = useGeolocation(isTracking);

  // Manejar ubicación inicial
  useEffect(() => {
    if (location && !userLocation) {
      setUserLocation(location);
      if (mapRef) {
        mapRef.setView(location, 15);
      }
    }
  }, [location, userLocation, setUserLocation, mapRef]);

  // Manejar tracking de ruta
  useEffect(() => {
    if (isTracking && currentActivity && location) {
      // Verificar si este punto ya fue agregado
      const lastPoint = lastTrackedPointRef.current;
      const isDifferentPoint =
        !lastPoint ||
        lastPoint[0] !== location[0] ||
        lastPoint[1] !== location[1];

      if (isDifferentPoint) {
        addRoutePoint(location);
        lastTrackedPointRef.current = location;
      }
    }

    // Limpiar referencia cuando se detiene el tracking
    if (!isTracking) {
      lastTrackedPointRef.current = null;
    }
  }, [location, isTracking, currentActivity, addRoutePoint]);

  // Manejar errores de geolocalización
  useEffect(() => {
    if (error) {
      toast.error(`Error de geolocalización: ${error}`);
    }
  }, [error]);

  // Manejar click en modo libre (planificación de ruta)
  const handleMapClick = async (point: LatLng) => {
    if (isTracking) return; // No permitir planificación durante tracking

    try {
      // Si tenemos ubicación del usuario, siempre usarla como punto de inicio
      if (userLocation) {
        // Calcular ruta desde la ubicación del usuario hasta el punto clickeado
        const route = await fetchRoute(userLocation, point, "walking");
        setSelectedPoints([userLocation, point]);
        setPlannedRoute(route);
        toast.success("Ruta calculada desde tu ubicación");
      } else {
        // Si no hay ubicación del usuario, establecer el punto clickeado como único punto
        setSelectedPoints([point]);
        setPlannedRoute([]);
        toast.info("Esperando tu ubicación...");
      }
    } catch (error) {
      console.error("Error calculating route:", error);
      toast.error("No se pudo calcular la ruta");
    }
  };

  return (
    <OSMRouteMap
      userLocation={userLocation}
      selectedPoints={selectedPoints}
      plannedRoute={plannedRoute}
      trackingRoute={currentActivity?.route || []}
      isTracking={isTracking}
      onMapClick={handleMapClick}
      onMapReady={setMapRef}
    />
  );
}


