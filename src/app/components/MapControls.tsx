"use client";

import { useEffect, useState } from "react";

type ControlsApi = {
  setMode: (m: "free") => void;
  clearRoute: () => void;
} | null;

export default function MapControls() {
  const [api, setApi] = useState<ControlsApi>(null);

  useEffect(() => {
    const read = () => setApi(((globalThis as any).__mapControls ?? null) as ControlsApi);
    read();
    const id = setInterval(read, 300);
    return () => clearInterval(id);
  }, []);

  const disabled = !api;
  const baseBtn =
    "rounded-lg px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40";

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Free Maps</h1>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className={`${baseBtn} bg-white text-gray-900 shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={() => api?.clearRoute()}
          disabled={disabled}
        >
          Limpiar ruta
        </button>
      </div>
    </div>
  );
}