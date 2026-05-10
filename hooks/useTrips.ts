'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Trip, CreateTripInput } from '@/types/trip'

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrips = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*, stops(id, city, country)')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        setTrips([])
      } else {
        setTrips(data || [])
      }
    } catch (e: any) {
      setError(e.message)
      setTrips([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Safety timeout — never stay in loading > 8s
    const timeout = setTimeout(() => setLoading(false), 8000)
    fetchTrips().finally(() => clearTimeout(timeout))
    return () => clearTimeout(timeout)
  }, [fetchTrips])

  const createTrip = async (input: CreateTripInput) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('trips')
      .insert({ ...input, user_id: session.user.id })
      .select()
      .single()

    if (error) throw error
    setTrips(prev => [data, ...prev])
    return data as Trip
  }

  const updateTrip = async (id: string, updates: Partial<CreateTripInput>) => {
    const { data, error } = await supabase
      .from('trips')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setTrips(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)))
    return data as Trip
  }

  const deleteTrip = async (id: string) => {
    const { error } = await supabase.from('trips').delete().eq('id', id)
    if (error) throw error
    setTrips(prev => prev.filter(t => t.id !== id))
  }

  return { trips, loading, error, fetchTrips, createTrip, updateTrip, deleteTrip }
}
