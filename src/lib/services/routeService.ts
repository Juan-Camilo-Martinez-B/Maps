import type { LatLng, ActivityType } from "../types";

/**
 * Obtiene una ruta desde OSRM
 * @param start Punto de inicio
 * @param end Punto de destino
 * @param activityType Tipo de actividad (determina el perfil de ruta)
 * @returns Array de coordenadas de la ruta
 */
export async function fetchRoute(
  start: LatLng,
  end: LatLng,
  activityType: ActivityType = "walking"
): Promise<LatLng[]> {
  try {
    // Mapear tipo de actividad a perfil OSRM
    const profileMap: Record<ActivityType, string> = {
      running: "foot",
      walking: "foot",
      cycling: "bike",
    };

    const profile = profileMap[activityType];
    const startStr = `${start[1]},${start[0]}`; // lon,lat
    const endStr = `${end[1]},${end[0]}`; // lon,lat

    const url = `https://router.project-osrm.org/route/v1/${profile}/${startStr};${endStr}?overview=full&geometries=geojson`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found");
    }

    const coordinates = data.routes[0].geometry.coordinates;

    // Convertir de [lon, lat] a [lat, lon]
    return coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as LatLng);
  } catch (error) {
    console.error("Error fetching route:", error);
    throw error;
  }
}

/**
 * Obtiene múltiples rutas entre varios puntos (waypoints)
 * @param points Array de puntos
 * @param activityType Tipo de actividad
 * @returns Array de coordenadas de la ruta completa
 */
export async function fetchMultiPointRoute(
  points: LatLng[],
  activityType: ActivityType = "walking"
): Promise<LatLng[]> {
  if (points.length < 2) {
    throw new Error("Need at least 2 points to create a route");
  }

  try {
    const profileMap: Record<ActivityType, string> = {
      running: "foot",
      walking: "foot",
      cycling: "bike",
    };

    const profile = profileMap[activityType];
    const coordinates = points.map((p) => `${p[1]},${p[0]}`).join(";");

    const url = `https://router.project-osrm.org/route/v1/${profile}/${coordinates}?overview=full&geometries=geojson`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found");
    }

    const coords = data.routes[0].geometry.coordinates;

    return coords.map((coord: [number, number]) => [coord[1], coord[0]] as LatLng);
  } catch (error) {
    console.error("Error fetching multi-point route:", error);
    throw error;
  }
}

/**
 * Valida si una coordenada es válida
 * @param coord Coordenada a validar
 * @returns true si es válida
 */
export function isValidCoordinate(coord: LatLng): boolean {
  const [lat, lng] = coord;
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

