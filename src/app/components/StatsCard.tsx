"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store/useStore";
import { formatDistance, formatDuration } from "@/lib/utils/calculations";
import type { DailyStats } from "@/lib/types";

export default function StatsCard() {
  const getTodayStats = useStore((state) => state.getTodayStats);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<DailyStats>({
    date: new Date().toISOString().split("T")[0],
    distance: 0,
    duration: 0,
    calories: 0,
    activities: 0,
  });

  useEffect(() => {
    setMounted(true);
    setStats(getTodayStats());
  }, [getTodayStats]);

  if (!mounted) {
    // Mostrar placeholder durante SSR
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white p-4 sm:p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Hoy</h2>
          <span className="text-xl sm:text-2xl">📊</span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <StatBox icon="📍" label="Distancia" value="0 km" />
          <StatBox icon="⏱️" label="Tiempo" value="0:00" />
          <StatBox icon="🔥" label="Calorías" value="0" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl border border-gray-200"
    >
      <div className="mb-6 flex items-center justify-center gap-3">
        <span className="text-4xl">📊</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Hoy</h2>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
        <StatBox
          icon="📍"
          label="Distancia"
          value={stats.distance > 0 ? formatDistance(stats.distance) : "0 km"}
        />
        <StatBox
          icon="⏱️"
          label="Tiempo"
          value={stats.duration > 0 ? formatDuration(stats.duration) : "0:00"}
        />
        <StatBox
          icon="🔥"
          label="Calorías"
          value={`${stats.calories}`}
        />
      </div>

      {stats.activities > 0 && (
        <div className="mt-5 pt-5 border-t border-gray-200 text-center text-sm sm:text-base font-semibold text-green-600">
          ✅ {stats.activities} {stats.activities === 1 ? "actividad completada" : "actividades completadas"}
        </div>
      )}
    </motion.div>
  );
}

function StatBox({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 border border-blue-100 shadow-sm">
      <span className="text-3xl sm:text-4xl">{icon}</span>
      <div className="text-center">
        <div className="text-lg sm:text-xl font-bold text-gray-800">{value}</div>
        <div className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide leading-tight">{label}</div>
      </div>
    </div>
  );
}

