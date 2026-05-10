import { AlertTriangle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface BudgetAlertProps {
  totalBudget: number
  totalSpent: number
}

export function BudgetAlert({ totalBudget, totalSpent }: BudgetAlertProps) {
  if (totalSpent <= totalBudget || totalBudget === 0) return null

  const overage = totalSpent - totalBudget

  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-coral-400/5 border border-coral-400/20">
      <div className="w-10 h-10 rounded-xl bg-coral-400/10 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-5 h-5 text-coral-400" />
      </div>
      <div>
        <p className="font-semibold text-coral-500 text-sm">Over Budget!</p>
        <p className="text-xs text-gray-500 mt-0.5">
          You&apos;ve exceeded your budget by{' '}
          <span className="font-mono font-semibold text-coral-400">
            {formatCurrency(overage)}
          </span>
        </p>
      </div>
    </div>
  )
}
