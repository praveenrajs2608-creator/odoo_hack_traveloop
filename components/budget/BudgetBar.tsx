'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { BudgetItem } from '@/types/budget'

interface BudgetBarProps {
  items: BudgetItem[]
  totalBudget: number
}

export function BudgetBar({ items, totalBudget }: BudgetBarProps) {
  // Group by date
  const byDate: Record<string, number> = {}
  items.forEach(item => {
    const date = item.date || 'Unassigned'
    byDate[date] = (byDate[date] || 0) + item.amount
  })

  const data = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({
      date: date === 'Unassigned' ? 'N/A' : new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      amount,
    }))

  const avgPerDay = data.length > 0 ? totalBudget / data.length : 0

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
        No daily spending data yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`}
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            fontSize: '13px',
          }}
        />
        <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={40}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.amount > avgPerDay ? '#FF6B6B' : '#F5A623'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
