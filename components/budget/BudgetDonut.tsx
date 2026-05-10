'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { BudgetItem } from '@/types/budget'

const COLORS: Record<string, string> = {
  transport: '#F5A623',
  stay: '#0F1B2D',
  activities: '#4ECDC4',
  meals: '#FF6B6B',
  shopping: '#95E1D3',
  misc: '#F38181',
}

const LABELS: Record<string, string> = {
  transport: 'Transport',
  stay: 'Accommodation',
  activities: 'Activities',
  meals: 'Food & Dining',
  shopping: 'Shopping',
  misc: 'Miscellaneous',
}

interface BudgetDonutProps {
  items: BudgetItem[]
}

export function BudgetDonut({ items }: BudgetDonutProps) {
  const data = Object.keys(COLORS)
    .map(cat => ({
      name: LABELS[cat],
      value: items
        .filter(i => i.category === cat)
        .reduce((sum, i) => sum + i.amount, 0),
      color: COLORS[cat],
    }))
    .filter(d => d.value > 0)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
        No budget data yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          dataKey="value"
          paddingAngle={3}
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`}
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            fontSize: '13px',
          }}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span className="text-xs text-gray-600">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
