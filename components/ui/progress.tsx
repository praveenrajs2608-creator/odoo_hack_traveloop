import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  variant?: 'default' | 'danger' | 'success'
  className?: string
}

export function Progress({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)
  const isOver = value > max

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span
              className={cn('text-sm font-mono font-semibold', {
                'text-gray-600': !isOver && variant === 'default',
                'text-coral-400': isOver || variant === 'danger',
                'text-emerald-600': variant === 'success',
              })}
            >
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', {
            'bg-amber-500': !isOver && variant === 'default',
            'bg-coral-400': isOver || variant === 'danger',
            'bg-emerald-500': variant === 'success',
          })}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}
