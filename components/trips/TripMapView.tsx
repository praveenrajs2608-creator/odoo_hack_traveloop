'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useState } from 'react'
import type { Stop } from '@/types/stop'
import { DEFAULT_CENTER, DEFAULT_ZOOM, getBounds, getRouteCoordinates } from '@/lib/mapbox'

interface TripMapViewProps {
  stops: Stop[]
  interactive?: boolean
  className?: string
}

export function TripMapView({ stops, interactive = true, className }: TripMapViewProps) {
  const [MapComponents, setMapComponents] = useState<any>(null)

  useEffect(() => {
    // Dynamically import Leaflet + react-leaflet only on the client
    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
    ]).then(([L, RL]) => {
      // Fix default marker icons in Next.js/Webpack
      delete (L.default.Icon.Default.prototype as any)._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      setMapComponents({
        MapContainer: RL.MapContainer,
        TileLayer: RL.TileLayer,
        Marker: RL.Marker,
        Popup: RL.Popup,
        Polyline: RL.Polyline,
        useMap: RL.useMap,
        L: L.default,
      })
    })
  }, [])

  const validStops = useMemo(
    () => stops.filter(s => s.latitude && s.longitude),
    [stops]
  )
  const routeCoords = useMemo(() => getRouteCoordinates(stops), [stops])
  const bounds = useMemo(() => getBounds(stops), [stops])

  // Loading state
  if (!MapComponents) {
    return (
      <div className={className || 'w-full h-full min-h-[400px] rounded-2xl overflow-hidden'}>
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <span className="text-sm text-gray-400">Loading map...</span>
        </div>
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, Popup, Polyline } = MapComponents

  return (
    <div className={className || 'w-full h-full min-h-[400px] rounded-2xl overflow-hidden'}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        bounds={bounds || undefined}
        boundsOptions={{ padding: [40, 40] }}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Auto-fit bounds */}
        {bounds && <AutoFitBounds bounds={bounds} useMap={MapComponents.useMap} />}

        {/* Route polyline */}
        {routeCoords.length >= 2 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: '#F5A623',
              weight: 3,
              dashArray: '8, 12',
              opacity: 0.8,
            }}
          />
        )}

        {/* Stop markers with popups */}
        {validStops.map((stop, i) => (
          <Marker key={stop.id} position={[stop.latitude!, stop.longitude!]}>
            <Popup>
              <div className="text-center min-w-[120px]">
                <p className="font-bold text-sm text-gray-900">{stop.city}</p>
                <p className="text-xs text-gray-500">{stop.country}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">
                  Stop #{i + 1}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

// Helper component that fits bounds when stops change
function AutoFitBounds({
  bounds,
  useMap,
}: {
  bounds: [[number, number], [number, number]]
  useMap: () => any
}) {
  const map = useMap()

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 })
    }
  }, [bounds, map])

  return null
}
