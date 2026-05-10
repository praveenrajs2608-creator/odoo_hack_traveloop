'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useBudget } from '@/hooks/useBudget'
import { BudgetDonut } from '@/components/budget/BudgetDonut'
import { BudgetBar } from '@/components/budget/BudgetBar'
import { BudgetAlert } from '@/components/budget/BudgetAlert'
import { InvoiceView } from '@/components/budget/InvoiceView'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import { formatCurrency } from '@/lib/utils'
import { Plus, Trash2, ArrowLeft, FileText, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import type { BudgetCategory } from '@/types/budget'

const categories: { label: string; value: BudgetCategory }[] = [
  { label: '🚌 Transport', value: 'transport' },
  { label: '🏨 Accommodation', value: 'stay' },
  { label: '🎯 Activities', value: 'activities' },
  { label: '🍽️ Food', value: 'meals' },
  { label: '🛍️ Shopping', value: 'shopping' },
  { label: '📦 Misc', value: 'misc' },
]

type ViewMode = 'overview' | 'invoice'

export default function BudgetPage({ params }: { params: { tripId: string } }) {
  const { items, loading, totalSpent, addItem, deleteItem } = useBudget(params.tripId)
  const { toast } = useToast()
  const [totalBudget, setTotalBudget] = useState(0)
  const [tripName, setTripName] = useState('')
  const [tripDates, setTripDates] = useState<{ start: string; end: string } | undefined>()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [newCategory, setNewCategory] = useState<BudgetCategory>('activities')
  const [newDate, setNewDate] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('overview')

  useEffect(() => {
    const fetchTrip = async () => {
      const { data } = await supabase
        .from('trips')
        .select('total_budget, name, start_date, end_date')
        .eq('id', params.tripId)
        .single()
      setTotalBudget(data?.total_budget || 0)
      setTripName(data?.name || 'Trip')
      if (data?.start_date && data?.end_date) {
        setTripDates({ start: data.start_date, end: data.end_date })
      }
    }
    fetchTrip()
  }, [params.tripId])

  const handleAdd = async () => {
    if (!newLabel.trim() || !newAmount) return
    try {
      await addItem({
        category: newCategory,
        label: newLabel,
        amount: parseFloat(newAmount),
        date: newDate || undefined,
      })
      toast('Budget item added', 'success')
      setNewLabel('')
      setNewAmount('')
      setShowAddModal(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add item'
      toast(message, 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id)
      toast('Item removed', 'success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete'
      toast(message, 'error')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={`/trips/${params.tripId}`}
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-navy-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trip
          </Link>
          <h1 className="text-2xl font-bold text-navy-900">Budget & Costs</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('overview')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all
                ${viewMode === 'overview' ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-navy-900'}`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Overview
            </button>
            <button
              onClick={() => setViewMode('invoice')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all
                ${viewMode === 'invoice' ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-navy-900'}`}
            >
              <FileText className="w-3.5 h-3.5" /> Invoice
            </button>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {viewMode === 'invoice' ? (
        /* Invoice View */
        <InvoiceView
          items={items}
          tripName={tripName}
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          tripDates={tripDates}
        />
      ) : (
        /* Overview */
        <>
          {/* Alert */}
          <BudgetAlert totalBudget={totalBudget} totalSpent={totalSpent} />

          {/* Budget Progress */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Spent: <span className="font-mono font-bold text-amber-500">{formatCurrency(totalSpent)}</span>
              </span>
              <span className="text-sm text-gray-500">
                Budget: <span className="font-mono font-semibold">{formatCurrency(totalBudget)}</span>
              </span>
            </div>
            <Progress
              value={totalSpent}
              max={totalBudget || 1}
              showPercentage
              variant={totalSpent > totalBudget ? 'danger' : 'default'}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-card p-6">
              <h3 className="font-bold text-navy-900 mb-4">Category Breakdown</h3>
              <BudgetDonut items={items} />
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-card p-6">
              <h3 className="font-bold text-navy-900 mb-4">Daily Spending</h3>
              <BudgetBar items={items} totalBudget={totalBudget} />
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-card overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="font-bold text-navy-900">All Expenses</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-3">Item</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-sm font-medium text-gray-800">{item.label}</td>
                      <td className="px-6 py-3">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">{item.date || '—'}</td>
                      <td className="px-6 py-3 text-sm font-mono font-semibold text-amber-500 text-right">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-gray-400 hover:text-coral-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                        No expenses recorded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Expense" size="md">
        <div className="space-y-4">
          <Input
            id="label"
            label="Description"
            placeholder="e.g. Train ticket to Jaipur"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value as BudgetCategory)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            >
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <Input
            id="amount"
            label="Amount (₹)"
            type="number"
            placeholder="1500"
            value={newAmount}
            onChange={e => setNewAmount(e.target.value)}
          />
          <Input
            id="date"
            label="Date"
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
          />
          <Button className="w-full" onClick={handleAdd}>
            Add Expense
          </Button>
        </div>
      </Modal>
    </div>
  )
}
