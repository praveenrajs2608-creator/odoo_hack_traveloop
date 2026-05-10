'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Stop, CreateStopInput } from '@/types/stop'

export function useStops(tripId: string) {
  const [stops, setStops] = useState<Stop[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStops = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('stops')
      .select('*, activities(*)')
      .eq('trip_id', tripId)
      .order('order_index', { ascending: true })

    setStops(data || [])
    setLoading(false)
  }, [tripId])

  useEffect(() => {
    fetchStops()
  }, [fetchStops])

  const addStop = async (input: Omit<CreateStopInput, 'trip_id'>) => {
    const { data, error } = await supabase
      .from('stops')
      .insert({ ...input, trip_id: tripId })
      .select('*, activities(*)')
      .single()

    if (error) throw error
    setStops(prev => [...prev, data as Stop])
    return data as Stop
  }

  const updateStop = async (id: string, updates: Partial<CreateStopInput>) => {
    const { data, error } = await supabase
      .from('stops')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setStops(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)))
    return data as Stop
  }

  const deleteStop = async (id: string) => {
    const { error } = await supabase.from('stops').delete().eq('id', id)
    if (error) throw error
    setStops(prev => prev.filter(s => s.id !== id))
  }

  const reorderStops = async (newOrder: Stop[]) => {
    setStops(newOrder)
    const updates = newOrder.map((stop, i) => ({
      id: stop.id,
      order_index: i,
    }))
    for (const u of updates) {
      await supabase.from('stops').update({ order_index: u.order_index }).eq('id', u.id)
    }
  }

  return { stops, loading, fetchStops, addStop, updateStop, deleteStop, reorderStops }
}
