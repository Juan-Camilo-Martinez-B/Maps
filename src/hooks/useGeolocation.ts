import { useEffect, useState } from "react";
import type { LatLng } from "@/lib/types";

interface GeolocationState {
  location: LatLng | null;
  error: string | null;
  loading: boolean;
}

/**
 * Hook para obtener la geolocalización del usuario
 * @param watch Si es true, observa cambios continuos de ubicación
 */
export function useGeolocation(watch: boolean = false) {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        error: "Geolocalización no soportada",
        loading: false,
      });
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        location: [position.coords.latitude, position.coords.longitude],
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      let errorMessage = "Error desconocido";
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Permiso de ubicación denegado";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Ubicación no disponible";
          break;
        case error.TIMEOUT:
          errorMessage = "Tiempo de espera agotado";
          break;
      }

      setState({
        location: null,
        error: errorMessage,
        loading: false,
      });
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    let watchId: number | undefined;

    if (watch) {
      watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watch]);

  return state;
}

