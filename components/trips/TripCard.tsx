'use client'

import { motion } from 'framer-motion'
import { formatDateRange, formatCurrency, getTripStatus } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import type { Trip } from '@/types/trip'
import { useState, useRef, useEffect } from 'react'

const statusVariant = {
  upcoming: 'info' as const,
  ongoing: 'success' as const,
  completed: 'default' as const,
  draft: 'warning' as const,
}

interface TripCardProps {
  trip: Trip
  onDelete?: (id: string) => void
}

export function TripCard({ trip, onDelete }: TripCardProps) {
  const status = getTripStatus(trip)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl overflow-hidden shadow-card bg-white border border-gray-100 group"
    >
      {/* Cover Image */}
      <div className="relative h-44 bg-gradient-to-br from-navy-800 to-navy-900 overflow-hidden">
        {trip.cover_photo_url ? (
          <img
            src={trip.cover_photo_url}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-30">🌍</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge variant={statusVariant[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-4">
          <h3 className="font-bold text-lg text-white drop-shadow-md">{trip.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          {formatDateRange(trip.start_date, trip.end_date)}
        </div>

        {trip.stops && trip.stops.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {trip.stops.slice(0, 3).map(stop => (
              <span
                key={stop.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                <MapPin className="w-3 h-3" />
                {stop.city}
              </span>
            ))}
            {trip.stops.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-500">
                +{trip.stops.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <span className="font-mono font-semibold text-amber-500">
            {formatCurrency(trip.total_budget || 0)}
          </span>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-1 w-40 bg-white rounded-xl shadow-float border border-gray-100 py-1 z-10">
                <Link
                  href={`/trips/${trip.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4" /> View
                </Link>
                <Link
                  href={`/trips/${trip.id}/builder`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </Link>
                {onDelete && (
                  <button
                    onClick={() => { onDelete(trip.id); setMenuOpen(false) }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-coral-400 hover:bg-gray-50 w-full text-left"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
