'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/toast'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/utils'
import {
  Search, SlidersHorizontal, ArrowUpDown, LayoutGrid,
  Check, FileText, Shirt, Laptop, Plus, RotateCcw,
  Share2, ChevronDown, ChevronUp, Sparkles, X,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import type { PackingItem, PackingCategory } from '@/types/budget'
import type { Trip } from '@/types/trip'

const CATEGORY_META: Record<string, { icon: any; color: string; bg: string }> = {
  documents: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  clothing: { icon: Shirt, color: 'text-purple-600', bg: 'bg-purple-50' },
  electronics: { icon: Laptop, color: 'text-teal-600', bg: 'bg-teal-50' },
  toiletries: { icon: Sparkles, color: 'text-pink-600', bg: 'bg-pink-50' },
}

const CATEGORIES = [
  { id: 'documents', label: 'Documents' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'toiletries', label: 'Toiletries' },
]

const DEFAULT_ITEMS: PackingItem[] = [
  { id: '1', trip_id: '', name: 'Passport', category: 'documents' as any, is_packed: true, created_at: '' },
  { id: '2', trip_id: '', name: 'Flight Tickets (printed)', category: 'documents' as any, is_packed: true, created_at: '' },
  { id: '3', trip_id: '', name: 'Travel insurance', category: 'documents' as any, is_packed: true, created_at: '' },
  { id: '4', trip_id: '', name: 'Hotel booking confirmation', category: 'documents' as any, is_packed: false, created_at: '' },
  { id: '5', trip_id: '', name: 'Casual Shirts', category: 'clothing' as any, is_packed: true, created_at: '' },
  { id: '6', trip_id: '', name: 'Trousers / jeans', category: 'clothing' as any, is_packed: false, created_at: '' },
  { id: '7', trip_id: '', name: 'Comfortable walking shoes', category: 'clothing' as any, is_packed: false, created_at: '' },
  { id: '8', trip_id: '', name: 'Light jacket / windbreaker', category: 'clothing' as any, is_packed: false, created_at: '' },
  { id: '9', trip_id: '', name: 'Phone charger', category: 'electronics' as any, is_packed: true, created_at: '' },
  { id: '10', trip_id: '', name: 'Universal power adapter', category: 'electronics' as any, is_packed: false, created_at: '' },
  { id: '11', trip_id: '', name: 'Earphones / headphones', category: 'electronics' as any, is_packed: false, created_at: '' },
]

export default function PackingPage({ params }: { params: { tripId: string } }) {
  const { toast } = useToast()
  const [items, setItems] = useState<PackingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemCat, setNewItemCat] = useState('documents')

  useEffect(() => {
    const load = async () => {
      const { data: tripData } = await supabase
        .from('trips').select('*').eq('id', params.tripId).single()
      setTrip(tripData)

      const { data } = await supabase
        .from('packing_items').select('*')
        .eq('trip_id', params.tripId)
        .order('created_at', { ascending: true })

      if (!data || data.length === 0) {
        setItems(DEFAULT_ITEMS.map(i => ({ ...i, trip_id: params.tripId })))
      } else {
        setItems(data)
      }
      setLoading(false)
    }
    load()
  }, [params.tripId])

  const packedCount = useMemo(() => items.filter(i => i.is_packed).length, [items])
  const totalCount = items.length
  const pct = totalCount === 0 ? 0 : Math.round((packedCount / totalCount) * 100)

  const handleToggle = async (id: string, isPacked: boolean) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, is_packed: isPacked } : i)))
    if (!id.match(/^\d+$/)) {
      await supabase.from('packing_items').update({ is_packed: isPacked }).eq('id', id)
    }
  }

  const handleResetAll = () => {
    setItems(prev => prev.map(i => ({ ...i, is_packed: false })))
    toast('All items reset', 'info')
  }

  const handleAddItem = () => {
    if (!newItemName.trim()) return
    const newItem: PackingItem = {
      id: `new-${Date.now()}`,
      trip_id: params.tripId,
      name: newItemName.trim(),
      category: newItemCat as any,
      is_packed: false,
      created_at: new Date().toISOString(),
    }
    setItems(prev => [...prev, newItem])
    setNewItemName('')
    setShowAddModal(false)
    toast('Item added!', 'success')
  }

  const toggleCollapse = (catId: string) => {
    setCollapsedCats(prev => {
      const next = new Set(prev)
      next.has(catId) ? next.delete(catId) : next.add(catId)
      return next
    })
  }

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items
    return items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [items, searchQuery])

  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in">

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search items..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-sm" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <LayoutGrid className="w-4 h-4" /><span>Group by</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <SlidersHorizontal className="w-4 h-4" /><span>Filter</span>
          </button>
          <div className="relative flex-1 sm:flex-none">
            <button onClick={() => setShowSortMenu(!showSortMenu)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <ArrowUpDown className="w-4 h-4" /><span>Sort by</span>
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-gray-100 shadow-xl z-20 overflow-hidden">
                {['Category', 'Name A–Z', 'Packed first', 'Unpacked first'].map(opt => (
                  <button key={opt} onClick={() => setShowSortMenu(false)}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href={`/trips/${params.tripId}`} className="text-gray-400 hover:text-navy-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-navy-900">Packing Checklist</h1>
          </div>
          <p className="text-sm text-gray-400 ml-8">{trip?.name || 'Paris & Rome Adventure'}</p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">Packing Progress</p>
            <p className="text-3xl font-bold text-white">{pct}%</p>
          </div>
          <div className="text-right">
            <p className="text-amber-400 font-bold text-lg">{packedCount}/{totalCount}</p>
            <p className="text-white/40 text-xs">items packed</p>
          </div>
        </div>
        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: pct === 100 ? '#22c55e' : 'linear-gradient(90deg, #F5A623, #f59e0b)' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        {pct === 100 && (
          <p className="text-green-400 text-sm font-medium mt-3 flex items-center gap-1.5">
            <Check className="w-4 h-4" /> All packed — you&apos;re ready to go! 🎉
          </p>
        )}
      </div>

      {/* Categories */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        {CATEGORIES.map(cat => {
          const catItems = filteredItems.filter(i => i.category === cat.id)
          if (catItems.length === 0) return null
          const catPacked = catItems.filter(i => i.is_packed).length
          const isCollapsed = collapsedCats.has(cat.id)
          const meta = CATEGORY_META[cat.id] || CATEGORY_META.documents
          const CatIcon = meta.icon

          return (
            <motion.div key={cat.id} variants={staggerItem}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCollapse(cat.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.bg}`}>
                      <CatIcon className={`w-4 h-4 ${meta.color}`} />
                    </div>
                    <span className="font-bold text-navy-900">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-navy-900">{catPacked}/{catItems.length}</span>
                    {isCollapsed ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {/* Items */}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 space-y-1">
                        {catItems.map(item => (
                          <label
                            key={item.id}
                            className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group"
                          >
                            <div
                              onClick={(e) => { e.preventDefault(); handleToggle(item.id, !item.is_packed) }}
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0
                                ${item.is_packed
                                  ? 'bg-navy-900 border-navy-900 scale-100'
                                  : 'border-gray-300 bg-transparent group-hover:border-navy-900'}`}
                            >
                              {item.is_packed && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
                                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </motion.div>
                              )}
                            </div>
                            <span className={`text-sm transition-all duration-200 ${item.is_packed ? 'text-gray-400 line-through' : 'text-navy-900'}`}>
                              {item.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap gap-3 pt-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex-1 min-w-[180px] py-3 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-sm rounded-xl transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
        <button onClick={handleResetAll}
          className="flex-1 min-w-[140px] py-3 border-2 border-navy-900 rounded-xl font-semibold text-sm text-navy-900 hover:bg-navy-900 hover:text-white transition-colors flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> Reset All
        </button>
        <button className="flex-1 min-w-[140px] py-3 border-2 border-navy-900 rounded-xl font-semibold text-sm text-navy-900 hover:bg-navy-900 hover:text-white transition-colors flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-navy-900">Add Packing Item</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-1">Item name</label>
                  <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddItem()}
                    placeholder="e.g. Sunscreen, Charger..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    autoFocus />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-1">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(cat => {
                      const meta = CATEGORY_META[cat.id] || CATEGORY_META.documents
                      const CatIcon = meta.icon
                      return (
                        <button key={cat.id} onClick={() => setNewItemCat(cat.id)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all
                            ${newItemCat === cat.id ? 'border-amber-500 bg-amber-50 text-navy-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                          <CatIcon className={`w-4 h-4 ${meta.color}`} />{cat.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <button onClick={handleAddItem}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-sm rounded-xl transition-colors">
                  Add to Checklist
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
