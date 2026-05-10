'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { BudgetItem, CreateBudgetItemInput, BudgetCategory } from '@/types/budget'

export function useBudget(tripId: string) {
  const [items, setItems] = useState<BudgetItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBudget = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('budget_items')
      .select('*')
      .eq('trip_id', tripId)
      .order('date', { ascending: true })

    setItems(data || [])
    setLoading(false)
  }, [tripId])

  useEffect(() => {
    fetchBudget()
  }, [fetchBudget])

  const addItem = async (input: Omit<CreateBudgetItemInput, 'trip_id'>) => {
    const { data, error } = await supabase
      .from('budget_items')
      .insert({ ...input, trip_id: tripId })
      .select()
      .single()

    if (error) throw error
    setItems(prev => [...prev, data as BudgetItem])
    return data as BudgetItem
  }

  const updateItem = async (id: string, updates: Partial<CreateBudgetItemInput>) => {
    const { data, error } = await supabase
      .from('budget_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...data } : i)))
  }

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('budget_items').delete().eq('id', id)
    if (error) throw error
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const totalSpent = useMemo(
    () => items.reduce((sum, i) => sum + i.amount, 0),
    [items]
  )

  const byCategory = useMemo(() => {
    const cats: Record<BudgetCategory, number> = {
      transport: 0,
      stay: 0,
      activities: 0,
      meals: 0,
      shopping: 0,
      misc: 0,
    }
    items.forEach(i => {
      cats[i.category] += i.amount
    })
    return cats
  }, [items])

  return { items, loading, fetchBudget, addItem, updateItem, deleteItem, totalSpent, byCategory }
}
