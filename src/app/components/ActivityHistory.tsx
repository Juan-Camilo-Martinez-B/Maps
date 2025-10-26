"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store/useStore";
import { formatDuration, formatDistance, formatSpeed } from "@/lib/utils/calculations";
import { downloadGPX, generateShareText, copyToClipboard } from "@/lib/utils/export";
import { toast } from "sonner";
import type { ActivityType, Activity } from "@/lib/types";

const activityIcons: Record<ActivityType, string> = {
  running: "🏃",
  cycling: "🚴",
  walking: "🚶",
};

export default function ActivityHistory() {
  const { activities, deleteActivity } = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const completedActivities = mounted 
    ? activities.filter((a) => a.status === "completed")
    : [];

  if (completedActivities.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 sm:p-10 text-center shadow-xl border border-gray-200">
        <div className="mb-5 text-6xl">📋</div>
        <h3 className="mb-3 text-2xl sm:text-3xl font-bold text-gray-800">
          Sin actividades
        </h3>
        <p className="text-base text-gray-600">
          Inicia una actividad para ver tu historial
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 px-2">
        <span className="text-4xl">📋</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Historial de Actividades
        </h2>
      </div>
      <AnimatePresence mode="popLayout">
        {completedActivities.map((activity) => (
          <motion.div
            key={activity.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-200"
          >
            {/* Header */}
            <button
              onClick={() =>
                setExpandedId(expandedId === activity.id ? null : activity.id)
              }
              className="w-full p-5 sm:p-6 text-left transition-all hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-4xl">{activityIcons[activity.type]}</span>
                  <div>
                    <div className="font-bold text-gray-800 text-xl">
                      {formatDistance(activity.distance)}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {new Date(activity.startTime).toLocaleDateString("es", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                    {formatDuration(activity.duration)}
                  </span>
                  <motion.span
                    animate={{ rotate: expandedId === activity.id ? 180 : 0 }}
                    className="text-gray-400 text-xl"
                  >
                    ▼
                  </motion.span>
                </div>
              </div>
            </button>

            {/* Detalles expandidos */}
            <AnimatePresence>
              {expandedId === activity.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-200 bg-gray-50"
                >
                  <div className="p-5 space-y-4">
                    {/* Métricas detalladas */}
                    <div className="grid grid-cols-2 gap-4">
                      <DetailBox label="Velocidad Promedio" value={formatSpeed(activity.avgSpeed)} />
                      <DetailBox label="Calorías" value={`${activity.calories} kcal`} />
                      <DetailBox
                        label="Hora de Inicio"
                        value={new Date(activity.startTime).toLocaleTimeString("es", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      />
                      <DetailBox
                        label="Pace"
                        value={`${((activity.duration / 60) / (activity.distance / 1000)).toFixed(2)} min/km`}
                      />
                    </div>

                    {/* Acciones */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          downloadGPX(activity);
                          toast.success("Archivo GPX descargado");
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-white shadow-sm border border-blue-500"
                      >
                        <span className="text-base sm:text-lg">📥</span>
                        <span>Exportar</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={async () => {
                          const text = generateShareText(activity);
                          const success = await copyToClipboard(text);
                          if (success) {
                            toast.success("Copiado al portapapeles");
                          } else {
                            toast.error("Error al copiar");
                          }
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-white shadow-sm border border-green-500"
                      >
                        <span className="text-base sm:text-lg">📤</span>
                        <span>Compartir</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (confirm("¿Eliminar esta actividad?")) {
                            deleteActivity(activity.id);
                            toast.success("Actividad eliminada");
                            setExpandedId(null);
                          }
                        }}
                        className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-white shadow-sm border border-red-500"
                      >
                        <span className="text-base sm:text-lg">🗑️</span>
                        <span>Eliminar</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-3 sm:p-4 shadow-sm border border-gray-200">
      <div className="text-[10px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wide leading-tight">{label}</div>
      <div className="mt-1.5 sm:mt-2 font-bold text-gray-800 text-sm sm:text-base">{value}</div>
    </div>
  );
}

