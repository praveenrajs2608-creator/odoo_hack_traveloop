'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTrips } from '@/hooks/useTrips'
import { TripCard } from '@/components/trips/TripCard'
import { SkeletonCard } from '@/components/ui/skeleton'
import { getTripStatus, staggerContainer, staggerItem } from '@/lib/utils'
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  PlusCircle,
  Sparkles,
  Plane,
  Clock,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'

export default function TripsPage() {
  const { trips, loading, deleteTrip } = useTrips()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest')
  const [showSortMenu, setShowSortMenu] = useState(false)

  // Categorize trips
  const categorized = useMemo(() => {
    let filtered = [...trips]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        t => t.name?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'newest') filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    if (sortBy === 'oldest') filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    if (sortBy === 'name') filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''))

    return {
      ongoing: filtered.filter(t => getTripStatus(t) === 'ongoing'),
      upcoming: filtered.filter(t => getTripStatus(t) === 'upcoming'),
      completed: filtered.filter(t => getTripStatus(t) === 'completed'),
    }
  }, [trips, searchQuery, sortBy])

  const inputClass = `w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm
    placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30
    focus:border-amber-500 transition-all shadow-sm`

  const TripSection = ({
    title,
    icon: Icon,
    iconColor,
    trips: sectionTrips,
    emptyText,
  }: {
    title: string
    icon: any
    iconColor: string
    trips: any[]
    emptyText: string
  }) => (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-navy-900">{title}</h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
          {sectionTrips.length}
        </span>
      </div>

      {sectionTrips.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {sectionTrips.map(trip => (
            <motion.div key={trip.id} variants={staggerItem}>
              <Link href={`/trips/${trip.id}`} className="block">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-navy-900 text-sm group-hover:text-amber-600 transition-colors truncate">
                        {trip.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                        {trip.description || 'Short overview of the Trip'}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        {trip.start_date && (
                          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                            📅 {new Date(trip.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            {trip.end_date && ` - ${new Date(trip.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                          </span>
                        )}
                        {trip.total_budget > 0 && (
                          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                            💰 ₹{trip.total_budget.toLocaleString()}
                          </span>
                        )}
                        {trip.stops?.length > 0 && (
                          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                            📍 {trip.stops.length} stop{trip.stops.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteTrip(trip.id) }}
                      className="ml-4 text-xs text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-400">{emptyText}</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">My Trips</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {trips.length} trip{trips.length !== 1 && 's'} planned
          </p>
        </div>
        <Link
          href="/trips/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          New Trip
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search bar ...."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={inputClass}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
          <LayoutGrid className="w-4 h-4" />
          <span className="hidden sm:inline">Group by</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
        </button>
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden sm:inline">Sort by...</span>
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl border border-gray-100 shadow-lg z-20 overflow-hidden">
              {[
                { label: 'Newest first', value: 'newest' as const },
                { label: 'Oldest first', value: 'oldest' as const },
                { label: 'Name A-Z', value: 'name' as const },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setShowSortMenu(false) }}
                  className={`block w-full text-left px-4 py-2.5 text-sm transition-colors
                    ${sortBy === opt.value ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trip Sections */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-white border border-gray-100">
          <div className="text-5xl mb-4">🗺️</div>
          <h3 className="text-lg font-bold text-navy-900 mb-2">No trips yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Create your first trip and let AI build your perfect itinerary!
          </p>
          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            Create Trip
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <TripSection
            title="Ongoing"
            icon={Plane}
            iconColor="bg-green-100 text-green-600"
            trips={categorized.ongoing}
            emptyText="No ongoing trips right now"
          />
          <TripSection
            title="Up-coming"
            icon={Clock}
            iconColor="bg-blue-100 text-blue-600"
            trips={categorized.upcoming}
            emptyText="No upcoming trips scheduled"
          />
          <TripSection
            title="Completed"
            icon={CheckCircle2}
            iconColor="bg-gray-100 text-gray-500"
            trips={categorized.completed}
            emptyText="No completed trips yet — start exploring!"
          />
        </div>
      )}
    </div>
  )
}
