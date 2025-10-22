"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
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

  const addFreePoint = useCallback(async (p: LatLng) => {
    let newPoints: LatLng[];
    
    if (points.length === 0) {
      // Primer punto
      newPoints = [p];
      setPoints(newPoints);
    } else if (points.length === 1) {
      // Segundo punto - crear ruta desde el primero
      newPoints = [points[0], p];
      setPoints(newPoints);
      try {
        const routeCoords = await fetchRouteOsrm(points[0], p);
        setRoute(routeCoords);
      } catch (error) {
        console.warn("Error calculando ruta:", error);
      }
    } else {
      // Tercer punto o más - mantener el primero, actualizar el segundo
      newPoints = [points[0], p];
      setPoints(newPoints);
      try {
        const routeCoords = await fetchRouteOsrm(points[0], p);
        setRoute(routeCoords);
      } catch (error) {
        console.warn("Error calculando ruta:", error);
      }
    }
  }, [points]);

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

  // Función para obtener ubicación del usuario
  const centerOnUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocalización no está soportada por este navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation: LatLng = [latitude, longitude];
        
        // Centrar el mapa en la ubicación del usuario
        if (mapRef) {
          mapRef.setView(userLocation, 15);
        }
        
        // Opcional: agregar un marcador en la ubicación del usuario
        console.log("Ubicación del usuario:", userLocation);
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        alert("No se pudo obtener tu ubicación. Verifica que tengas permisos de geolocalización habilitados.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, [mapRef]);

  // Exponer API para controles externos (MapControls)
  if (typeof window !== "undefined") {
    (globalThis as any).__mapControls = {
      setMode,
      centerOnUserLocation,
      clearRoute: () => {
        setPoints([]);
        setRoute([]);
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
    />
  );
}


