import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Activity,
  ActivityType,
  ActivityStatus,
  UserSettings,
  LatLng,
  MapMode,
  DailyStats,
} from "../types";
import { calculateDistance, calculateCalories, calculateSpeed } from "../utils/calculations";

interface StoreState {
  // Configuración del usuario
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;

  // Actividad actual
  currentActivity: Activity | null;
  isTracking: boolean;
  startActivity: (type: ActivityType) => void;
  pauseActivity: () => void;
  resumeActivity: () => void;
  stopActivity: () => void;
  addRoutePoint: (point: LatLng) => void;
  updateActivityMetrics: () => void;

  // Historial de actividades
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  clearAllActivities: () => void;

  // Estado del mapa
  userLocation: LatLng | null;
  setUserLocation: (location: LatLng | null) => void;
  selectedPoints: LatLng[];
  setSelectedPoints: (points: LatLng[]) => void;
  plannedRoute: LatLng[];
  setPlannedRoute: (route: LatLng[]) => void;
  mapMode: MapMode;
  setMapMode: (mode: MapMode) => void;
  clearRoute: () => void;

  // Estadísticas
  getTodayStats: () => DailyStats;
  getWeekStats: () => DailyStats[];
  getTotalStats: () => {
    totalDistance: number;
    totalDuration: number;
    totalCalories: number;
    totalActivities: number;
  };
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ============================================
      // CONFIGURACIÓN DEL USUARIO
      // ============================================
      settings: {
        theme: "light",
        units: "metric",
        autoStart: false,
        soundEnabled: true,
        language: "es",
        weight: 70, // kg default
      },

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // ============================================
      // ACTIVIDAD ACTUAL
      // ============================================
      currentActivity: null,
      isTracking: false,

      startActivity: (type) => {
        const now = Date.now();
        const userLocation = get().userLocation;

        set({
          currentActivity: {
            id: `activity_${now}`,
            type,
            status: "active",
            startTime: now,
            pausedTime: 0,
            route: userLocation ? [userLocation] : [],
            distance: 0,
            duration: 0,
            calories: 0,
            avgSpeed: 0,
            maxSpeed: 0,
          },
          isTracking: true,
          mapMode: "tracking",
        });
      },

      pauseActivity: () =>
        set((state) => {
          if (!state.currentActivity) return state;
          return {
            currentActivity: {
              ...state.currentActivity,
              status: "paused",
            },
          };
        }),

      resumeActivity: () =>
        set((state) => {
          if (!state.currentActivity) return state;
          return {
            currentActivity: {
              ...state.currentActivity,
              status: "active",
            },
          };
        }),

      stopActivity: () => {
        const state = get();
        const activity = state.currentActivity;

        if (activity && activity.route.length > 1) {
          // Calcular métricas finales
          const now = Date.now();
          const totalTimeMs = now - activity.startTime;
          const activeTimeSeconds = (totalTimeMs - activity.pausedTime) / 1000;

          const finalActivity: Activity = {
            ...activity,
            status: "completed",
            endTime: now,
            duration: activeTimeSeconds,
          };

          // Agregar al historial
          set((state) => ({
            activities: [finalActivity, ...state.activities],
            currentActivity: null,
            isTracking: false,
            mapMode: "free",
            selectedPoints: [],
            plannedRoute: [],
          }));
        } else {
          // Cancelar actividad sin guardar
          set({
            currentActivity: null,
            isTracking: false,
            mapMode: "free",
          });
        }
      },

      addRoutePoint: (point) =>
        set((state) => {
          if (!state.currentActivity || state.currentActivity.status !== "active") {
            return state;
          }

          const newRoute = [...state.currentActivity.route, point];
          const distance = calculateDistance(newRoute);
          const now = Date.now();
          const elapsedMs = now - state.currentActivity.startTime - state.currentActivity.pausedTime;
          const elapsedSeconds = elapsedMs / 1000;

          const avgSpeed = elapsedSeconds > 0 ? (distance / 1000 / elapsedSeconds) * 3600 : 0;
          const calories = calculateCalories(
            distance,
            state.currentActivity.type,
            state.settings.weight || 70
          );

          return {
            currentActivity: {
              ...state.currentActivity,
              route: newRoute,
              distance,
              duration: elapsedSeconds,
              calories,
              avgSpeed,
            },
          };
        }),

      updateActivityMetrics: () =>
        set((state) => {
          if (!state.currentActivity || state.currentActivity.status !== "active") {
            return state;
          }

          const now = Date.now();
          const elapsedMs = now - state.currentActivity.startTime - state.currentActivity.pausedTime;
          const elapsedSeconds = elapsedMs / 1000;

          const avgSpeed =
            elapsedSeconds > 0
              ? (state.currentActivity.distance / 1000 / elapsedSeconds) * 3600
              : 0;

          return {
            currentActivity: {
              ...state.currentActivity,
              duration: elapsedSeconds,
              avgSpeed,
            },
          };
        }),

      // ============================================
      // HISTORIAL DE ACTIVIDADES
      // ============================================
      activities: [],

      addActivity: (activity) =>
        set((state) => ({
          activities: [activity, ...state.activities],
        })),

      deleteActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== id),
        })),

      clearAllActivities: () =>
        set({
          activities: [],
        }),

      // ============================================
      // ESTADO DEL MAPA
      // ============================================
      userLocation: null,
      setUserLocation: (location) => set({ userLocation: location }),

      selectedPoints: [],
      setSelectedPoints: (points) => set({ selectedPoints: points }),

      plannedRoute: [],
      setPlannedRoute: (route) => set({ plannedRoute: route }),

      mapMode: "free",
      setMapMode: (mode) => set({ mapMode: mode }),

      clearRoute: () =>
        set({
          selectedPoints: [],
          plannedRoute: [],
        }),

      // ============================================
      // ESTADÍSTICAS
      // ============================================
      getTodayStats: () => {
        const today = new Date().toISOString().split("T")[0];
        const todayActivities = get().activities.filter((a) => {
          const activityDate = new Date(a.startTime).toISOString().split("T")[0];
          return activityDate === today && a.status === "completed";
        });

        return {
          date: today,
          distance: todayActivities.reduce((sum, a) => sum + a.distance, 0),
          duration: todayActivities.reduce((sum, a) => sum + a.duration, 0),
          calories: todayActivities.reduce((sum, a) => sum + a.calories, 0),
          activities: todayActivities.length,
        };
      },

      getWeekStats: () => {
        const stats: DailyStats[] = [];
        const activities = get().activities;

        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];

          const dayActivities = activities.filter((a) => {
            const activityDate = new Date(a.startTime).toISOString().split("T")[0];
            return activityDate === dateStr && a.status === "completed";
          });

          stats.push({
            date: dateStr,
            distance: dayActivities.reduce((sum, a) => sum + a.distance, 0),
            duration: dayActivities.reduce((sum, a) => sum + a.duration, 0),
            calories: dayActivities.reduce((sum, a) => sum + a.calories, 0),
            activities: dayActivities.length,
          });
        }

        return stats;
      },

      getTotalStats: () => {
        const completedActivities = get().activities.filter((a) => a.status === "completed");

        return {
          totalDistance: completedActivities.reduce((sum, a) => sum + a.distance, 0),
          totalDuration: completedActivities.reduce((sum, a) => sum + a.duration, 0),
          totalCalories: completedActivities.reduce((sum, a) => sum + a.calories, 0),
          totalActivities: completedActivities.length,
        };
      },
    }),
    {
      name: "fitness-tracker-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        activities: state.activities,
      }),
    }
  )
);

