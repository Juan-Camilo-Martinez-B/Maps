declare module "react-leaflet" {
  export const MapContainer: any;
  export const TileLayer: any;
  export const Marker: any;
  export const Polyline: any;
  export function useMapEvents(events: Record<string, any>): any;
}

declare module "leaflet" {
  const L: any;
  export default L;
  export = L;
}


