"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import MapPlaceholder from "./MapPlaceholder";
import type { LatLng, Mode } from "./OSMRouteMap";

const OSMRouteMap = dynamic(() => import("./OSMRouteMap"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

export default function MapClient() {
  const [mode, setMode] = useState<Mode>("free");
  const [points, setPoints] = useState<LatLng[]>([]);
  const [route, setRoute] = useState<LatLng[]>([]);
  const [mapRef, setMapRef] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

  // Obtener ubicación automáticamente al cargar
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocalización no está soportada por este navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocationCoords: LatLng = [latitude, longitude];
        
        // Guardar ubicación del usuario
        setUserLocation(userLocationCoords);
        
        // Centrar el mapa en la ubicación del usuario cuando esté listo
        if (mapRef) {
          mapRef.setView(userLocationCoords, 15);
        }
        
        console.log("Ubicación del usuario obtenida automáticamente:", userLocationCoords);
      },
      (error) => {
        console.error("Error obteniendo ubicación automática:", error);
        // No mostrar alert, solo log en consola
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, [mapRef]);

  const addFreePoint = useCallback(async (p: LatLng) => {
    let newPoints: LatLng[];
    
    // Si tenemos ubicación del usuario, siempre usar como punto inicial
    const startPoint = userLocation || (points.length > 0 ? points[0] : null);
    
    if (!startPoint) {
      // Si no hay ubicación del usuario ni puntos previos, usar el punto actual como inicio
      newPoints = [p];
      setPoints(newPoints);
    } else {
      // Usar ubicación del usuario como inicio, punto actual como destino
      newPoints = [startPoint, p];
      setPoints(newPoints);
      try {
        const routeCoords = await fetchRouteOsrm(startPoint, p);
        setRoute(routeCoords);
      } catch (error) {
        console.warn("Error calculando ruta:", error);
      }
    }
  }, [points, userLocation]);

  // Función para calcular ruta OSRM (solo modo auto)
  async function fetchRouteOsrm(a: LatLng, b: LatLng): Promise<LatLng[]> {
    const aStr = `${a[1]},${a[0]}`;
    const bStr = `${b[1]},${b[0]}`;
    
    // Solo usar perfil 'driving' (modo auto)
    const url = `https://router.project-osrm.org/route/v1/driving/${aStr};${bStr}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    const coords: any[] = data?.routes?.[0]?.geometry?.coordinates || [];
    return coords.map((c) => [c[1], c[0]] as LatLng);
  }

  // Exponer API para controles externos (MapControls)
  if (typeof window !== "undefined") {
    (globalThis as any).__mapControls = {
      setMode,
      clearRoute: () => {
        setPoints([]);
        setRoute([]);
        // No limpiar userLocation para mantener el punto de inicio
      },
    };
  }

  return (
    <OSMRouteMap
      mode={mode}
      points={points}
      onAddFreePointAction={addFreePoint}
      route={route}
      onMapReadyAction={setMapRef}
      userLocation={userLocation}
    />
  );
}


