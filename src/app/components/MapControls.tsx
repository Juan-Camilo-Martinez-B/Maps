"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store/useStore";

export default function MapControls() {
  const { clearRoute, isTracking } = useStore();

  return (
    <div className="flex items-center justify-between gap-3 sm:gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5 shadow-lg border border-blue-500">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3"
      >
        <span className="text-2xl sm:text-3xl">🗺️</span>
        <span className="hidden sm:inline">Fitness Tracker</span>
        <span className="sm:hidden">Fitness</span>
      </motion.h1>

      {!isTracking && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={clearRoute}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all border border-red-500"
        >
          <span className="text-base sm:text-lg">🗑️</span>
          <span className="hidden sm:inline">Limpiar</span>
        </motion.button>
      )}
    </div>
  );
}