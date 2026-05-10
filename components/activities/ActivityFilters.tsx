'use client'

import { cn } from '@/lib/utils'
import type { ActivityType } from '@/types/activity'

const types: { label: string; value: ActivityType }[] = [
  { label: 'All', value: '' as any },
  { label: '📸 Sightseeing', value: 'sightseeing' },
  { label: '🍽️ Food', value: 'food' },
  { label: '🏔️ Adventure', value: 'adventure' },
  { label: '🛍️ Shopping', value: 'shopping' },
  { label: '🏛️ Culture', value: 'culture' },
  { label: '🌙 Nightlife', value: 'nightlife' },
]

interface ActivityFiltersProps {
  activeType: string
  onTypeChange: (type: string) => void
}

export function ActivityFilters({ activeType, onTypeChange }: ActivityFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {types.map(type => (
        <button
          key={type.value || 'all'}
          onClick={() => onTypeChange(type.value)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
            activeType === type.value
              ? 'bg-amber-500 text-navy-900 shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {type.label}
        </button>
      ))}
    </div>
  )
}
