'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { StopCard } from './StopCard'
import type { Stop } from '@/types/stop'

interface DraggableStopProps {
  stop: Stop
  index: number
  onAddActivity?: () => void
  onDeleteStop?: (id: string) => void
}

export function DraggableStop({ stop, index, onAddActivity, onDeleteStop }: DraggableStopProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto' as any,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 cursor-grab active:cursor-grabbing 
                   text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      <StopCard
        stop={stop}
        index={index}
        onAddActivity={onAddActivity}
        onDeleteStop={onDeleteStop}
      />
    </div>
  )
}
