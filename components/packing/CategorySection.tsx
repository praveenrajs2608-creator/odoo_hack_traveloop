'use client'

import { ChecklistItem } from './ChecklistItem'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { PackingItem, PackingCategory } from '@/types/budget'

const categoryEmoji: Record<PackingCategory, string> = {
  clothing: '👕',
  documents: '📄',
  electronics: '📱',
  toiletries: '🧴',
  medicine: '💊',
  misc: '📦',
}

const categoryLabels: Record<PackingCategory, string> = {
  clothing: 'Clothing',
  documents: 'Documents',
  electronics: 'Electronics',
  toiletries: 'Toiletries',
  medicine: 'Medicine',
  misc: 'Miscellaneous',
}

interface CategorySectionProps {
  category: PackingCategory
  items: PackingItem[]
  onToggle: (id: string, isPacked: boolean) => void
  onDelete?: (id: string) => void
}

export function CategorySection({ category, items, onToggle, onDelete }: CategorySectionProps) {
  const [expanded, setExpanded] = useState(true)
  const packedCount = items.filter(i => i.is_packed).length

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{categoryEmoji[category]}</span>
          <h4 className="font-semibold text-sm text-navy-900">{categoryLabels[category]}</h4>
          <span className="text-xs text-gray-400 font-mono">
            {packedCount}/{items.length}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-0.5">
          {items.map(item => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              name={item.name}
              isPacked={item.is_packed}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
          {items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-3">No items in this category</p>
          )}
        </div>
      )}
    </div>
  )
}
