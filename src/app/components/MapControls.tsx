"use client";

import { useEffect, useState } from "react";

type ControlsApi = {
  setMode: (m: "free") => void;
  clearRoute: () => void;
  centerOnUserLocation: () => void;
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
        <button
          type="button"
          className={`${baseBtn} bg-yellow-500 text-black hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={() => api?.setMode("free")}
          disabled={disabled}
        >
          Dibujo libre
        </button>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className={`${baseBtn} bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1`}
          onClick={() => api?.centerOnUserLocation()}
          disabled={disabled}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Mi ubicación
        </button>
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