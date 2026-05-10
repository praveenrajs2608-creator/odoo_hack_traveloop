'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, ArrowLeft, Search, Edit3,
  Calendar, MapPin, StickyNote, BookOpen, Filter,
} from 'lucide-react'
import Link from 'next/link'
import type { TripNote } from '@/types/budget'
import { format } from 'date-fns'

type FilterMode = 'all' | 'day' | 'stop'

export default function NotesPage({ params }: { params: { tripId: string } }) {
  const { toast } = useToast()
  const [notes, setNotes] = useState<TripNote[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [tripName, setTripName] = useState('')
  const [dayNumber, setDayNumber] = useState<number | ''>('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    let mounted = true

    // Safety timeout — always show content after 3s
    const timer = setTimeout(() => {
      if (mounted) setLoading(false)
    }, 3000)

    const fetchData = async () => {
      // Fetch trip name
      const tripRes = await supabase
        .from('trips')
        .select('name')
        .eq('id', params.tripId)
        .maybeSingle()
      if (mounted && tripRes.data?.name) setTripName(tripRes.data.name)

      // Fetch notes
      const notesRes = await supabase
        .from('trip_notes')
        .select('*')
        .eq('trip_id', params.tripId)
        .order('created_at', { ascending: false })
      if (mounted && notesRes.data) setNotes(notesRes.data)

      if (mounted) setLoading(false)
    }
    fetchData()

    return () => { mounted = false; clearTimeout(timer) }
  }, [params.tripId])

  const filteredNotes = useMemo(() => {
    let result = [...notes]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(n => n.content.toLowerCase().includes(q))
    }

    if (filterMode === 'day' && selectedDay !== null) {
      result = result.filter(n => n.day_number === selectedDay)
    }

    if (filterMode === 'stop') {
      result = result.filter(n => n.stop_id !== null)
    }

    return result
  }, [notes, searchQuery, filterMode, selectedDay])

  const uniqueDays = useMemo(() => {
    const days = notes
      .map(n => n.day_number)
      .filter((d): d is number => d !== null)
    return Array.from(new Set(days)).sort((a, b) => a - b)
  }, [notes])

  const handleAdd = async () => {
    if (!content.trim()) return
    const { data, error } = await supabase
      .from('trip_notes')
      .insert({
        trip_id: params.tripId,
        content,
        day_number: dayNumber || null,
      })
      .select()
      .single()
    if (error) {
      toast(error.message, 'error')
      return
    }
    setNotes(prev => [data as TripNote, ...prev])
    setContent('')
    setDayNumber('')
    setShowAddForm(false)
    toast('Note added', 'success')
  }

  const handleUpdate = async (id: string) => {
    if (!editContent.trim()) return
    await supabase
      .from('trip_notes')
      .update({ content: editContent, updated_at: new Date().toISOString() })
      .eq('id', id)
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, content: editContent } : n)))
    setEditingId(null)
    setEditContent('')
    toast('Note updated', 'success')
  }

  const handleDelete = async (id: string) => {
    await supabase.from('trip_notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
    toast('Note deleted', 'success')
  }

  const startEdit = (note: TripNote) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-in">
        <div className="h-10 bg-gray-100 rounded-xl animate-pulse w-1/3" />
        <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/trips/${params.tripId}`}
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-navy-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trip
          </Link>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-500" />
            Trip Notes
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{tripName}</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" />
          Add Note
        </Button>
      </div>

      {/* Add Note Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl bg-white border border-gray-100 shadow-card p-5">
              <textarea
                placeholder="Write a note, thought, or memory..."
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm
                           placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30
                           focus:border-amber-500 transition-all resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 font-medium">Day #</label>
                  <input
                    type="number"
                    min={1}
                    value={dayNumber}
                    onChange={e => setDayNumber(e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="—"
                    className="w-16 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-center
                               focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowAddForm(false); setContent(''); setDayNumber('') }}
                    className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-navy-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <Button onClick={handleAdd} disabled={!content.trim()}>
                    <StickyNote className="w-3.5 h-3.5" />
                    Save Note
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm
                       placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30
                       focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {([
          { mode: 'all' as FilterMode, label: 'All', icon: Filter },
          { mode: 'day' as FilterMode, label: 'by Day', icon: Calendar },
          { mode: 'stop' as FilterMode, label: 'by Stop', icon: MapPin },
        ]).map(tab => (
          <button
            key={tab.mode}
            onClick={() => { setFilterMode(tab.mode); setSelectedDay(null) }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all
              ${filterMode === tab.mode
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}

        {/* Day picker pills */}
        {filterMode === 'day' && uniqueDays.length > 0 && (
          <div className="flex gap-1 ml-2">
            {uniqueDays.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(selectedDay === d ? null : d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${selectedDay === d ? 'bg-amber-500 text-navy-900' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
              >
                Day {d}
              </button>
            ))}
          </div>
        )}

        <span className="ml-auto text-xs text-gray-400">
          {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Notes List */}
      <motion.div
        layout
        className="space-y-3"
      >
        <AnimatePresence>
          {filteredNotes.map((note, i) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl bg-white border border-gray-100 shadow-card overflow-hidden group hover:shadow-float hover:border-gray-200 transition-all"
            >
              {editingId === note.id ? (
                <div className="p-5">
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm
                               focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => { setEditingId(null); setEditContent('') }}
                      className="px-3 py-1.5 text-xs text-gray-500 hover:text-navy-900"
                    >
                      Cancel
                    </button>
                    <Button onClick={() => handleUpdate(note.id)}>Save</Button>
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  {/* Meta badges */}
                  <div className="flex items-center gap-2 mb-2">
                    {note.day_number && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Day {note.day_number}
                      </span>
                    )}
                    {note.stop_id && (
                      <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Stop
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400">
                      {format(new Date(note.created_at), 'MMM d, yyyy · h:mm a')}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(note)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNotes.length === 0 && !loading && (
          <div className="text-center py-16 rounded-2xl bg-white border border-gray-100">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-base font-bold text-navy-900 mb-1">
              {searchQuery ? 'No matching notes' : 'No notes yet'}
            </h3>
            <p className="text-gray-400 text-sm">
              {searchQuery
                ? 'Try a different search term'
                : 'Start journaling your trip! Click "Add Note" above.'
              }
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
