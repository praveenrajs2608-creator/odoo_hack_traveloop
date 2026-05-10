'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmail } from '@/lib/supabase/client'
import { GoogleOAuthButton } from './GoogleOAuthButton'
import { Button } from '@/components/ui/button'
import { Camera, LogIn } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await signInWithEmail(email, password)
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-md mx-auto"
    >
      <div className="bg-navy-800/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        {/* Avatar circle */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-navy-700 border-2 border-white/10 flex items-center justify-center overflow-hidden">
              <div className="text-4xl">🧳</div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-2 border-navy-800">
              <Camera className="w-3.5 h-3.5 text-navy-900" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-display font-bold text-white">Welcome Back</h1>
          <p className="text-sm text-white/40 mt-2">Sign in to your Traveloop account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Username / Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-navy-700/50 border border-white/10 rounded-xl text-white 
                         placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-amber-500/40 
                         focus:border-amber-500/50 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-navy-700/50 border border-white/10 rounded-xl text-white 
                         placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-amber-500/40 
                         focus:border-amber-500/50 transition-all text-sm"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold rounded-xl 
                       transition-all text-sm flex items-center justify-center gap-2 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-navy-800/60 px-3 text-white/30 font-medium">or</span>
          </div>
        </div>

        {/* Google OAuth */}
        <GoogleOAuthButton />

        {/* Footer */}
        <p className="text-center text-sm text-white/40 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
            Register
          </Link>
        </p>
      </div>

      {/* Branding */}
      <p className="text-center text-xs text-white/20 mt-4">
        Traveloop v1.0 · AI-Powered Travel Planning
      </p>
    </motion.div>
  )
}
