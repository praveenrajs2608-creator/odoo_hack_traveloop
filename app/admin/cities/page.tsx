'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2, Search, Edit3, Save, X, Plus, Trash2,
  IndianRupee, MapPin, Tag,
} from 'lucide-react'

interface CityConfig {
  id: string
  name: string
  country: string
  budget_level: string
  estimated_cost_inr: string
  best_season: string[]
  tags: string[]
  status: 'active' | 'draft'
}

const INITIAL_CITIES: CityConfig[] = [
  { id: '1', name: 'Goa', country: 'India', budget_level: 'moderate', estimated_cost_inr: '25,000', best_season: ['winter', 'spring'], tags: ['Beach', 'Nightlife', 'Water Sports'], status: 'active' },
  { id: '2', name: 'Manali', country: 'India', budget_level: 'budget', estimated_cost_inr: '15,000', best_season: ['summer', 'winter'], tags: ['Mountains', 'Snow', 'Adventure'], status: 'active' },
  { id: '3', name: 'Jaipur', country: 'India', budget_level: 'moderate', estimated_cost_inr: '20,000', best_season: ['winter'], tags: ['Heritage', 'Forts', 'Culture'], status: 'active' },
  { id: '4', name: 'Bali', country: 'Indonesia', budget_level: 'premium', estimated_cost_inr: '80,000', best_season: ['summer', 'spring'], tags: ['Beach', 'Temples', 'Rice Fields'], status: 'active' },
  { id: '5', name: 'Dubai', country: 'UAE', budget_level: 'luxury', estimated_cost_inr: '1,50,000', best_season: ['winter'], tags: ['Shopping', 'Desert', 'Skyline'], status: 'active' },
  { id: '6', name: 'Paris', country: 'France', budget_level: 'premium', estimated_cost_inr: '1,20,000', best_season: ['spring', 'summer'], tags: ['Romance', 'Art', 'Food'], status: 'active' },
  { id: '7', name: 'Ooty', country: 'India', budget_level: 'budget', estimated_cost_inr: '12,000', best_season: ['summer', 'monsoon'], tags: ['Hills', 'Tea Gardens', 'Nature'], status: 'draft' },
  { id: '8', name: 'Maldives', country: 'Maldives', budget_level: 'luxury', estimated_cost_inr: '2,00,000', best_season: ['winter', 'spring'], tags: ['Island', 'Snorkeling', 'Luxury'], status: 'active' },
]

const BUDGET_COLORS: Record<string, string> = {
  budget: 'bg-green-50 text-green-700',
  moderate: 'bg-blue-50 text-blue-700',
  premium: 'bg-purple-50 text-purple-700',
  luxury: 'bg-amber-50 text-amber-700',
}

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<CityConfig[]>(INITIAL_CITIES)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<CityConfig>>({})
  const [showAdd, setShowAdd] = useState(false)
  const [newCity, setNewCity] = useState<Partial<CityConfig>>({
    name: '', country: '', budget_level: 'moderate', estimated_cost_inr: '',
    best_season: [], tags: [], status: 'draft',
  })

  const filtered = cities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const startEdit = (city: CityConfig) => {
    setEditingId(city.id)
    setEditData({ ...city })
  }

  const saveEdit = () => {
    if (!editingId) return
    setCities(prev => prev.map(c => c.id === editingId ? { ...c, ...editData } as CityConfig : c))
    setEditingId(null)
    setEditData({})
  }

  const handleAdd = () => {
    if (!newCity.name || !newCity.country) return
    const city: CityConfig = {
      id: Date.now().toString(),
      name: newCity.name || '',
      country: newCity.country || '',
      budget_level: newCity.budget_level || 'moderate',
      estimated_cost_inr: newCity.estimated_cost_inr || '0',
      best_season: newCity.best_season || [],
      tags: newCity.tags || [],
      status: 'draft',
    }
    setCities(prev => [city, ...prev])
    setShowAdd(false)
    setNewCity({ name: '', country: '', budget_level: 'moderate', estimated_cost_inr: '', best_season: [], tags: [], status: 'draft' })
  }

  const handleDelete = (id: string) => {
    setCities(prev => prev.filter(c => c.id !== id))
  }

  const inputClass = 'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all'

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-500" /> City Cost Settings
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage pricing, budget levels, and seasons for cities</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-sm rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" /> Add City
        </button>
      </div>

      {/* Add New City Form */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-navy-900 text-sm mb-4">Add New City</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input className={inputClass} placeholder="City name" value={newCity.name}
                onChange={e => setNewCity(p => ({ ...p, name: e.target.value }))} />
              <input className={inputClass} placeholder="Country" value={newCity.country}
                onChange={e => setNewCity(p => ({ ...p, country: e.target.value }))} />
              <select className={inputClass} value={newCity.budget_level}
                onChange={e => setNewCity(p => ({ ...p, budget_level: e.target.value }))}>
                <option value="budget">Budget</option>
                <option value="moderate">Moderate</option>
                <option value="premium">Premium</option>
                <option value="luxury">Luxury</option>
              </select>
              <input className={inputClass} placeholder="Cost (₹)" value={newCity.estimated_cost_inr}
                onChange={e => setNewCity(p => ({ ...p, estimated_cost_inr: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-xs text-gray-500 hover:text-navy-900">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 bg-navy-900 text-white text-xs font-bold rounded-lg">Save City</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search cities..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
        />
      </div>

      {/* Cities Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Budget Level</th>
                <th className="px-5 py-3">Cost (per person)</th>
                <th className="px-5 py-3">Best Season</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(city => (
                <tr key={city.id} className="hover:bg-gray-50/50 transition-colors">
                  {editingId === city.id ? (
                    <>
                      <td className="px-5 py-3">
                        <input className={inputClass} value={editData.name}
                          onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} />
                      </td>
                      <td className="px-5 py-3">
                        <select className={inputClass} value={editData.budget_level}
                          onChange={e => setEditData(p => ({ ...p, budget_level: e.target.value }))}>
                          <option value="budget">Budget</option>
                          <option value="moderate">Moderate</option>
                          <option value="premium">Premium</option>
                          <option value="luxury">Luxury</option>
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <input className={inputClass} value={editData.estimated_cost_inr}
                          onChange={e => setEditData(p => ({ ...p, estimated_cost_inr: e.target.value }))} />
                      </td>
                      <td className="px-5 py-3">
                        <input className={inputClass} placeholder="winter,summer" value={editData.best_season?.join(',')}
                          onChange={e => setEditData(p => ({ ...p, best_season: e.target.value.split(',').map(s => s.trim()) }))} />
                      </td>
                      <td className="px-5 py-3">
                        <select className={inputClass} value={editData.status}
                          onChange={e => setEditData(p => ({ ...p, status: e.target.value as 'active' | 'draft' }))}>
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
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
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-semibold text-navy-900 text-sm">{city.name}</p>
                            <p className="text-xs text-gray-400">{city.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${BUDGET_COLORS[city.budget_level] || 'bg-gray-100 text-gray-600'}`}>
                          {city.budget_level}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm font-mono font-semibold text-navy-900 flex items-center gap-1">
                          <IndianRupee className="w-3 h-3" />{city.estimated_cost_inr}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {city.best_season.map(s => (
                            <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${city.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                          {city.status === 'active' ? '● Active' : '○ Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => startEdit(city)} className="p-1.5 rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-all">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(city.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
