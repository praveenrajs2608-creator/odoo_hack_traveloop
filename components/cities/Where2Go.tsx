'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Waves, Mountain, Building2, Compass, Landmark, TreePine,
  User, Heart, Users, Baby,
  Wallet, Banknote, CreditCard, Gem,
  Calendar, CalendarDays, CalendarRange, CalendarClock,
  Sun, CloudRain, Snowflake, Flower2,
  ArrowLeft, ArrowRight, Sparkles, MapPin, Plus, RotateCcw,
} from 'lucide-react'
import type { City } from '@/types/activity'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Answers = {
  vibe: string
  group: string
  budget: string
  duration: string
  season: string
}

type StepKey = keyof Answers

interface Option {
  value: string
  label: string
  subtitle: string
  icon: React.ElementType
}

interface Step {
  key: StepKey
  title: string
  description: string
  options: Option[]
}

interface Where2GoProps {
  onAddCity: (city: City) => void
}

/* ------------------------------------------------------------------ */
/*  Steps data                                                         */
/* ------------------------------------------------------------------ */

const STEPS: Step[] = [
  {
    key: 'vibe',
    title: 'What\u2019s your vibe?',
    description: 'Pick the mood for your trip',
    options: [
      { value: 'beach', label: 'Beach & Chill', subtitle: 'Sun, sand & sea', icon: Waves },
      { value: 'mountains', label: 'Mountains', subtitle: 'Peaks & valleys', icon: Mountain },
      { value: 'city', label: 'City Escape', subtitle: 'Urban exploration', icon: Building2 },
      { value: 'adventure', label: 'Adventure', subtitle: 'Thrills & adrenaline', icon: Compass },
      { value: 'heritage', label: 'Heritage', subtitle: 'History & culture', icon: Landmark },
      { value: 'nature', label: 'Nature', subtitle: 'Forests & wildlife', icon: TreePine },
    ],
  },
  {
    key: 'group',
    title: 'Who\u2019s coming?',
    description: 'Tell us about your travel group',
    options: [
      { value: 'solo', label: 'Solo', subtitle: 'Just me', icon: User },
      { value: 'couple', label: 'Couple', subtitle: 'Romantic getaway', icon: Heart },
      { value: 'friends', label: 'Friends', subtitle: 'Squad trip', icon: Users },
      { value: 'family', label: 'Family', subtitle: 'All ages welcome', icon: Baby },
    ],
  },
  {
    key: 'budget',
    title: 'What\u2019s your budget?',
    description: 'Per person, total trip cost',
    options: [
      { value: 'budget', label: 'Budget', subtitle: 'Under \u20b920k', icon: Wallet },
      { value: 'moderate', label: 'Moderate', subtitle: '\u20b920k\u2013\u20b960k', icon: Banknote },
      { value: 'premium', label: 'Premium', subtitle: '\u20b960k\u2013\u20b91.5L', icon: CreditCard },
      { value: 'luxury', label: 'Luxury', subtitle: '\u20b91.5L+', icon: Gem },
    ],
  },
  {
    key: 'duration',
    title: 'How long?',
    description: 'Choose your trip duration',
    options: [
      { value: 'weekend', label: 'Weekend', subtitle: '2\u20133 days', icon: Calendar },
      { value: 'short', label: 'Short Trip', subtitle: '4\u20137 days', icon: CalendarDays },
      { value: 'long', label: 'Long Trip', subtitle: '8\u201314 days', icon: CalendarRange },
      { value: 'extended', label: 'Extended', subtitle: '15+ days', icon: CalendarClock },
    ],
  },
  {
    key: 'season',
    title: 'When are you going?',
    description: 'Best season for your trip',
    options: [
      { value: 'summer', label: 'Summer', subtitle: 'Apr\u2013Jun', icon: Sun },
      { value: 'monsoon', label: 'Monsoon', subtitle: 'Jul\u2013Sep', icon: CloudRain },
      { value: 'winter', label: 'Winter', subtitle: 'Oct\u2013Jan', icon: Snowflake },
      { value: 'spring', label: 'Spring', subtitle: 'Feb\u2013Mar', icon: Flower2 },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Where2Go({ onAddCity }: Where2GoProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({
    vibe: '', group: '', budget: '', duration: '', season: '',
  })
  const [results, setResults] = useState<City[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [showQuiz, setShowQuiz] = useState(true)

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const selected = current ? answers[current.key] : ''

  const handleSelect = (value: string) => {
    if (!current) return
    setAnswers(prev => ({ ...prev, [current.key]: value }))
  }

  const handleNext = useCallback(async () => {
    if (isLast) {
      setLoading(true)
      setShowQuiz(false)
      try {
        const res = await fetch('/api/cities/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        })
        const data = await res.json()
        setResults(data.destinations || [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    } else {
      setStep(s => s + 1)
    }
  }, [isLast, answers, step])

  const handleBack = () => setStep(s => Math.max(0, s - 1))

  const handleRetake = () => {
    setStep(0)
    setAnswers({ vibe: '', group: '', budget: '', duration: '', season: '' })
    setResults(null)
    setShowQuiz(true)
  }

  const progressPct = showQuiz ? ((step + (selected ? 1 : 0)) / STEPS.length) * 100 : 100

  /* ---- Results view ---- */
  if (!showQuiz) {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        {/* results header */}
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Your Recommendations
          </h2>
          <p className="text-white/50 text-sm mt-1">
            Based on your preferences — {answers.vibe}, {answers.budget}, {answers.season}
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
                  <div className="h-32 bg-gray-100 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                    <div className="h-8 bg-gray-100 rounded-xl animate-pulse mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {results.map(city => {
                const score = city.match_score ?? 0
                let badgeLabel = 'Good pick'
                let badgeBg = 'bg-gray-500/80'
                if (score >= 9) { badgeLabel = '\uD83D\uDD25 Best match'; badgeBg = 'bg-amber-500' }
                else if (score >= 7) { badgeLabel = 'Great match'; badgeBg = 'bg-teal-400' }

                return (
                  <motion.div
                    key={city.id}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -4 }}
                    className="group rounded-2xl border border-gray-100 overflow-hidden bg-white hover:border-amber-400 hover:shadow-float transition-all duration-200"
                  >
                    {/* image */}
                    <div className="relative h-32 bg-gradient-to-br from-amber-100 to-orange-200 overflow-hidden">
                      {city.image_url && (
                        <img
                          src={city.image_url}
                          alt={city.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${badgeBg} backdrop-blur-sm`}>
                        {badgeLabel}
                      </span>
                    </div>

                    {/* body */}
                    <div className="p-4">
                      <h3 className="font-bold text-navy-900 text-sm">{city.name}</h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />{city.country}
                      </p>

                      {city.tags && city.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {city.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {city.estimated_cost_inr && (
                        <p className="text-xs text-gray-500 mt-2">
                          Est. <span className="font-semibold text-navy-900">₹{city.estimated_cost_inr}</span> per person
                        </p>
                      )}

                      <button
                        onClick={() => onAddCity(city)}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-navy-900 bg-amber-500 hover:bg-amber-400 rounded-xl transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add to Trip
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No destinations found. Try different preferences!</p>
            </div>
          )}

          {/* retake */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-navy-900 rounded-xl text-sm font-semibold text-navy-900 hover:bg-navy-900 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Retake Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ---- Quiz view ---- */
  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      {/* progress bar */}
      <div className="h-1.5 bg-gray-100">
        <motion.div
          className="h-full bg-amber-500 rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <div className="p-6">
        {/* step counter */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Step {step + 1} of {STEPS.length}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-bold text-navy-900">{current.title}</h2>
            <p className="text-sm text-gray-400 mt-0.5 mb-5">{current.description}</p>

            {/* option cards */}
            <div className={`grid gap-3 ${current.options.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
              {current.options.map(opt => {
                const Icon = opt.icon
                const isSelected = selected === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-center
                      ${isSelected
                        ? 'border-amber-500 bg-[#fdf6e8] shadow-glow'
                        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-amber-500 text-white' : 'bg-gray-50 text-gray-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-semibold ${isSelected ? 'text-navy-900' : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-gray-400 leading-tight">{opt.subtitle}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            disabled={!selected}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-navy-900 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20"
          >
            {isLast ? (
              <>Find my destinations <Sparkles className="w-4 h-4" /></>
            ) : (
              <>Next <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
