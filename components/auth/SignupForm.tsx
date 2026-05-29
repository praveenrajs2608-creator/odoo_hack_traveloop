'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUpWithEmail } from '@/lib/supabase/client'
import { GoogleOAuthButton } from './GoogleOAuthButton'
import { Camera, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function SignupForm() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const fullName = `${firstName} ${lastName}`.trim()
    const { data, error: authError } = await signUpWithEmail(email, password, fullName)
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else if (data?.user && !data.session) {
      // Email confirmation required
      setConfirmSent(true)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  // Shared input styles
  const inputClass = `w-full px-4 py-3 bg-navy-700/50 border border-white/10 rounded-xl text-white 
    placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-amber-500/40 
    focus:border-amber-500/50 transition-all text-sm`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-navy-800/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        {/* Avatar circle */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-navy-700 border-2 border-white/10 flex items-center justify-center overflow-hidden">
              <div className="text-4xl">👤</div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-2 border-navy-800 cursor-pointer hover:bg-amber-400 transition-colors">
              <Camera className="w-3.5 h-3.5 text-navy-900" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-display font-bold text-white">Registration</h1>
          <p className="text-sm text-white/40 mt-2">Create your Traveloop account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: First Name / Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                First Name
              </label>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 2: Email / Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 3: City / Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                City
              </label>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={e => setCity(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                Country
              </label>
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={e => setCountry(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Additional Information
            </label>
            <textarea
              placeholder="Tell us about your travel preferences, interests, or anything else..."
              value={additionalInfo}
              onChange={e => setAdditionalInfo(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
              {error}
            </div>
          )}

          {confirmSent && (
            <div className="text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-2.5">
              Check your email to confirm your account, then sign in.
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
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating account...' : 'Register User'}
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

        {/* Google */}
        <GoogleOAuthButton />

        {/* Footer */}
        <p className="text-center text-sm text-white/40 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
            Sign in
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
