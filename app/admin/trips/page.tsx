'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Map, Search, Edit3, Save, X, IndianRupee,
  Calendar, Users, TrendingUp, Settings2,
} from 'lucide-react'

interface TripConfig {
  id: string
  category: string
  description: string
  base_cost: string
  per_person_cost: string
  tax_pct: number
  is_active: boolean
}

const TRIP_CONFIGS: TripConfig[] = [
  { id: '1', category: 'Transport — Flight (Domestic)', description: 'One-way domestic flights', base_cost: '3,500', per_person_cost: '3,500', tax_pct: 5, is_active: true },
  { id: '2', category: 'Transport — Flight (International)', description: 'One-way international flights', base_cost: '15,000', per_person_cost: '15,000', tax_pct: 5, is_active: true },
  { id: '3', category: 'Transport — Train', description: 'Train ticket (AC class)', base_cost: '800', per_person_cost: '800', tax_pct: 5, is_active: true },
  { id: '4', category: 'Transport — Bus', description: 'Inter-city bus booking', base_cost: '500', per_person_cost: '500', tax_pct: 5, is_active: true },
  { id: '5', category: 'Stay — Budget Hotel', description: 'Per night budget accommodation', base_cost: '1,200', per_person_cost: '600', tax_pct: 12, is_active: true },
  { id: '6', category: 'Stay — Mid-Range Hotel', description: 'Per night 3-star accommodation', base_cost: '3,500', per_person_cost: '1,750', tax_pct: 12, is_active: true },
  { id: '7', category: 'Stay — Premium Hotel', description: 'Per night 5-star accommodation', base_cost: '8,000', per_person_cost: '4,000', tax_pct: 18, is_active: true },
  { id: '8', category: 'Activities — Sightseeing', description: 'Average activity/entry fee', base_cost: '500', per_person_cost: '500', tax_pct: 0, is_active: true },
  { id: '9', category: 'Activities — Adventure', description: 'Adventure sports (rafting, paragliding)', base_cost: '2,500', per_person_cost: '2,500', tax_pct: 18, is_active: true },
  { id: '10', category: 'Meals — Budget', description: 'Per day meal cost (street food)', base_cost: '500', per_person_cost: '500', tax_pct: 5, is_active: true },
  { id: '11', category: 'Meals — Restaurant', description: 'Per day meal cost (restaurants)', base_cost: '1,500', per_person_cost: '1,500', tax_pct: 5, is_active: true },
  { id: '12', category: 'Miscellaneous', description: 'Tips, local transport, shopping', base_cost: '800', per_person_cost: '800', tax_pct: 0, is_active: true },
]

// Platform-level settings
interface PlatformSetting {
  label: string
  value: string
  description: string
  type: 'text' | 'number' | 'toggle'
}

const PLATFORM_SETTINGS: PlatformSetting[] = [
  { label: 'Default Currency', value: 'INR (₹)', description: 'Currency used across the platform', type: 'text' },
  { label: 'Service Tax Rate (%)', value: '5', description: 'Tax applied on invoices', type: 'number' },
  { label: 'Max Trip Duration (days)', value: '30', description: 'Maximum allowed trip duration', type: 'number' },
  { label: 'Max Budget per Person (₹)', value: '5,00,000', description: 'Upper budget limit for trip planning', type: 'text' },
  { label: 'AI Recommendations per Query', value: '6', description: 'Number of Gemini AI results returned', type: 'number' },
  { label: 'Enable Quiz Feature', value: 'true', description: 'Show Where2Go quiz on Cities page', type: 'toggle' },
]

export default function AdminTripsPage() {
  const [configs, setConfigs] = useState(TRIP_CONFIGS)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<TripConfig>>({})
  const [activeTab, setActiveTab] = useState<'costs' | 'settings'>('costs')

  const filtered = configs.filter(c =>
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const startEdit = (config: TripConfig) => {
    setEditingId(config.id)
    setEditData({ ...config })
  }

  const saveEdit = () => {
    if (!editingId) return
    setConfigs(prev => prev.map(c => c.id === editingId ? { ...c, ...editData } as TripConfig : c))
    setEditingId(null)
  }

  const inputClass = 'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all'

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
          <Map className="w-6 h-6 text-amber-500" /> Trip & Cost Settings
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Configure default pricing, taxes, and platform settings</p>
      </div>

      {/* Tab toggle */}
      <div className="flex bg-gray-100 rounded-xl p-0.5 w-fit">
        <button
          onClick={() => setActiveTab('costs')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all
            ${activeTab === 'costs' ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-navy-900'}`}
        >
          <IndianRupee className="w-3.5 h-3.5" /> Cost Matrix
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all
            ${activeTab === 'settings' ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-navy-900'}`}
        >
          <Settings2 className="w-3.5 h-3.5" /> Platform Settings
        </button>
      </div>

      {activeTab === 'costs' ? (
        <>
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: 'Avg Flight Cost', value: '₹9,250', color: 'text-blue-600 bg-blue-50' },
              { icon: Calendar, label: 'Avg Stay/Night', value: '₹4,233', color: 'text-amber-600 bg-amber-50' },
              { icon: Users, label: 'Avg Meal/Day', value: '₹1,000', color: 'text-green-600 bg-green-50' },
              { icon: IndianRupee, label: 'Avg Tax Rate', value: '7.5%', color: 'text-purple-600 bg-purple-50' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold text-navy-900">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Cost Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Description</th>
                    <th className="px-5 py-3">Base Cost (₹)</th>
                    <th className="px-5 py-3">Per Person (₹)</th>
                    <th className="px-5 py-3">Tax %</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(config => (
                    <tr key={config.id} className="hover:bg-gray-50/50 transition-colors">
                      {editingId === config.id ? (
                        <>
                          <td className="px-5 py-3"><input className={inputClass} value={editData.category} onChange={e => setEditData(p => ({ ...p, category: e.target.value }))} /></td>
                          <td className="px-5 py-3"><input className={inputClass} value={editData.description} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} /></td>
                          <td className="px-5 py-3"><input className={inputClass} value={editData.base_cost} onChange={e => setEditData(p => ({ ...p, base_cost: e.target.value }))} /></td>
                          <td className="px-5 py-3"><input className={inputClass} value={editData.per_person_cost} onChange={e => setEditData(p => ({ ...p, per_person_cost: e.target.value }))} /></td>
                          <td className="px-5 py-3"><input className={inputClass} type="number" value={editData.tax_pct} onChange={e => setEditData(p => ({ ...p, tax_pct: parseFloat(e.target.value) }))} /></td>
                          <td className="px-5 py-3">
                            <select className={inputClass} value={editData.is_active ? 'true' : 'false'} onChange={e => setEditData(p => ({ ...p, is_active: e.target.value === 'true' }))}>
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <button onClick={saveEdit} className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"><Save className="w-3.5 h-3.5" /></button>
                              <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-5 py-3">
                            <p className="font-semibold text-navy-900 text-sm">{config.category}</p>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-500">{config.description}</td>
                          <td className="px-5 py-3 font-mono text-sm font-semibold text-navy-900">₹{config.base_cost}</td>
                          <td className="px-5 py-3 font-mono text-sm font-semibold text-amber-600">₹{config.per_person_cost}</td>
                          <td className="px-5 py-3 text-sm text-gray-600">{config.tax_pct}%</td>
                          <td className="px-5 py-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                              {config.is_active ? '● Active' : '○ Off'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button onClick={() => startEdit(config)} className="p-1.5 rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-all">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Platform Settings */
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {PLATFORM_SETTINGS.map(setting => (
            <div key={setting.label} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-navy-900">{setting.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{setting.description}</p>
              </div>
              <div className="w-48">
                {setting.type === 'toggle' ? (
                  <div className="flex justify-end">
                    <button className={`w-12 h-6 rounded-full transition-colors ${setting.value === 'true' ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${setting.value === 'true' ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ) : (
                  <input
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-right font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    defaultValue={setting.value}
                  />
                )}
              </div>
            </div>
          ))}
          <div className="px-6 py-4 flex justify-end">
            <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-sm rounded-xl transition-all">
              Save All Settings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
