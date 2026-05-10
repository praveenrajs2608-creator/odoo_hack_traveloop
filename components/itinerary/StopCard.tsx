'use client'

import { formatCurrency } from '@/lib/utils'
import { MapPin, Calendar, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Stop } from '@/types/stop'
import type { Activity } from '@/types/activity'
import { ActivityItem } from './ActivityItem'
import { useState } from 'react'

interface StopCardProps {
  stop: Stop
  index: number
  onAddActivity?: () => void
  onDeleteStop?: (id: string) => void
}

export function StopCard({ stop, index, onAddActivity, onDeleteStop }: StopCardProps) {
  const [expanded, setExpanded] = useState(true)
  const totalCost = stop.activities?.reduce((sum, a) => sum + a.estimated_cost, 0) || 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
            <span className="text-xs font-bold text-navy-900">{index + 1}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <h4 className="font-bold text-navy-900">
                {stop.city}, {stop.country}
              </h4>
            </div>
            {stop.start_date && stop.end_date && (
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <Calendar className="w-3 h-3" />
                {stop.start_date} → {stop.end_date}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-amber-500 font-semibold">
            {formatCurrency(totalCost)}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {onDeleteStop && (
            <button
              onClick={() => onDeleteStop(stop.id)}
              className="p-1 rounded-lg text-gray-400 hover:text-coral-400 hover:bg-coral-400/10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Activities */}
      {expanded && (
        <div className="p-4 space-y-2">
          {stop.activities && stop.activities.length > 0 ? (
            stop.activities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No activities yet</p>
          )}
          {onAddActivity && (
            <Button variant="ghost" size="sm" onClick={onAddActivity} className="w-full mt-2">
              <Plus className="w-4 h-4" />
              Add Activity
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
