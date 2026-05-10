'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/toast'
import {
  Search, SlidersHorizontal, ArrowUpDown, LayoutGrid,
  IndianRupee, CalendarDays, MapPin, ArrowLeft, Plus,
  Camera, Utensils, Mountain, ShoppingBag, Music, Sunset,
  Loader2, Trash2, Edit3, Check, X,
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, staggerItem, formatDateRange } from '@/lib/utils'
import type { Trip } from '@/types/trip'
import type { Stop } from '@/types/stop'

// ─── Activity type config ─────────────────────────────────────────────────────
const ACT_TYPES = [
  { value: 'sightseeing', icon: Camera, color: 'text-blue-500' },
  { value: 'food', icon: Utensils, color: 'text-orange-500' },
  { value: 'adventure', icon: Mountain, color: 'text-green-500' },
  { value: 'shopping', icon: ShoppingBag, color: 'text-pink-500' },
  { value: 'nightlife', icon: Music, color: 'text-purple-500' },
  { value: 'leisure', icon: Sunset, color: 'text-amber-500' },
]
function ActIcon({ type }: { type: string }) {
  const t = ACT_TYPES.find(a => a.value === type) ?? ACT_TYPES[0]
  return <t.icon className={`w-4 h-4 ${t.color}`} />
}

// ─── Inline Add Activity Form ─────────────────────────────────────────────────
function AddActivityRow({
  stopId, dayNum, onAdded,
}: {
  stopId: string
  dayNum: number
  onAdded: (act: any) => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const save = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          stop_id: stopId,
          name,
          estimated_cost: parseFloat(cost) || 0,
          day_number: dayNum,
          type: 'sightseeing',
          is_ai_suggested: false,
        })
        .select()
        .single()
      if (error) throw error
      onAdded(data)
      toast('Activity added!', 'success')
      setName(''); setCost(''); setOpen(false)
    } catch (err: any) {
      toast(err.message || 'Failed to add', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-3 text-sm text-gray-400 hover:border-amber-400 hover:text-amber-500 transition-colors relative z-10"
      >
        <Plus className="w-4 h-4" /> Add activity to Day {dayNum}
      </button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 relative z-10"
    >
      <div className="flex-1 bg-amber-50 border-2 border-amber-300 rounded-xl p-3 flex items-center gap-2">
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          placeholder="Activity name..."
          className="flex-1 bg-transparent text-sm text-navy-900 placeholder:text-gray-400 outline-none"
        />
      </div>
      <div className="w-36 bg-amber-50 border-2 border-amber-300 rounded-xl p-3 flex items-center gap-1">
        <IndianRupee className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <input
          value={cost}
          onChange={e => setCost(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          placeholder="Cost"
          type="number"
          className="w-full bg-transparent text-sm text-navy-900 placeholder:text-gray-400 outline-none"
        />
      </div>
      <button
        onClick={save}
        disabled={saving || !name.trim()}
        className="w-10 h-10 my-auto rounded-xl bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center disabled:opacity-50 transition-all flex-shrink-0"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
      </button>
      <button
        onClick={() => { setOpen(false); setName(''); setCost('') }}
        className="w-10 h-10 my-auto rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

// ─── Editable Activity Row ─────────────────────────────────────────────────────
function ActivityRow({
  act, onDeleted, onUpdated,
}: {
  act: any
  onDeleted: (id: string) => void
  onUpdated: (id: string, name: string, cost: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(act.name)
  const [cost, setCost] = useState(String(act.estimated_cost || 0))
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const save = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('activities')
        .update({ name, estimated_cost: parseFloat(cost) || 0 })
        .eq('id', act.id)
      if (error) throw error
      onUpdated(act.id, name, parseFloat(cost) || 0)
      toast('Updated!', 'success')
      setEditing(false)
    } catch (err: any) {
      toast(err.message || 'Failed to update', 'error')
    } finally {
      setSaving(false)
    }
  }

  const del = async () => {
    try {
      await supabase.from('activities').delete().eq('id', act.id)
      onDeleted(act.id)
      toast('Removed', 'success')
    } catch {
      toast('Failed to remove', 'error')
    }
  }

  return (
    <div className="flex gap-3 relative z-10 group">
      {editing ? (
        <>
          <div className="flex-1 bg-white border-2 border-amber-400 rounded-xl p-3 flex items-center gap-2 shadow-sm">
            <ActIcon type={act.type} />
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && save()}
              className="flex-1 text-sm text-navy-900 outline-none"
            />
          </div>
          <div className="w-36 bg-white border-2 border-amber-400 rounded-xl p-3 flex items-center gap-1 shadow-sm">
            <IndianRupee className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              value={cost}
              onChange={e => setCost(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && save()}
              type="number"
              className="w-full text-sm text-navy-900 outline-none"
            />
          </div>
          <button onClick={save} disabled={saving}
            className="w-10 h-10 my-auto rounded-xl bg-green-500 hover:bg-green-400 text-white flex items-center justify-center disabled:opacity-50 flex-shrink-0">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          </button>
          <button onClick={() => setEditing(false)}
            className="w-10 h-10 my-auto rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          <div className="flex-1 bg-white border-2 border-navy-900 rounded-xl p-4 flex items-center gap-3 min-h-[56px] shadow-sm hover:shadow-md transition-shadow">
            <ActIcon type={act.type} />
            <span className="text-navy-900 font-medium text-sm flex-1">{act.name}</span>
            {/* Edit/delete on hover */}
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              <button onClick={() => setEditing(true)}
                className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={del}
                className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="w-36 bg-white border-2 border-navy-900 rounded-xl p-4 flex items-center justify-center min-h-[56px] shadow-sm">
            <span className="text-navy-900 font-semibold text-sm flex items-center gap-0.5">
              {act.estimated_cost > 0
                ? <><IndianRupee className="w-3.5 h-3.5" />{act.estimated_cost.toLocaleString('en-IN')}</>
                : <span className="text-gray-400 text-xs">Free</span>
              }
            </span>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main Trip Detail Page ────────────────────────────────────────────────────
export default function TripDetailPage({ params }: { params: { tripId: string } }) {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [stops, setStops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let mounted = true
    const timer = setTimeout(() => { if (mounted) setLoading(false) }, 5000)

    const fetch = async () => {
      try {
        const { data: tripData } = await supabase.from('trips').select('*').eq('id', params.tripId).single()
        const { data: stopsData } = await supabase.from('stops').select('*, activities(*)').eq('trip_id', params.tripId).order('order_index', { ascending: true })
        if (mounted) {
          setTrip(tripData)
          setStops(stopsData || [])
        }
      } catch { /* ignore */ } finally {
        clearTimeout(timer)
        if (mounted) setLoading(false)
      }
    }
    fetch()
    return () => { mounted = false; clearTimeout(timer) }
  }, [params.tripId])

  // Build days from stops
  const days = stops.map((stop, si) => ({
    day: si + 1,
    city: stop.city,
    stopId: stop.id,
    activities: [...(stop.activities || [])].sort((a, b) => (a.day_number || 0) - (b.day_number || 0)),
  }))

  const allActivities = days.flatMap(d => d.activities)
  const filtered = searchQuery
    ? allActivities.filter(a => a.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : null

  const totalExpense = allActivities.reduce((s: number, a: any) => s + (a.estimated_cost || 0), 0)

  // Mutate helpers
  const addActivity = (stopIdx: number, act: any) => {
    setStops(prev => prev.map((s, i) => i === stopIdx
      ? { ...s, activities: [...(s.activities || []), act] }
      : s))
  }
  const deleteActivity = (stopIdx: number, actId: string) => {
    setStops(prev => prev.map((s, i) => i === stopIdx
      ? { ...s, activities: (s.activities || []).filter((a: any) => a.id !== actId) }
      : s))
  }
  const updateActivity = (stopIdx: number, actId: string, name: string, cost: number) => {
    setStops(prev => prev.map((s, i) => i === stopIdx
      ? { ...s, activities: (s.activities || []).map((a: any) => a.id === actId ? { ...a, name, estimated_cost: cost } : a) }
      : s))
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in">

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-sm"
          />
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
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl border border-gray-100 shadow-xl z-20 overflow-hidden">
                {['Day order', 'Name A–Z', 'Highest cost'].map(opt => (
                  <button key={opt} onClick={() => setShowSortMenu(false)}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trip Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/trips" className="text-gray-400 hover:text-navy-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-navy-900">
              {loading ? 'Loading…' : trip?.name || 'My Trip'}
            </h1>
          </div>
          <div className="flex items-center gap-4 ml-8 text-sm text-gray-500">
            {trip?.start_date && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-amber-500" />
                {formatDateRange(trip.start_date, trip.end_date)}
              </span>
            )}
            {stops.length > 0 && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500" />
                {stops.length} {stops.length === 1 ? 'stop' : 'stops'}
              </span>
            )}
          </div>
        </div>

        {/* ✅ FIX: Use absolute paths with tripId */}
        <div className="flex gap-2 flex-wrap ml-8">
          {[
            { label: 'Builder', href: `/trips/${params.tripId}/builder` },
            { label: 'Budget',  href: `/trips/${params.tripId}/budget` },
            { label: 'Packing', href: `/trips/${params.tripId}/packing` },
            { label: 'Notes',   href: `/trips/${params.tripId}/notes` },
          ].map(tab => (
            <Link key={tab.href} href={tab.href}
              className="px-4 py-2 text-xs font-semibold text-navy-900 bg-white border border-gray-200 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-colors">
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Days', value: days.length || (trip?.start_date && trip?.end_date
              ? Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / 86400000) + 1
              : 0) },
          { label: 'Activities', value: allActivities.length },
          { label: 'Est. Expense', value: `₹${totalExpense.toLocaleString('en-IN')}` },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Empty state — no stops yet */}
      {!loading && days.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-5xl mb-3">🗺️</div>
          <p className="font-bold text-navy-900 mb-2">No itinerary built yet</p>
          <p className="text-sm text-gray-400 mb-5">Use the Builder to plan your day-by-day activities</p>
          <Link href={`/trips/${params.tripId}/builder`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-navy-900 font-bold text-sm rounded-xl hover:bg-amber-400 transition-all">
            <Plus className="w-4 h-4" /> Open Builder
          </Link>
        </div>
      )}

      {/* Search results */}
      {filtered && filtered.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
          {filtered.map((act: any) => (
            <div key={act.id} className="flex gap-3">
              <div className="flex-1 bg-white border-2 border-navy-900 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <ActIcon type={act.type} />
                <span className="text-navy-900 font-medium text-sm">{act.name}</span>
              </div>
              <div className="w-36 bg-white border-2 border-navy-900 rounded-xl p-4 flex items-center justify-center shadow-sm">
                <span className="text-navy-900 font-semibold text-sm flex items-center gap-0.5">
                  {act.estimated_cost > 0
                    ? <><IndianRupee className="w-3.5 h-3.5" />{act.estimated_cost.toLocaleString('en-IN')}</>
                    : <span className="text-gray-400 text-xs">Free</span>}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Column Headers */}
      {!filtered && days.length > 0 && (
        <div className="flex items-center pl-24 pr-4 -mb-4">
          <div className="flex-1 text-center">
            <span className="text-sm font-semibold text-navy-900">Physical Activity</span>
          </div>
          <div className="w-36 text-center">
            <span className="text-sm font-semibold text-navy-900">Expense</span>
          </div>
        </div>
      )}

      {/* Itinerary Timeline — editable */}
      {!filtered && (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
          {days.map((dayData, si) => (
            <motion.div key={dayData.day} variants={staggerItem} className="flex items-start gap-4">
              {/* Day badge */}
              <div className="mt-2 w-20 flex-shrink-0">
                <div className="px-3 py-2 border-2 border-navy-900 bg-navy-900 text-white rounded-xl font-bold text-center text-sm">
                  Day {dayData.day}
                </div>
                {dayData.city && (
                  <p className="text-[10px] text-center text-gray-400 mt-1 truncate px-1">
                    {dayData.city}
                  </p>
                )}
              </div>

              {/* Activities + add row */}
              <div className="flex-1 space-y-3 relative">
                <div className="absolute left-1/2 top-8 bottom-8 w-px bg-gray-200 -translate-x-1/2 z-0" />

                <AnimatePresence>
                  {dayData.activities.map((act: any) => (
                    <motion.div
                      key={act.id}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <ActivityRow
                        act={act}
                        onDeleted={id => deleteActivity(si, id)}
                        onUpdated={(id, name, cost) => updateActivity(si, id, name, cost)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* ✅ FIX: Inline add activity — no navigation needed */}
                <AddActivityRow
                  stopId={dayData.stopId}
                  dayNum={dayData.day}
                  onAdded={act => addActivity(si, act)}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
