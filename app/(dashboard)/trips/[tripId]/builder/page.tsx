'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Calendar, Plus, Clock, MapPin, Utensils,
  Mountain, Camera, ShoppingBag, Music, Sunset, Trash2,
  ChevronDown, ChevronUp, Sparkles, Loader2, Map,
} from 'lucide-react'
import Link from 'next/link'
import { TripMapView } from '@/components/trips/TripMapView'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Trip {
  id: string
  name: string
  start_date: string | null
  end_date: string | null
  description: string | null
  total_budget: number
}

interface DayActivity {
  id: string
  name: string
  type: string
  time_of_day: string
  estimated_cost: number
  notes: string
  day_number: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDaysArray(start: string, end: string) {
  const days: Date[] = []
  const cur = new Date(start)
  const last = new Date(end)
  while (cur <= last) {
    days.push(new Date(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

function formatDay(date: Date) {
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatDayFull(date: Date) {
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const ACTIVITY_TYPES = [
  { value: 'sightseeing', label: 'Sightseeing', icon: Camera, color: 'text-blue-500 bg-blue-50' },
  { value: 'food', label: 'Food & Dining', icon: Utensils, color: 'text-orange-500 bg-orange-50' },
  { value: 'adventure', label: 'Adventure', icon: Mountain, color: 'text-green-500 bg-green-50' },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-pink-500 bg-pink-50' },
  { value: 'nightlife', label: 'Nightlife', icon: Music, color: 'text-purple-500 bg-purple-50' },
  { value: 'leisure', label: 'Leisure', icon: Sunset, color: 'text-amber-500 bg-amber-50' },
  { value: 'travel', label: 'Travel', icon: MapPin, color: 'text-gray-500 bg-gray-50' },
]

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night']

function getActivityStyle(type: string) {
  return ACTIVITY_TYPES.find(t => t.value === type) ?? ACTIVITY_TYPES[0]
}

// ─── Day Card ─────────────────────────────────────────────────────────────────
function DayCard({
  day, dayIndex, activities, tripId, onActivityAdded, onActivityDeleted,
}: {
  day: Date
  dayIndex: number
  activities: DayActivity[]
  tripId: string
  onActivityAdded: (a: DayActivity) => void
  onActivityDeleted: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(dayIndex === 0)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', type: 'sightseeing', time_of_day: 'Morning',
    estimated_cost: '', notes: '',
  })
  const { toast } = useToast()
  const isToday = new Date().toDateString() === day.toDateString()

  const handleAdd = async () => {
    if (!form.name.trim()) { toast('Activity name is required', 'error'); return }
    setSaving(true)
    try {
      // Find or create a stop for this trip to attach the activity
      let stopId: string | null = null
      const { data: existingStops } = await supabase
        .from('stops')
        .select('id')
        .eq('trip_id', tripId)
        .order('order_index', { ascending: true })
        .limit(1)

      if (existingStops && existingStops.length > 0) {
        stopId = existingStops[0].id
      } else {
        // Create a default stop for this trip
        const { data: newStop } = await supabase
          .from('stops')
          .insert({ trip_id: tripId, city: 'General', country: '', order_index: 0 })
          .select('id')
          .single()
        stopId = newStop?.id ?? null
      }

      if (!stopId) throw new Error('Could not find or create a stop')

      const { data, error } = await supabase
        .from('activities')
        .insert({
          stop_id: stopId,
          name: form.name,
          type: form.type,
          time_of_day: form.time_of_day.toLowerCase(),
          estimated_cost: parseFloat(form.estimated_cost) || 0,
          description: form.notes,
          day_number: dayIndex + 1,
          is_ai_suggested: false,
        })
        .select()
        .single()

      if (error) throw error
      onActivityAdded({ ...data, notes: data.description } as DayActivity)
      toast('Activity added!', 'success')
      setForm({ name: '', type: 'sightseeing', time_of_day: 'Morning', estimated_cost: '', notes: '' })
      setShowForm(false)
    } catch (err: any) {
      toast(err.message || 'Failed to add activity', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('activities').delete().eq('id', id)
      onActivityDeleted(id)
      toast('Removed', 'success')
    } catch {
      toast('Failed to remove', 'error')
    }
  }

  const dayTotal = activities.reduce((s, a) => s + (a.estimated_cost || 0), 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: dayIndex * 0.04 }}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all
        ${isToday ? 'border-amber-300 shadow-amber-100' : 'border-gray-100'}`}
    >
      {/* Day Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors text-left"
      >
        {/* Day number badge */}
        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0
          ${isToday ? 'bg-amber-500 text-navy-900' : 'bg-navy-900 text-white'}`}
        >
          <span className="text-xs font-medium opacity-70">Day</span>
          <span className="text-lg font-bold leading-none">{dayIndex + 1}</span>
        </div>

        {/* Date info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-navy-900 text-sm">{formatDayFull(day)}</p>
            {isToday && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                TODAY
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {activities.length === 0
              ? 'No activities planned'
              : `${activities.length} activit${activities.length === 1 ? 'y' : 'ies'}`}
            {dayTotal > 0 && ` · ₹${dayTotal.toLocaleString()} est.`}
          </p>
        </div>

        {/* Activity type dots */}
        <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
          {activities.slice(0, 4).map((a, i) => {
            const style = getActivityStyle(a.type)
            const Icon = style.icon
            return (
              <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center ${style.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            )
          })}
          {activities.length > 4 && (
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
              +{activities.length - 4}
            </div>
          )}
        </div>

        <div className="text-gray-400 flex-shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-50 px-4 pb-4">
              {/* Time slot groups */}
              {TIME_SLOTS.map(slot => {
                const slotActivities = activities.filter(
                  a => a.time_of_day?.toLowerCase() === slot.toLowerCase()
                )
                if (slotActivities.length === 0) return null
                return (
                  <div key={slot} className="mt-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{slot}</p>
                    <div className="space-y-2">
                      {slotActivities.map(activity => {
                        const style = getActivityStyle(activity.type)
                        const Icon = style.icon
                        return (
                          <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-navy-900 truncate">{activity.name}</p>
                              {activity.notes && (
                                <p className="text-xs text-gray-400 truncate">{activity.notes}</p>
                              )}
                            </div>
                            {activity.estimated_cost > 0 && (
                              <span className="text-xs font-semibold text-amber-600 flex-shrink-0">
                                ₹{activity.estimated_cost.toLocaleString()}
                              </span>
                            )}
                            <button
                              onClick={() => handleDelete(activity.id)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Empty state */}
              {activities.length === 0 && !showForm && (
                <div className="text-center py-6 mt-3">
                  <p className="text-3xl mb-2">📋</p>
                  <p className="text-sm text-gray-400">No activities for this day yet</p>
                </div>
              )}

              {/* Add Activity Form */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-3"
                  >
                    <p className="text-xs font-bold text-amber-800">Add Activity</p>

                    {/* Activity name */}
                    <input
                      placeholder="Activity name (e.g. Visit Baga Beach)"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl text-sm
                                 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-navy-900"
                      autoFocus
                    />

                    {/* Type + Time row */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] text-amber-700 font-semibold mb-1">Type</p>
                        <div className="grid grid-cols-2 gap-1">
                          {ACTIVITY_TYPES.map(t => (
                            <button
                              key={t.value}
                              onClick={() => setForm(f => ({ ...f, type: t.value }))}
                              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all
                                ${form.type === t.value
                                  ? 'bg-amber-500 text-navy-900'
                                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                            >
                              <t.icon className="w-3 h-3" />
                              {t.label.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-amber-700 font-semibold mb-1">Time of Day</p>
                        <div className="grid grid-cols-2 gap-1">
                          {TIME_SLOTS.map(slot => (
                            <button
                              key={slot}
                              onClick={() => setForm(f => ({ ...f, time_of_day: slot }))}
                              className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all
                                ${form.time_of_day === slot
                                  ? 'bg-navy-900 text-white'
                                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                            >
                              {slot === 'Morning' ? '🌅' : slot === 'Afternoon' ? '☀️' : slot === 'Evening' ? '🌆' : '🌙'}
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Cost + Notes row */}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Cost (₹)"
                        value={form.estimated_cost}
                        onChange={e => setForm(f => ({ ...f, estimated_cost: e.target.value }))}
                        className="px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm text-navy-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                      <input
                        placeholder="Notes (optional)"
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        className="px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm text-navy-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleAdd}
                        disabled={saving}
                        className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-xs rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        {saving ? 'Saving...' : 'Add Activity'}
                      </button>
                      <button
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2.5 bg-white text-gray-500 text-xs font-medium rounded-xl hover:bg-gray-100 transition-all border border-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add Activity Button */}
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full mt-3 py-2.5 border border-dashed border-amber-300 rounded-xl text-xs font-semibold
                             text-amber-600 hover:bg-amber-50 hover:border-amber-400 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Activity
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Builder Page ────────────────────────────────────────────────────────
export default function BuilderPage({ params }: { params: { tripId: string } }) {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<DayActivity[]>([])
  const [showMap, setShowMap] = useState(false)
  const { toast } = useToast()

  // Fetch trip + existing activities
  useEffect(() => {
    let mounted = true
    const timer = setTimeout(() => { if (mounted) setLoading(false) }, 5000)

    async function fetchData() {
      try {
        // Get trip
        const { data: tripData } = await supabase
          .from('trips')
          .select('*')
          .eq('id', params.tripId)
          .single()

        if (mounted && tripData) setTrip(tripData)

        // Get all stops for this trip, with their activities
        const { data: stops } = await supabase
          .from('stops')
          .select('id, activities(*)')
          .eq('trip_id', params.tripId)

        if (mounted && stops) {
          // Flatten all activities from all stops
          const allActivities = stops.flatMap((s: any) =>
            (s.activities || []).map((a: any) => ({ ...a, notes: a.description }))
          )
          setActivities(allActivities as DayActivity[])
        }
      } catch {
        // ignore
      } finally {
        clearTimeout(timer)
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => { mounted = false; clearTimeout(timer) }
  }, [params.tripId])

  const days = trip?.start_date && trip?.end_date
    ? getDaysArray(trip.start_date, trip.end_date)
    : []

  const totalEstimated = activities.reduce((s, a) => s + (a.estimated_cost || 0), 0)

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto animate-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <Link
            href={`/trips/${params.tripId}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Trip
          </Link>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-500" />
            {trip?.name ?? 'Build Itinerary'}
          </h1>
          {trip?.start_date && trip?.end_date && (
            <p className="text-sm text-gray-400 mt-0.5">
              {new Date(trip.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              {' → '}
              {new Date(trip.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {' · '}{days.length} day{days.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Budget pill */}
          {totalEstimated > 0 && (
            <div className="px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-xs font-semibold text-amber-700">
              ₹{totalEstimated.toLocaleString()} planned
            </div>
          )}
          <button
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all
              ${showMap ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
            <Map className="w-4 h-4" /> {showMap ? 'Hide Map' : 'View Map'}
          </button>
        </div>
      </div>

      {/* Map panel */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 300 }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl overflow-hidden border border-gray-200 mb-6"
          >
            <TripMapView stops={[]} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* No dates set */}
      {days.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-5xl mb-3">📅</div>
          <p className="font-bold text-navy-900 mb-2">No dates set for this trip</p>
          <p className="text-sm text-gray-400 mb-5">
            Go back and set a start & end date to see your day-by-day planner.
          </p>
          <Link
            href={`/trips/${params.tripId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-navy-900 font-bold text-sm rounded-xl hover:bg-amber-400 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Set Trip Dates
          </Link>
        </div>
      )}

      {/* Day-by-day calendar */}
      {days.length > 0 && (
        <div className="space-y-3">
          {/* Progress bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <span className="font-semibold">{activities.length} activities planned</span>
                <span>Budget: ₹{trip?.total_budget?.toLocaleString() || 0}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalEstimated / (trip?.total_budget || 1)) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>₹{totalEstimated.toLocaleString()} planned</span>
                <span>₹{Math.max(0, (trip?.total_budget || 0) - totalEstimated).toLocaleString()} remaining</span>
              </div>
            </div>
          </div>

          {/* Days */}
          {days.map((day, i) => (
            <DayCard
              key={i}
              day={day}
              dayIndex={i}
              activities={activities.filter(a => a.day_number === i + 1)}
              tripId={params.tripId}
              onActivityAdded={(a) => setActivities(prev => [...prev, a])}
              onActivityDeleted={(id) => setActivities(prev => prev.filter(a => a.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
