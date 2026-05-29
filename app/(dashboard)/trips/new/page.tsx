'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toast'
import { supabase } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  MapPin,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Plane,
  Utensils,
  Mountain,
  Camera,
  ShoppingBag,
  Palmtree,
  Waves,
  Building2,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react'
import type { ActivityType, TimeOfDay } from '@/types/activity'
import Link from 'next/link'

interface AIStop {
  city: string
  country: string
  latitude: number
  longitude: number
  activities: Array<{
    name: string
    description: string
    type: ActivityType
    estimated_cost: number
    duration_hours: number
    time_of_day: TimeOfDay
    day_number: number
  }>
}

interface AIItinerary {
  trip_name: string
  duration_days: number
  estimated_total_budget: number
  stops: AIStop[]
}

// ─── Success Popup Modal ───────────────────────────────────────────────────────
function SuccessModal({ tripName, tripId, onClose }: { tripName: string; tripId: string; onClose: () => void }) {
  const router = useRouter()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center z-10"
      >
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mx-auto mb-5"
        >
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </motion.div>

        {/* Floating sparkles */}
        {['✈️', '🗺️', '⭐', '🎉'].map((emoji, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{ opacity: [0, 1, 0], y: -60 - i * 10, x: (i % 2 === 0 ? 1 : -1) * (30 + i * 15) }}
            transition={{ delay: 0.3 + i * 0.1, duration: 1.2 }}
            className="absolute text-2xl pointer-events-none"
            style={{ left: '50%', top: '30%' }}
          >
            {emoji}
          </motion.span>
        ))}

        <h2 className="text-xl font-bold text-navy-900 mb-1">Trip Created! 🎉</h2>
        <p className="text-gray-500 text-sm mb-1">
          <span className="font-semibold text-navy-900">"{tripName}"</span> is ready.
        </p>
        <p className="text-gray-400 text-xs mb-6">Your itinerary builder is waiting for you.</p>

        <button
          onClick={() => router.push(`/trips/${tripId}/builder`)}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mb-3"
        >
          <Plane className="w-4 h-4" /> Go to Itinerary Builder <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => router.push('/trips')}
          className="w-full py-2.5 text-sm text-gray-500 hover:text-navy-900 font-medium transition-colors"
        >
          Back to My Trips
        </button>
      </motion.div>
    </div>
  )
}

// ─── Creation Progress Overlay ─────────────────────────────────────────────────
function CreatingOverlay({ step }: { step: number }) {
  const steps = [
    { label: 'Saving trip details', desc: 'Creating your trip in the database...' },
    { label: 'Building AI itinerary', desc: 'Saving cities, stops & activities...' },
    { label: 'Finalizing', desc: 'Almost done! Getting everything ready...' },
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 z-10"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-navy-900 text-center mb-1">Creating Your Trip</h2>
        <p className="text-xs text-gray-400 text-center mb-6">Please wait, this takes a few seconds...</p>

        <div className="space-y-3">
          {steps.map((s, i) => {
            const done = step > i
            const active = step === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  active ? 'bg-amber-50 border border-amber-100' :
                  done ? 'bg-green-50 border border-green-100' :
                  'bg-gray-50 border border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  done ? 'bg-green-500' : active ? 'bg-amber-500' : 'bg-gray-200'
                }`}>
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : active ? (
                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                  ) : (
                    <span className="text-xs text-gray-400 font-bold">{i + 1}</span>
                  )}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${done ? 'text-green-700' : active ? 'text-amber-700' : 'text-gray-400'}`}>
                    {s.label}
                  </p>
                  {active && <p className="text-[10px] text-amber-500 mt-0.5">{s.desc}</p>}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

const SUGGESTIONS = [
  { name: 'Jaipur', country: 'India', tag: 'Heritage', icon: Building2, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { name: 'Goa Beaches', country: 'India', tag: 'Beach', icon: Waves, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { name: 'Kerala Backwaters', country: 'India', tag: 'Nature', icon: Palmtree, color: 'bg-green-50 text-green-600 border-green-100' },
  { name: 'Ladakh', country: 'India', tag: 'Adventure', icon: Mountain, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { name: 'Varanasi', country: 'India', tag: 'Spiritual', icon: Camera, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { name: 'Mumbai Food Tour', country: 'India', tag: 'Food', icon: Utensils, color: 'bg-red-50 text-red-600 border-red-100' },
  { name: 'Manali Trek', country: 'India', tag: 'Adventure', icon: Mountain, color: 'bg-teal-50 text-teal-600 border-teal-100' },
  { name: 'Shopping Delhi', country: 'India', tag: 'Shopping', icon: ShoppingBag, color: 'bg-pink-50 text-pink-600 border-pink-100' },
]

export default function NewTripPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [creationStep, setCreationStep] = useState(-1) // -1 = not creating
  const [successData, setSuccessData] = useState<{ tripName: string; tripId: string } | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResult, setAiResult] = useState<AIItinerary | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')
  const [description, setDescription] = useState('')

  const handleSuggestionClick = (s: typeof SUGGESTIONS[0]) => {
    setDestination(s.name)
    setName(name || `Trip to ${s.name}`)
  }

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })
      const data = await res.json()
      if (data.itinerary) {
        setAiResult(data.itinerary)
        setName(data.itinerary.trip_name || name)
        setBudget(String(data.itinerary.estimated_total_budget || budget))
        toast('✨ AI itinerary generated!', 'success')
      } else {
        toast(data.error || 'AI generation failed', 'error')
      }
    } catch {
      toast('Failed to connect to AI', 'error')
    } finally {
      setAiLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!name.trim()) { toast('Trip name is required', 'error'); return }

    // Quick auth check first before showing overlay
    const { data: { session: checkSession } } = await supabase.auth.getSession()
    if (!checkSession) {
      toast('You must be logged in to create a trip. Redirecting to login...', 'error')
      setTimeout(() => router.push('/login'), 2000)
      return
    }

    setLoading(true)
    setCreationStep(0) // Step 1: Saving trip details

    // Timeout safety — never hang forever
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out. Please try again.')), 15000)
    )

    try {
      const { data: trip, error } = await Promise.race([
        supabase
          .from('trips')
          .insert({
            name,
            description: description || destination,
            start_date: startDate || null,
            end_date: endDate || null,
            total_budget: parseFloat(budget) || 0,
            user_id: checkSession.user.id,
          })
          .select()
          .single(),
        timeout,
      ]) as any

      if (error) throw error

      setCreationStep(1) // Step 2: Building AI itinerary

      // Save AI stops if generated
      if (aiResult?.stops) {
        for (let i = 0; i < aiResult.stops.length; i++) {
          const s = aiResult.stops[i]
          const { data: stop } = await supabase
            .from('stops')
            .insert({ trip_id: trip.id, city: s.city, country: s.country, latitude: s.latitude, longitude: s.longitude, order_index: i })
            .select().single()
          if (stop && s.activities) {
            await supabase.from('activities').insert(
              s.activities.map((a: any) => ({ stop_id: stop.id, name: a.name, description: a.description, type: a.type, estimated_cost: a.estimated_cost || 0, duration_hours: a.duration_hours, time_of_day: a.time_of_day, day_number: a.day_number, is_ai_suggested: true }))
            )
          }
        }
      }

      setCreationStep(2) // Step 3: Finalizing
      await new Promise(r => setTimeout(r, 600)) // Brief UX pause

      setCreationStep(-1)
      setLoading(false)
      setSuccessData({ tripName: name, tripId: trip.id }) // Show success popup ✅

    } catch (err: any) {
      setCreationStep(-1)
      setLoading(false)
      toast(err.message || 'Failed to create trip. Please try again.', 'error')
    }
  }

  const inputClass = `w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-navy-900
    placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30
    focus:border-amber-500 transition-all`

  return (
    <div className="max-w-3xl mx-auto animate-in">
      {/* Creation Progress Overlay */}
      <AnimatePresence>
        {creationStep >= 0 && <CreatingOverlay step={creationStep} />}
      </AnimatePresence>

      {/* Success Popup */}
      <AnimatePresence>
        {successData && (
          <SuccessModal
            tripName={successData.tripName}
            tripId={successData.tripId}
            onClose={() => setSuccessData(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <Link href="/trips" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Trips
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Plane className="w-5 h-5 text-navy-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Plan a new trip</h1>
            <p className="text-sm text-gray-500">Fill in details or let AI build your itinerary</p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
        {/* AI Banner */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">AI Trip Generator</span>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. 5-day Goa trip with ₹20,000 budget, beaches & nightlife"
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAIGenerate()}
              className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white
                         placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
            />
            <button
              onClick={handleAIGenerate}
              disabled={aiLoading || !aiPrompt.trim()}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-sm rounded-xl
                         transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              {aiLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {/* AI Result Banner */}
        <AnimatePresence>
          {aiResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-50 border-b border-emerald-100 px-6 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-emerald-800 font-bold text-sm flex items-center gap-1.5">
                    <span>✨</span> AI Generated: {aiResult.trip_name}
                  </p>
                  <p className="text-emerald-700 text-xs mt-1">
                    {aiResult.duration_days} days · {aiResult.stops?.length} cities · ₹{aiResult.estimated_total_budget?.toLocaleString()} budget
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {aiResult.stops?.map((s: any, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-emerald-200 text-emerald-700 text-xs rounded-full">
                        📍 {s.city}
                      </span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setAiResult(null)} className="text-emerald-400 hover:text-emerald-600 text-xs">✕</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Trip Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Trip Name</label>
            <input type="text" placeholder="e.g. Goa Summer Escape" value={name} onChange={e => setName(e.target.value)} className={inputClass} />
          </div>

          {/* Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />Start Date
              </label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />End Date
              </label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Destination + Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                <MapPin className="w-3 h-3 inline mr-1" />Select a Place
              </label>
              <input type="text" placeholder="e.g. Goa, India" value={destination} onChange={e => setDestination(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Total Budget (₹)
              </label>
              <input type="number" placeholder="e.g. 25000" value={budget} onChange={e => setBudget(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              placeholder="Describe your trip vibe — adventure, relaxation, culture..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Suggestions */}
        <div className="px-6 pb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Suggestions for Places to Visit / Activities to Perform
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleSuggestionClick(s)}
                className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left
                  hover:scale-[1.02] hover:shadow-md ${s.color}
                  ${destination === s.name ? 'ring-2 ring-amber-500 ring-offset-1' : ''}`}
              >
                <s.icon className="w-5 h-5 mb-2" />
                <p className="font-semibold text-xs">{s.name}</p>
                <p className="text-[10px] opacity-60 mt-0.5">{s.tag}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 pb-6 pt-2 border-t border-gray-50">
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-sm rounded-xl
                       transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plane className="w-4 h-4" />
            Create Trip & Build Itinerary
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
