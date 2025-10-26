import { useEffect, useRef, useState } from "react";

/**
 * Hook personalizado para manejar el cronómetro
 */
export function useTimer(isActive: boolean) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      if (startTimeRef.current === 0) {
        startTimeRef.current = Date.now();
      }

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current - pausedTimeRef.current;
        setElapsedTime(Math.floor(elapsed / 1000));
      }, 100); // Actualizar cada 100ms para suavidad

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isActive]);

  const reset = () => {
    setElapsedTime(0);
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return { elapsedTime, reset };
}

