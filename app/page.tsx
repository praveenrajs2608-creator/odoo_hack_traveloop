'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Map, Calendar, Plane, Globe, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-900 overflow-hidden font-body selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Deep mesh gradient base */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-navy-800 via-navy-900 to-[#050a14]" />
        
        {/* Animated glowing orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/10 blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-teal-500/10 blur-[150px] mix-blend-screen" style={{ animation: 'pulse 5s infinite alternate' }} />
        
        {/* Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-glow">
            <span className="text-xl">🧳</span>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">Traveloop</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium backdrop-blur-md transition-all flex items-center gap-2 group"
          >
            Get Started
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 text-center max-w-5xl mx-auto pt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-200">Traveloop v1.0 is now live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 tracking-tight leading-[1.1] mb-8"
        >
          Travel Planning, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">Reimagined by AI.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mb-12 font-light leading-relaxed"
        >
          Stop wrestling with spreadsheets. Generate personalized itineraries, track budgets, and explore destinations with an intelligent travel companion.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link 
            href="/signup"
            className="group relative px-8 py-4 bg-amber-500 text-navy-900 font-bold rounded-full overflow-hidden shadow-[0_0_40px_rgba(245,166,35,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(245,166,35,0.4)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative flex items-center gap-2 text-base">
              Start Planning for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          
          <Link 
            href="/login"
            className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium backdrop-blur-md hover:bg-white/10 transition-all"
          >
            View Live Demo
          </Link>
        </motion.div>

        {/* Floating UI Elements (Hero Visual) */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 w-full relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent z-20 h-full w-full pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 max-w-6xl mx-auto px-4">
            {/* Feature Card 1 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-left transform md:translate-y-12 hover:-translate-y-2 transition-transform duration-500 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Smart Itineraries</h3>
              <p className="text-white/50 text-sm leading-relaxed">Tell the AI your vibe, budget, and dates. Get a complete day-by-day plan in seconds.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 text-left transform hover:-translate-y-2 transition-transform duration-500 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 blur-[50px] rounded-full" />
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center mb-6 relative z-10">
                <Map className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2 relative z-10">Interactive Maps</h3>
              <p className="text-white/50 text-sm leading-relaxed relative z-10">Visualize your journey with integrated routing and location discovery.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-left transform md:translate-y-12 hover:-translate-y-2 transition-transform duration-500 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-coral-500/20 flex items-center justify-center mb-6">
                <Plane className="w-6 h-6 text-coral-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Budget Tracking</h3>
              <p className="text-white/50 text-sm leading-relaxed">Stay on top of expenses with real-time budget progress and elegant invoice exports.</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Social Proof Marquee */}
      <div className="relative z-20 py-20 border-t border-white/5 bg-navy-900/50 backdrop-blur-lg mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-white/40 uppercase tracking-widest mb-8">Destinations Covered Worldwide</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2"><Globe className="w-6 h-6" /><span className="text-xl font-display font-bold">Paris</span></div>
            <div className="flex items-center gap-2"><Globe className="w-6 h-6" /><span className="text-xl font-display font-bold">Tokyo</span></div>
            <div className="flex items-center gap-2"><Globe className="w-6 h-6" /><span className="text-xl font-display font-bold">New York</span></div>
            <div className="flex items-center gap-2"><Globe className="w-6 h-6" /><span className="text-xl font-display font-bold">Bali</span></div>
            <div className="flex items-center gap-2"><Globe className="w-6 h-6" /><span className="text-xl font-display font-bold">Rome</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
