'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/utils'
import {
  Search, SlidersHorizontal, ArrowUpDown, LayoutGrid,
  Sparkles, Loader2, MapPin, Clock, IndianRupee,
  Camera, Utensils, Mountain, ShoppingBag, Landmark, Moon, Bus, Hotel, Compass,
} from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import type { Activity, ActivityType } from '@/types/activity'

const ACTIVITY_TYPES = [
  { label: 'All', value: '', emoji: '🗺️' },
  { label: 'Sightseeing', value: 'sightseeing', emoji: '📸' },
  { label: 'Food', value: 'food', emoji: '🍜' },
  { label: 'Adventure', value: 'adventure', emoji: '🏔️' },
  { label: 'Shopping', value: 'shopping', emoji: '🛍️' },
  { label: 'Culture', value: 'culture', emoji: '🎭' },
  { label: 'Nightlife', value: 'nightlife', emoji: '🌙' },
  { label: 'Transport', value: 'transport', emoji: '🚌' },
  { label: 'Stay', value: 'stay', emoji: '🏨' },
]

const ACTIVITY_ICON: Record<string, any> = {
  sightseeing: Camera, food: Utensils, adventure: Mountain,
  shopping: ShoppingBag, culture: Landmark, nightlife: Moon, transport: Bus, stay: Hotel,
}

const ACTIVITY_COLOR: Record<string, string> = {
  sightseeing: 'bg-blue-100 text-blue-700', food: 'bg-orange-100 text-orange-700',
  adventure: 'bg-green-100 text-green-700', shopping: 'bg-pink-100 text-pink-700',
  culture: 'bg-purple-100 text-purple-700', nightlife: 'bg-indigo-100 text-indigo-700',
  transport: 'bg-gray-100 text-gray-700', stay: 'bg-teal-100 text-teal-700',
}

const SORT_OPTIONS = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Name A–Z', value: 'name' },
  { label: 'Lowest cost', value: 'cost_asc' },
  { label: 'Highest cost', value: 'cost_desc' },
]

export default function ActivitiesPage() {
  const { toast } = useToast()
  const [city, setCity] = useState('')
  const [query, setQuery] = useState('')
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [activeType, setActiveType] = useState('')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  const handleSuggest = async () => {
    if (!city.trim()) { toast('Please enter a city name', 'error'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/ai/suggest-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, country: '' }),
      })
      const data = await res.json()
      if (data.activities) {
        setActivities(data.activities.map((a: any, i: number) => ({
          ...a, id: `ai-${i}`, stop_id: '', is_ai_suggested: true,
          created_at: new Date().toISOString(),
        })))
        toast(`Found ${data.activities.length} activities!`, 'success')
      }
    } catch { toast('Failed to get suggestions', 'error') }
    finally { setLoading(false) }
  }

  const filtered = useMemo(() => {
    let list = [...activities]
    if (activeType) list = list.filter(a => a.type === activeType)
    if (query) list = list.filter(a => a.name.toLowerCase().includes(query.toLowerCase()))
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'cost_asc') list.sort((a, b) => (a.estimated_cost || 0) - (b.estimated_cost || 0))
    if (sortBy === 'cost_desc') list.sort((a, b) => (b.estimated_cost || 0) - (a.estimated_cost || 0))
    return list
  }, [activities, activeType, query, sortBy])

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in">

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Filter results..." value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-sm" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <LayoutGrid className="w-4 h-4" /><span>Group by</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <SlidersHorizontal className="w-4 h-4" /><span>Filter</span>
          </button>
          <div className="relative flex-1 sm:flex-none">
            <button onClick={() => setShowSortMenu(!showSortMenu)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <ArrowUpDown className="w-4 h-4" /><span>Sort by</span>
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-gray-100 shadow-xl z-20 overflow-hidden">
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSortMenu(false) }}
                    className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === opt.value ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Search Panel */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
              Discover Activities with AI
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <input type="text" placeholder="Enter a city (e.g. Paris, Tokyo, Goa...)"
                value={city} onChange={e => setCity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSuggest()}
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/50 transition-all" />
            </div>
          </div>
          <button onClick={handleSuggest} disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Searching…' : 'Find Activities'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-5">
          {ACTIVITY_TYPES.map(t => (
            <button key={t.value} onClick={() => setActiveType(t.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                ${activeType === t.value ? 'bg-amber-500 border-amber-500 text-navy-900' : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'}`}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-navy-900">
            {filtered.length > 0 ? `${filtered.length} Results` : 'Results'}
          </h2>
          {city && !loading && filtered.length > 0 && (
            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">{city}</span>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
            {filtered.map(activity => {
              const Icon = ACTIVITY_ICON[activity.type] || Compass
              const colorClass = ACTIVITY_COLOR[activity.type] || 'bg-gray-100 text-gray-700'
              return (
                <motion.div key={activity.id} variants={staggerItem}>
                  <div className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-amber-200 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-navy-900">{activity.name}</h3>
                          {activity.is_ai_suggested && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />AI Pick
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                          {activity.description || 'No description available'}
                        </p>
                        {activity.duration_minutes && (
                          <span className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                            <Clock className="w-3 h-3" />
                            {activity.duration_minutes >= 60 ? `${Math.floor(activity.duration_minutes / 60)}h` : `${activity.duration_minutes}m`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 whitespace-nowrap sm:flex-col sm:items-end">
                      {activity.estimated_cost && (
                        <span className="flex items-center gap-0.5 text-base font-bold text-amber-600">
                          <IndianRupee className="w-4 h-4" />
                          {activity.estimated_cost.toLocaleString('en-IN')}
                        </span>
                      )}
                      <button className="px-4 py-2 text-xs font-bold text-navy-900 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-xl transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <div className="text-center py-20 rounded-2xl bg-white border border-dashed border-gray-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Compass className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="font-semibold text-navy-900 mb-1">Discover Activities</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Enter a city name above and let our AI find the best activities for you.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
