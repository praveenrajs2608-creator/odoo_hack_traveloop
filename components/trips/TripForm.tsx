'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { Calendar, FileText, DollarSign, Upload } from 'lucide-react'

interface TripFormProps {
  onSubmit: (data: {
    name: string
    description: string
    start_date: string
    end_date: string
    total_budget: number
  }) => Promise<void>
  initialData?: {
    name?: string
    description?: string
    start_date?: string
    end_date?: string
    total_budget?: number
  }
  loading?: boolean
}

export function TripForm({ onSubmit, initialData, loading }: TripFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [startDate, setStartDate] = useState(initialData?.start_date || '')
  const [endDate, setEndDate] = useState(initialData?.end_date || '')
  const [budget, setBudget] = useState(initialData?.total_budget?.toString() || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      total_budget: parseFloat(budget) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        id="trip-name"
        label="Trip Name"
        placeholder="e.g. Rajasthan Road Trip 2026"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea
          placeholder="Brief description of your trip..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 
                     placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 
                     focus:border-amber-500 transition-all duration-200 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="start-date"
          label="Start Date"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
        />
        <Input
          id="end-date"
          label="End Date"
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          required
        />
      </div>

      <Input
        id="budget"
        label="Total Budget (₹)"
        type="number"
        placeholder="50000"
        value={budget}
        onChange={e => setBudget(e.target.value)}
      />

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Saving...' : initialData ? 'Update Trip' : 'Create Trip'}
      </Button>
    </form>
  )
}
