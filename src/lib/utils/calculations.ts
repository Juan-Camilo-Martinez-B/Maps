import type { LatLng, ActivityType } from "../types";

/**
 * Calcula la distancia total de una ruta usando la fórmula de Haversine
 * @param points Array de coordenadas [lat, lng]
 * @returns Distancia en metros
 */
export function calculateDistance(points: LatLng[]): number {
  if (points.length < 2) return 0;

  let totalMeters = 0;
  for (let i = 1; i < points.length; i++) {
    totalMeters += haversine(points[i - 1], points[i]);
  }

  return totalMeters;
}

/**
 * Fórmula de Haversine para calcular distancia entre dos puntos
 */
function haversine(a: LatLng, b: LatLng): number {
  const R = 6371000; // Radio de la Tierra en metros
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);

  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);

  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return R * c;
}

/**
 * Calcula las calorías quemadas basándose en distancia, tipo de actividad y peso
 * @param distanceMeters Distancia en metros
 * @param activityType Tipo de actividad
 * @param weightKg Peso en kilogramos
 * @returns Calorías quemadas
 */
export function calculateCalories(
  distanceMeters: number,
  activityType: ActivityType,
  weightKg: number
): number {
  const distanceKm = distanceMeters / 1000;

  // MET (Metabolic Equivalent of Task) valores aproximados
  const metValues: Record<ActivityType, number> = {
    running: 10, // 10 km/h promedio
    cycling: 8, // 20 km/h promedio
    walking: 3.5, // 5 km/h promedio
  };

  // Tiempo estimado en horas basado en velocidad promedio
  const avgSpeeds: Record<ActivityType, number> = {
    running: 10, // km/h
    cycling: 20, // km/h
    walking: 5, // km/h
  };

  const timeHours = distanceKm / avgSpeeds[activityType];
  const calories = metValues[activityType] * weightKg * timeHours;

  return Math.round(calories);
}

/**
 * Calcula la velocidad promedio
 * @param distanceMeters Distancia en metros
 * @param durationSeconds Duración en segundos
 * @returns Velocidad en km/h
 */
export function calculateSpeed(
  distanceMeters: number,
  durationSeconds: number
): number {
  if (durationSeconds === 0) return 0;

  const distanceKm = distanceMeters / 1000;
  const durationHours = durationSeconds / 3600;

  return distanceKm / durationHours;
}

/**
 * Calcula el pace (min/km)
 * @param distanceMeters Distancia en metros
 * @param durationSeconds Duración en segundos
 * @returns Pace en minutos por kilómetro
 */
export function calculatePace(
  distanceMeters: number,
  durationSeconds: number
): number {
  if (distanceMeters === 0) return 0;

  const distanceKm = distanceMeters / 1000;
  const durationMinutes = durationSeconds / 60;

  return durationMinutes / distanceKm;
}

/**
 * Formatea la duración en formato legible
 * @param seconds Segundos
 * @returns String formateado (ej: "1:23:45" o "23:45")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Formatea la distancia
 * @param meters Metros
 * @returns String formateado (ej: "1.23 km" o "850 m")
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * Formatea la velocidad
 * @param kmh Velocidad en km/h
 * @returns String formateado (ej: "12.5 km/h")
 */
export function formatSpeed(kmh: number): string {
  return `${kmh.toFixed(1)} km/h`;
}

/**
 * Formatea el pace
 * @param minPerKm Minutos por kilómetro
 * @returns String formateado (ej: "5:30 min/km")
 */
export function formatPace(minPerKm: number): string {
  const minutes = Math.floor(minPerKm);
  const seconds = Math.round((minPerKm - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")} min/km`;
}

