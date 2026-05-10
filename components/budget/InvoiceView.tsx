'use client'

import { useMemo } from 'react'
import { formatCurrency } from '@/lib/utils'
import { FileText, Download, Printer } from 'lucide-react'
import type { BudgetItem } from '@/types/budget'

interface InvoiceViewProps {
  items: BudgetItem[]
  tripName: string
  totalBudget: number
  totalSpent: number
  tripDates?: { start: string; end: string }
}

const CATEGORY_LABELS: Record<string, string> = {
  transport: '🚌 Transport',
  stay: '🏨 Accommodation',
  activities: '🎯 Activities',
  meals: '🍽️ Food & Dining',
  shopping: '🛍️ Shopping',
  misc: '📦 Miscellaneous',
}

export function InvoiceView({ items, tripName, totalBudget, totalSpent, tripDates }: InvoiceViewProps) {
  const grouped = useMemo(() => {
    const groups: Record<string, { items: BudgetItem[]; total: number }> = {}
    items.forEach(item => {
      if (!groups[item.category]) groups[item.category] = { items: [], total: 0 }
      groups[item.category].items.push(item)
      groups[item.category].total += item.amount
    })
    return groups
  }, [items])

  const taxAmount = Math.round(totalSpent * 0.05)
  const grandTotal = totalSpent + taxAmount
  const remaining = totalBudget - grandTotal

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const invoiceId = `INV-${Date.now().toString(36).toUpperCase().slice(-6)}`

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 p-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-white font-bold text-sm">Expense Invoice</h3>
          </div>
          <p className="text-white/40 text-xs">Generated {today}</p>
        </div>
        <div className="text-right">
          <p className="text-white text-xs font-mono">Invoice #{invoiceId}</p>
          <p className="text-white/40 text-[10px] mt-0.5">
            Status: {totalSpent > totalBudget
              ? <span className="text-red-400">Over Budget</span>
              : <span className="text-green-400">Within Budget</span>
            }
          </p>
        </div>
      </div>

      {/* Trip Info */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Trip</p>
          <p className="font-bold text-navy-900 text-sm">{tripName}</p>
          {tripDates && (
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(tripDates.start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(tripDates.end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-right">
          <p className="text-[10px] text-amber-600 font-medium">Budget Insights</p>
          <p className="text-xs text-navy-900 mt-1">
            Total Budget: <span className="font-bold">{formatCurrency(totalBudget)}</span>
          </p>
          <p className="text-xs text-navy-900">
            Total Spent: <span className="font-bold text-amber-600">{formatCurrency(totalSpent)}</span>
          </p>
          <p className={`text-xs font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            Remaining: {formatCurrency(Math.abs(remaining))} {remaining < 0 ? '(over)' : ''}
          </p>
        </div>
      </div>

      {/* Expense Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length > 0 ? items.map((item, i) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-3 text-xs text-gray-400">{i + 1}</td>
                <td className="px-6 py-3">
                  <span className="text-xs">{CATEGORY_LABELS[item.category] || item.category}</span>
                </td>
                <td className="px-6 py-3 font-medium text-navy-900">{item.label}</td>
                <td className="px-6 py-3 text-gray-500 text-xs">{item.date || '—'}</td>
                <td className="px-6 py-3 text-right font-mono font-semibold text-navy-900">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-xs">
                  No expenses recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200">
        <div className="flex justify-end">
          <div className="w-72 divide-y divide-gray-100">
            <div className="flex justify-between px-6 py-2.5">
              <span className="text-xs text-gray-500">Subtotal</span>
              <span className="text-xs font-mono font-semibold text-navy-900">{formatCurrency(totalSpent)}</span>
            </div>
            <div className="flex justify-between px-6 py-2.5">
              <span className="text-xs text-gray-500">Service Tax (5%)</span>
              <span className="text-xs font-mono text-gray-600">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between px-6 py-2.5">
              <span className="text-xs text-gray-500">Discount</span>
              <span className="text-xs font-mono text-green-600">₹0</span>
            </div>
            <div className="flex justify-between px-6 py-3 bg-navy-900">
              <span className="text-xs font-bold text-white">Grand Total</span>
              <span className="text-sm font-mono font-bold text-amber-400">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 p-5 border-t border-gray-100">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl transition-colors">
          <Download className="w-3.5 h-3.5" /> Download Invoice
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-navy-900 text-xs font-bold rounded-xl transition-colors">
          <Printer className="w-3.5 h-3.5" /> Export as PDF
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 border border-green-200 hover:bg-green-100 text-green-700 text-xs font-bold rounded-xl transition-colors">
          ✓ Mark as Paid
        </button>
      </div>
    </div>
  )
}
