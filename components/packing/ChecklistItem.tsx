'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChecklistItemProps {
  id: string
  name: string
  isPacked: boolean
  onToggle: (id: string, isPacked: boolean) => void
  onDelete?: (id: string) => void
}

export function ChecklistItem({ id, name, isPacked, onToggle, onDelete }: ChecklistItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gray-50 group transition-colors"
    >
      <button
        onClick={() => onToggle(id, !isPacked)}
        className={cn(
          'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200',
          isPacked
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-gray-300 hover:border-amber-500'
        )}
      >
        {isPacked && <Check className="w-3 h-3 text-white" />}
      </button>
      <span
        className={cn(
          'text-sm flex-1 transition-all duration-200',
          isPacked ? 'text-gray-400 line-through' : 'text-gray-700'
        )}
      >
        {name}
      </span>
      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="text-gray-300 hover:text-coral-400 opacity-0 group-hover:opacity-100 transition-all text-xs"
        >
          ✕
        </button>
      )}
    </motion.div>
  )
}
