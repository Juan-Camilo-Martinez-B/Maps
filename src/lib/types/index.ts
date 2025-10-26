// ============================================
// TIPOS PRINCIPALES DE LA APLICACIÓN
// ============================================

export type LatLng = [number, number];

export type ActivityType = "running" | "cycling" | "walking";

export type ActivityStatus = "idle" | "active" | "paused" | "completed";

export interface Activity {
  id: string;
  type: ActivityType;
  status: ActivityStatus;
  startTime: number;
  endTime?: number;
  pausedTime: number; // Tiempo total en pausa (ms)
  route: LatLng[];
  distance: number; // en metros
  duration: number; // en segundos (sin pausas)
  calories: number;
  avgSpeed: number; // km/h
  maxSpeed: number; // km/h
  elevationGain?: number; // metros
  name?: string;
  notes?: string;
}

export interface ActivityStats {
  totalActivities: number;
  totalDistance: number; // metros
  totalDuration: number; // segundos
  totalCalories: number;
  averageSpeed: number; // km/h
  longestDistance: number;
  longestDuration: number;
  activitiesByType: Record<ActivityType, number>;
}

export interface UserSettings {
  name?: string;
  weight?: number; // kg (para cálculo de calorías)
  theme: "light" | "dark";
  units: "metric" | "imperial";
  autoStart: boolean;
  soundEnabled: boolean;
  language: "es" | "en";
}

export interface RoutePoint {
  position: LatLng;
  timestamp: number;
  speed?: number; // m/s
  altitude?: number;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  distance: number;
  duration: number;
  calories: number;
  activities: number;
}

export interface Goal {
  id: string;
  type: "distance" | "duration" | "calories" | "activities";
  target: number;
  current: number;
  period: "daily" | "weekly" | "monthly";
  activityType?: ActivityType;
}

// Tipos para el mapa
export type MapMode = "free" | "tracking";

export interface MapState {
  center: LatLng;
  zoom: number;
  userLocation: LatLng | null;
  selectedPoints: LatLng[];
  route: LatLng[];
  mode: MapMode;
}

