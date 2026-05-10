'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Activity, CreateActivityInput } from '@/types/activity'

export function useActivities(stopId: string) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const fetchActivities = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('activities')
      .select('*')
      .eq('stop_id', stopId)
      .order('day_number', { ascending: true })
      .order('time_of_day', { ascending: true })

    setActivities(data || [])
    setLoading(false)
  }, [stopId])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const addActivity = async (input: Omit<CreateActivityInput, 'stop_id'>) => {
    const { data, error } = await supabase
      .from('activities')
      .insert({ ...input, stop_id: stopId })
      .select()
      .single()

    if (error) throw error
    setActivities(prev => [...prev, data as Activity])
    return data as Activity
  }

  const updateActivity = async (id: string, updates: Partial<CreateActivityInput>) => {
    const { data, error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setActivities(prev => prev.map(a => (a.id === id ? { ...a, ...data } : a)))
  }

  const deleteActivity = async (id: string) => {
    const { error } = await supabase.from('activities').delete().eq('id', id)
    if (error) throw error
    setActivities(prev => prev.filter(a => a.id !== id))
  }

  return { activities, loading, fetchActivities, addActivity, updateActivity, deleteActivity }
}
