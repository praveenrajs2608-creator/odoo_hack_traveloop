'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Stop } from '@/types/stop'
import type { Activity } from '@/types/activity'

export function useRealtimeTrip(tripId: string) {
  const [stops, setStops] = useState<Stop[]>([])

  useEffect(() => {
    // Initial fetch
    const fetchStops = async () => {
      const { data } = await supabase
        .from('stops')
        .select('*, activities(*)')
        .eq('trip_id', tripId)
        .order('order_index', { ascending: true })
      setStops(data || [])
    }
    fetchStops()

    // Subscribe to realtime changes on stops
    const channel = supabase
      .channel(`trip-${tripId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stops',
          filter: `trip_id=eq.${tripId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setStops(prev => [...prev, payload.new as Stop])
          }
          if (payload.eventType === 'UPDATE') {
            setStops(prev =>
              prev.map(s => (s.id === payload.new.id ? (payload.new as Stop) : s))
            )
          }
          if (payload.eventType === 'DELETE') {
            setStops(prev => prev.filter(s => s.id !== payload.old.id))
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities',
        },
        () => {
          // Refetch stops with activities on any activity change
          fetchStops()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [tripId])

  return { stops }
}
