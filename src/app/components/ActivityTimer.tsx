"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store/useStore";
import { formatDuration, formatDistance, formatSpeed } from "@/lib/utils/calculations";
import type { ActivityType } from "@/lib/types";

const activityIcons: Record<ActivityType, string> = {
  running: "🏃",
  cycling: "🚴",
  walking: "🚶",
};

const activityLabels: Record<ActivityType, string> = {
  running: "Carrera",
  cycling: "Ciclismo",
  walking: "Caminata",
};

export default function ActivityTimer() {
  const {
    currentActivity,
    isTracking,
    startActivity,
    pauseActivity,
    resumeActivity,
    stopActivity,
    updateActivityMetrics,
  } = useStore();

  const [selectedType, setSelectedType] = useState<ActivityType>("running");
  const [elapsed, setElapsed] = useState(0);

  // Actualizar métricas cada segundo
  useEffect(() => {
    if (currentActivity && currentActivity.status === "active") {
      const interval = setInterval(() => {
        updateActivityMetrics();
        const now = Date.now();
        const elapsedMs = now - currentActivity.startTime - currentActivity.pausedTime;
        setElapsed(Math.floor(elapsedMs / 1000));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentActivity, updateActivityMetrics]);

  const handleStart = () => {
    startActivity(selectedType);
  };

  const handlePauseResume = () => {
    if (currentActivity?.status === "active") {
      pauseActivity();
    } else {
      resumeActivity();
    }
  };

  const handleStop = () => {
    stopActivity();
    setElapsed(0);
  };

  // Si no hay actividad en curso, mostrar selector
  if (!isTracking) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl border border-gray-200"
      >
        <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-800 text-center">
          Nueva Actividad
        </h2>

        {/* Selector de tipo de actividad */}
        <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
          {(Object.keys(activityIcons) as ActivityType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex flex-col items-center justify-center gap-2 sm:gap-3 rounded-xl p-4 sm:p-5 transition-all ${
                selectedType === type
                  ? "bg-blue-600 text-white shadow-lg border-2 border-blue-500 transform-none"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200"
              }`}
            >
              <span className="text-3xl sm:text-4xl">{activityIcons[type]}</span>
              <span className="text-xs sm:text-sm font-bold leading-tight">{activityLabels[type]}</span>
            </button>
          ))}
        </div>

        {/* Botón de inicio */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleStart}
          className="w-full rounded-xl bg-gradient-to-r from-green-600 to-green-700 py-5 text-xl font-bold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 border border-green-500"
        >
          <span className="text-3xl">▶️</span>
          <span>Iniciar {activityLabels[selectedType]}</span>
        </motion.button>
      </motion.div>
    );
  }

  // Actividad en curso
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 p-6 sm:p-8 shadow-xl border border-indigo-500"
    >
      {/* Header con tipo de actividad */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-4xl sm:text-5xl">{activityIcons[currentActivity!.type]}</span>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {activityLabels[currentActivity!.type]}
            </h3>
            <p className="text-sm sm:text-base text-white/80 font-medium">
              {currentActivity!.status === "active" ? "En curso" : "En pausa"}
            </p>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {currentActivity!.status === "active" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-red-400 animate-pulse shadow-lg ring-2 ring-white/50"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Cronómetro grande */}
      <div className="mb-6 text-center py-6 sm:py-8 bg-white rounded-2xl shadow-md border border-gray-200">
        <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 tabular-nums">
          {formatDuration(elapsed)}
        </div>
      </div>

      {/* Métricas en tiempo real */}
      <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
        <MetricBox
          label="Distancia"
          value={formatDistance(currentActivity!.distance)}
          icon="📍"
        />
        <MetricBox
          label="Velocidad"
          value={formatSpeed(currentActivity!.avgSpeed)}
          icon="⚡"
        />
        <MetricBox
          label="Calorías"
          value={`${currentActivity!.calories}`}
          icon="🔥"
        />
      </div>

      {/* Controles */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePauseResume}
          className={`flex items-center justify-center gap-2 rounded-xl py-3 sm:py-4 px-4 font-semibold text-white shadow-md border ${
            currentActivity!.status === "active"
              ? "bg-amber-500 hover:bg-amber-600 border-amber-400"
              : "bg-green-600 hover:bg-green-700 border-green-500"
          }`}
        >
          <span className="text-xl sm:text-2xl">{currentActivity!.status === "active" ? "⏸" : "▶️"}</span>
          <span className="text-sm sm:text-base">{currentActivity!.status === "active" ? "Pausar" : "Reanudar"}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStop}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-3 sm:py-4 px-4 font-semibold text-white shadow-md border border-red-500"
        >
          <span className="text-xl sm:text-2xl">⏹</span>
          <span className="text-sm sm:text-base">Finalizar</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

function MetricBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white p-3 sm:p-4 shadow-md border border-gray-200">
      <span className="text-3xl sm:text-4xl">{icon}</span>
      <div className="text-center">
        <div className="text-lg sm:text-xl font-bold text-gray-800">{value}</div>
        <div className="text-[10px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wide leading-tight">{label}</div>
      </div>
    </div>
  );
}

