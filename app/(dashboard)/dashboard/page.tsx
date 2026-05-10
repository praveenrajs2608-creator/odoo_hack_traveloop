'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useTrips } from '@/hooks/useTrips'
import { TripCard } from '@/components/trips/TripCard'
import { SkeletonCard } from '@/components/ui/skeleton'
import { staggerContainer, staggerItem } from '@/lib/utils'
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const regions = [
  { name: 'Rajasthan', image: '/images/rajasthan.png', tag: 'Heritage & Culture' },
  { name: 'Kerala', image: '/images/kerala.png', tag: 'Backwaters & Nature' },
  { name: 'Goa', image: '/images/goa.png', tag: 'Beaches & Nightlife' },
  { name: 'Kashmir', image: '/images/kashmir.png', tag: 'Mountains & Snow' },
  { name: 'Ladakh', image: '/images/ladakh.png', tag: 'Adventure & Lakes' },
  { name: 'Rajasthan', image: '/images/rajasthan.png', tag: 'Forts & Palaces' },
]

export default function DashboardPage() {
  const { profile } = useAuth()
  const { trips, loading: tripsLoading, deleteTrip } = useTrips()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest')
  const [showSortMenu, setShowSortMenu] = useState(false)

  const filteredTrips = useMemo(() => {
    let result = [...trips]

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        t =>
          t.name?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      )
    }

    // Sort
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    if (sortBy === 'oldest') result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    if (sortBy === 'name') result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))

    return result
  }, [trips, searchQuery, sortBy])

  return (
    <div className="space-y-6 animate-in">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden h-[280px] md:h-[340px] group">
        <Image
          src="/images/banner.png"
          alt="Explore the world with Traveloop"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/40 to-transparent" />

        {/* Banner content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              ✨ AI-Powered Travel Planning
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              Where to next, {profile?.full_name?.split(' ')[0] || 'Traveler'}?
            </h1>
            <p className="text-white/60 text-sm max-w-lg">
              Discover destinations, build itineraries, and track your adventures — all in one place.
            </p>
          </motion.div>
        </div>

        {/* Floating CTA */}
        <Link
          href="/trips/new"
          className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-2 px-5 py-2.5 
                     bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-sm rounded-full 
                     shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          Plan a Trip
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips, destinations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm 
                       placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 
                       focus:border-amber-500 transition-all shadow-sm"
          />
        </div>

        {/* Filter buttons */}
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
          <LayoutGrid className="w-4 h-4" />
          <span className="hidden md:inline">Group by</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden md:inline">Filter</span>
        </button>
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden md:inline">Sort by...</span>
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

      {/* Top Regional Selections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy-900">Top Regional Selections</h2>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
          {regions.map((region, i) => (
            <motion.div
              key={`${region.name}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex-shrink-0 w-[180px] group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 shadow-md">
                <Image
                  src={region.image}
                  alt={region.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-bold text-sm">{region.name}</p>
                  <p className="text-white/50 text-[10px] mt-0.5">{region.tag}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Previous Trips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy-900">
            Previous Trips
            {filteredTrips.length > 0 && (
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredTrips.length})
              </span>
            )}
          </h2>
          <Link
            href="/trips"
            className="text-sm text-amber-500 hover:text-amber-600 font-medium transition-colors"
          >
            View All →
          </Link>
        </div>

        {tripsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredTrips.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredTrips.map(trip => (
              <motion.div key={trip.id} variants={staggerItem}>
                <TripCard trip={trip} onDelete={deleteTrip} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 rounded-2xl bg-white border border-gray-100">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">No trips yet</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Start planning your first adventure. Describe your dream trip and let AI craft the perfect itinerary!
            </p>
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 
                         text-navy-900 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Create Your First Trip
            </Link>
          </div>
        )}
      </div>

      {/* Floating Plan a Trip button (mobile) */}
      <Link
        href="/trips/new"
        className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-40 flex items-center gap-2 
                   px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-sm 
                   rounded-full shadow-xl shadow-amber-500/30 transition-all hover:scale-105
                   ring-4 ring-amber-500/10"
      >
        <Plus className="w-5 h-5" />
        <span>Plan a trip</span>
      </Link>
    </div>
  )
}
