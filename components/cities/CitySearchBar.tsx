'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Loader2 } from 'lucide-react'

interface CitySearchBarProps {
  onSearch: (query: string) => void
  loading?: boolean
}

export function CitySearchBar({ onSearch, loading }: CitySearchBarProps) {
  const [query, setQuery] = useState('')

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        {loading ? (
          <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
        ) : (
          <Search className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search cities — Paris, Tokyo, Jaipur..."
        className="w-full pl-12 pr-4 py-3.5 text-sm rounded-2xl border border-gray-200 bg-white 
                   placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 
                   focus:border-amber-500 transition-all shadow-sm"
      />
    </div>
  )
}
