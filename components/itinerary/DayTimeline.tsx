'use client'

import type { Stop } from '@/types/stop'
import { ActivityItem } from './ActivityItem'

interface DayTimelineProps {
  stops: Stop[]
}

export function DayTimeline({ stops }: DayTimelineProps) {
  // Group activities by day across all stops
  const days: Record<number, { stop: Stop; activities: Stop['activities'] }[]> = {}

  stops.forEach(stop => {
    stop.activities?.forEach(act => {
      const day = act.day_number || 1
      if (!days[day]) days[day] = []
      const existing = days[day].find(d => d.stop.id === stop.id)
      if (existing) {
        existing.activities = [...(existing.activities || []), act]
      } else {
        days[day].push({ stop, activities: [act] })
      }
    })
  })

  const dayNumbers = Object.keys(days)
    .map(Number)
    .sort((a, b) => a - b)

  if (dayNumbers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">No activities planned yet</p>
        <p className="text-sm mt-1">Start adding stops and activities to build your itinerary</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {dayNumbers.map(dayNum => (
        <div key={dayNum}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center">
              <span className="text-sm font-bold text-white">D{dayNum}</span>
            </div>
            <h3 className="font-bold text-navy-900">Day {dayNum}</h3>
          </div>

          <div className="ml-5 border-l-2 border-gray-100 pl-6 space-y-4">
            {days[dayNum].map(({ stop, activities }) => (
              <div key={stop.id}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  📍 {stop.city}, {stop.country}
                </p>
                <div className="space-y-1">
                  {activities?.map(activity => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
