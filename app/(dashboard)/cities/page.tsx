'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CitySearchBar } from '@/components/cities/CitySearchBar'
import { CityCard } from '@/components/cities/CityCard'
import { SkeletonCard } from '@/components/ui/skeleton'
import Where2Go from '@/components/cities/Where2Go'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { City } from '@/types/activity'

/* ── Static ranked destination data ── */

interface RankedPlace {
  rank: number
  name: string
  image: string
}

const TOP_INDIA: RankedPlace[] = [
  { rank: 1, name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80' },
  { rank: 2, name: 'Ooty', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80' },
  { rank: 3, name: 'Pondicherry', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=80' },
  { rank: 4, name: 'Udaipur', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80' },
  { rank: 5, name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80' },
  { rank: 6, name: 'Varanasi', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=400&q=80' },
  { rank: 7, name: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80' },
  { rank: 8, name: 'Munnar', image: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=400&q=80' },
  { rank: 9, name: 'Rishikesh', image: 'https://images.unsplash.com/photo-1586611292717-f828b167408c?w=400&q=80' },
  { rank: 10, name: 'Leh Ladakh', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80' },
]

const TOP_INTERNATIONAL: RankedPlace[] = [
  { rank: 1, name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80' },
  { rank: 2, name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
  { rank: 3, name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
  { rank: 4, name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
  { rank: 5, name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80' },
  { rank: 6, name: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
  { rank: 7, name: 'Santorini', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80' },
  { rank: 8, name: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80' },
  { rank: 9, name: 'Bangkok', image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&q=80' },
  { rank: 10, name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80' },
]

/* ── Horizontal scroller component ── */

function RankedScroller({ title, places }: { title: string; places: RankedPlace[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const badgeColors = [
    'bg-amber-500',   // 1
    'bg-teal-400',    // 2
    'bg-coral-400',   // 3
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-navy-900">{title}</h2>
        <div className="flex gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
      >
        {places.map(place => (
          <div
            key={place.rank}
            className="flex-shrink-0 w-[140px] group cursor-pointer"
          >
            <div className="relative h-[170px] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-float transition-shadow duration-200">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div
                className={`absolute top-2.5 left-2.5 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                  place.rank <= 3 ? badgeColors[place.rank - 1] : 'bg-navy-900/70 backdrop-blur-sm'
                }`}
              >
                {place.rank}
              </div>
            </div>
            <p className="text-sm font-semibold text-navy-900 mt-2 text-center truncate">
              {place.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main page ── */

export default function CitiesPage() {
  const router = useRouter()
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setCities([])
      setSearched(false)
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/cities?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setCities(data.cities || [])
    } catch {
      setCities([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAddCity = (city: City) => {
    router.push(`/trips/new?city=${city.name}&lat=${city.latitude}&lng=${city.longitude}`)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 mb-1">Explore Cities</h1>
        <p className="text-sm text-gray-400">Discover your next destination</p>
      </div>

      {/* Where2Go quiz */}
      <section>
        <h2 className="text-lg font-bold text-navy-900 mb-3 flex items-center gap-2">
          <span className="text-xl">🧭</span> Where should you go?
        </h2>
        <Where2Go onAddCity={handleAddCity} />
      </section>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#f9fafb] px-4 text-sm text-gray-400 font-medium">
            or browse all cities
          </span>
        </div>
      </div>

      {/* Search */}
      <CitySearchBar onSearch={handleSearch} loading={loading} />

      {/* Ranked destination scrollers */}
      <RankedScroller title="Top Places to visit in India" places={TOP_INDIA} />
      <RankedScroller title="Top Places to visit Outside India" places={TOP_INTERNATIONAL} />

      {/* City search results grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : cities.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {cities.map(city => (
            <motion.div key={city.id} variants={staggerItem}>
              <CityCard city={city} />
            </motion.div>
          ))}
        </motion.div>
      ) : searched ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-gray-100">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 text-sm">No cities found. Try a different search term.</p>
        </div>
      ) : null}
    </div>
  )
}
