"use client";

import { Toaster } from "sonner";
import { motion } from "framer-motion";
import MapClient from "./components/MapClient";
import MapControls from "./components/MapControls";
import ActivityTimer from "./components/ActivityTimer";
import StatsCard from "./components/StatsCard";
import ActivityHistory from "./components/ActivityHistory";

export default function Home() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
        <div className="w-full max-w-6xl space-y-4 sm:space-y-5 md:space-y-6 pb-4 sm:pb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MapControls />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <MapClient />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ActivityTimer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatsCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ActivityHistory />
          </motion.div>
        </div>
      </div>
    </>
  );
}
