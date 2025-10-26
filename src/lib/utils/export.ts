import type { Activity, LatLng } from "../types";

/**
 * Genera un archivo GPX de una actividad
 * @param activity Actividad a exportar
 * @returns String con el contenido GPX
 */
export function generateGPX(activity: Activity): string {
  const date = new Date(activity.startTime).toISOString();
  
  const trackPoints = activity.route
    .map((point, index) => {
      const timestamp = new Date(
        activity.startTime + (index / activity.route.length) * activity.duration * 1000
      ).toISOString();
      
      return `      <trkpt lat="${point[0]}" lon="${point[1]}">
        <time>${timestamp}</time>
      </trkpt>`;
    })
    .join("\n");

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Fitness Tracker" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${activity.name || `${activity.type} - ${date}`}</name>
    <time>${date}</time>
  </metadata>
  <trk>
    <name>${activity.type}</name>
    <type>${activity.type}</type>
    <trkseg>
${trackPoints}
    </trkseg>
  </trk>
</gpx>`;

  return gpx;
}

/**
 * Descarga un archivo GPX
 * @param activity Actividad a exportar
 */
export function downloadGPX(activity: Activity): void {
  const gpxContent = generateGPX(activity);
  const blob = new Blob([gpxContent], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `activity_${activity.id}.gpx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Genera datos para compartir en redes sociales
 * @param activity Actividad a compartir
 * @returns Texto formateado para compartir
 */
export function generateShareText(activity: Activity): string {
  const distance = (activity.distance / 1000).toFixed(2);
  const duration = formatDuration(activity.duration);
  const pace = (activity.duration / 60 / (activity.distance / 1000)).toFixed(2);

  const activityNames = {
    running: "🏃 Carrera",
    cycling: "🚴 Ciclismo",
    walking: "🚶 Caminata",
  };

  return `${activityNames[activity.type]}
📊 Distancia: ${distance} km
⏱️ Tiempo: ${duration}
⚡ Pace: ${pace} min/km
🔥 Calorías: ${activity.calories} kcal

#fitness #${activity.type}`;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
}

/**
 * Copia texto al portapapeles
 * @param text Texto a copiar
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
}

