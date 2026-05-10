'use client'

import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'
import { Clock, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Activity, ActivityType } from '@/types/activity'

const typeEmoji: Record<ActivityType, string> = {
  sightseeing: '📸',
  food: '🍽️',
  adventure: '🏔️',
  shopping: '🛍️',
  culture: '🏛️',
  nightlife: '🌙',
  transport: '🚌',
  stay: '🏨',
}

interface ActivityCardProps {
  activity: Activity
  onAdd?: (activity: Activity) => void
}

export function ActivityCard({ activity, onAdd }: ActivityCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl bg-white border border-gray-100 shadow-card overflow-hidden"
    >
      {activity.image_url && (
        <div className="h-32 overflow-hidden">
          <img
            src={activity.image_url}
            alt={activity.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{typeEmoji[activity.type]}</span>
            <div>
              <h4 className="font-semibold text-sm text-navy-900">{activity.name}</h4>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                {activity.type}
              </span>
            </div>
          </div>
          {activity.is_ai_suggested && (
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
        </div>

        {activity.description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{activity.description}</p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-amber-500">
              {formatCurrency(activity.estimated_cost)}
            </span>
            {activity.duration_hours && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {activity.duration_hours}h
              </span>
            )}
          </div>
          {onAdd && (
            <Button size="sm" variant="ghost" onClick={() => onAdd(activity)}>
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
