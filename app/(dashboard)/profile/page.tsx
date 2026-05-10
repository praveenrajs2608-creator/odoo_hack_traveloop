'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTrips } from '@/hooks/useTrips'
import { supabase, signOut } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/toast'
import { getInitials, getTripStatus } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  Camera,
  Save,
  LogOut,
  Trash2,
  Mail,
  User,
  MapPin,
  Calendar,
  Edit3,
  Eye,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const { trips } = useTrips()
  const { toast } = useToast()

  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) setFullName(profile.full_name || '')
  }, [profile])

  const preplannedTrips = trips.filter(t => getTripStatus(t) === 'upcoming').slice(0, 3)
  const previousTrips = trips.filter(t => getTripStatus(t) === 'completed').slice(0, 3)
  const ongoingTrips = trips.filter(t => getTripStatus(t) === 'ongoing')

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id)
    if (error) {
      toast(error.message, 'error')
    } else {
      toast('Profile updated!', 'success')
      setEditing(false)
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  const inputClass = `w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm
    placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30
    focus:border-amber-500 transition-all text-navy-900`

  // Show skeleton only briefly during initial auth check
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in">
        <div className="h-40 bg-gray-100 rounded-3xl animate-pulse" />
        <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    )
  }

  const TripCardRow = ({ trips: rowTrips, emptyText }: { trips: any[]; emptyText: string }) => (
    rowTrips.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {rowTrips.map((trip, i) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={`/trips/${trip.id}`}>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all group">
                {/* Card image placeholder */}
                <div className="h-28 bg-gradient-to-br from-navy-800 to-navy-600 flex items-center justify-center relative">
                  <MapPin className="w-8 h-8 text-white/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <p className="text-white font-bold text-xs truncate">{trip.name}</p>
                    {trip.start_date && (
                      <p className="text-white/50 text-[10px]">
                        {new Date(trip.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <button className="w-full py-2 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 rounded-xl text-xs font-semibold text-gray-600 hover:text-amber-600 transition-all flex items-center justify-center gap-1.5 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-200">
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-400">{emptyText}</p>
      </div>
    )
  )

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="relative">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={fullName}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center ring-4 ring-white shadow-lg">
                  <span className="text-2xl font-bold text-navy-900">
                    {getInitials(fullName || 'U')}
                  </span>
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-navy-900 text-white flex items-center justify-center shadow-md hover:bg-navy-700 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="pt-14 px-6 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className={inputClass}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className={`${inputClass} opacity-60 cursor-not-allowed`}
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-xs rounded-xl transition-all disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => { setEditing(false); setFullName(profile?.full_name || '') }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-xs rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-navy-900">{fullName || 'User'}</h2>
                  <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {trips.length} trips
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recently'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium rounded-xl transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preplanned (Upcoming) Trips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-navy-900">Preplanned Trips</h2>
          <Link href="/trips" className="text-xs text-amber-500 hover:text-amber-600 font-medium flex items-center gap-0.5">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <TripCardRow trips={preplannedTrips} emptyText="No preplanned trips yet" />
      </div>

      {/* Previous (Completed) Trips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-navy-900">Previous Trips</h2>
          <Link href="/trips" className="text-xs text-amber-500 hover:text-amber-600 font-medium flex items-center gap-0.5">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <TripCardRow trips={previousTrips} emptyText="No completed trips yet" />
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-navy-900 mb-3">Account</h3>
        <div className="flex gap-3">
          <button
            onClick={handleSignOut}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl text-sm font-medium text-red-500 transition-all">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
