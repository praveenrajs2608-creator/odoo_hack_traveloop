'use client'

import { formatDateRange, formatCurrency } from '@/lib/utils'
import { DayTimeline } from '@/components/itinerary/DayTimeline'
import { MapPin, Calendar, DollarSign } from 'lucide-react'
import type { Trip } from '@/types/trip'
import type { Stop } from '@/types/stop'

interface PublicTripViewProps {
  trip: Trip
  stops: Stop[]
}

export function PublicTripView({ trip, stops }: PublicTripViewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] bg-navy-900 overflow-hidden">
        {trip.cover_photo_url ? (
          <img
            src={trip.cover_photo_url}
            alt={trip.name}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-amber-400 text-sm font-semibold tracking-wider uppercase mb-3">
              🧳 Traveloop Itinerary
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              {trip.name}
            </h1>
            {trip.description && (
              <p className="text-white/70 text-lg max-w-2xl">{trip.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-6 mt-6 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                {formatDateRange(trip.start_date, trip.end_date)}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                {stops.length} {stops.length === 1 ? 'city' : 'cities'}
              </span>
              {trip.total_budget > 0 && (
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  {formatCurrency(trip.total_budget)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Stops Overview */}
        <div className="flex flex-wrap gap-3 mb-10">
          {stops.map((stop, i) => (
            <div
              key={stop.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-[10px] font-bold text-navy-900">{i + 1}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{stop.city}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <DayTimeline stops={stops} />
      </div>

      {/* Footer */}
      <div className="bg-navy-900 py-8 text-center">
        <p className="text-white/40 text-sm">
          Created with <span className="text-amber-400">🧳 Traveloop</span> — AI-Powered Travel Planning
        </p>
      </div>
    </div>
  )
}
