import type { Stop } from '@/types/stop'

// OpenStreetMap tile URL (free, no API key required)
export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

// CartoDB Voyager tile (clean, modern style — also free)
export const CARTO_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
export const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

// Default map center (India)
export const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629]
export const DEFAULT_ZOOM = 5

/**
 * Calculate bounds to fit all stops on the map
 */
export function getBounds(stops: Stop[]): [[number, number], [number, number]] | null {
  const valid = stops.filter(s => s.latitude && s.longitude)
  if (valid.length === 0) return null

  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity

  valid.forEach(s => {
    if (s.latitude! < minLat) minLat = s.latitude!
    if (s.latitude! > maxLat) maxLat = s.latitude!
    if (s.longitude! < minLng) minLng = s.longitude!
    if (s.longitude! > maxLng) maxLng = s.longitude!
  })

  // Add padding
  const latPad = (maxLat - minLat) * 0.15 || 0.5
  const lngPad = (maxLng - minLng) * 0.15 || 0.5

  return [
    [minLat - latPad, minLng - lngPad],
    [maxLat + latPad, maxLng + lngPad],
  ]
}

/**
 * Get route coordinates for polyline
 */
export function getRouteCoordinates(stops: Stop[]): [number, number][] {
  return stops
    .filter(s => s.latitude && s.longitude)
    .map(s => [s.latitude!, s.longitude!])
}
