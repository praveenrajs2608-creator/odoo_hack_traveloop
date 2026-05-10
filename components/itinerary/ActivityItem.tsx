import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Camera,
  Utensils,
  Mountain,
  ShoppingBag,
  Landmark,
  Moon,
  Bus,
  Hotel,
  Clock,
  Sparkles,
} from 'lucide-react'
import type { Activity, ActivityType } from '@/types/activity'

const typeIcons: Record<ActivityType, React.ElementType> = {
  sightseeing: Camera,
  food: Utensils,
  adventure: Mountain,
  shopping: ShoppingBag,
  culture: Landmark,
  nightlife: Moon,
  transport: Bus,
  stay: Hotel,
}

const typeColors: Record<ActivityType, string> = {
  sightseeing: 'bg-blue-100 text-blue-600',
  food: 'bg-orange-100 text-orange-600',
  adventure: 'bg-emerald-100 text-emerald-600',
  shopping: 'bg-pink-100 text-pink-600',
  culture: 'bg-purple-100 text-purple-600',
  nightlife: 'bg-indigo-100 text-indigo-600',
  transport: 'bg-gray-100 text-gray-600',
  stay: 'bg-teal-100 text-teal-600',
}

interface ActivityItemProps {
  activity: Activity
  compact?: boolean
}

export function ActivityItem({ activity, compact }: ActivityItemProps) {
  const Icon = typeIcons[activity.type] || Camera

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group',
      compact && 'p-2'
    )}>
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', typeColors[activity.type])}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h5 className="text-sm font-medium text-gray-800 truncate">{activity.name}</h5>
          {activity.is_ai_suggested && (
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          )}
        </div>
        {!compact && activity.description && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{activity.description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {activity.duration_hours && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {activity.duration_hours}h
          </span>
        )}
        <span className="font-mono text-xs font-semibold text-amber-500">
          {formatCurrency(activity.estimated_cost)}
        </span>
      </div>
    </div>
  )
}
