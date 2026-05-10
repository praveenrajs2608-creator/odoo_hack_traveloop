'use client'

import { motion } from 'framer-motion'
import { MapPin, TrendingUp, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { City } from '@/types/activity'

interface CityCardProps {
  city: City
  onAdd?: (city: City) => void
}

export function CityCard({ city, onAdd }: CityCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl overflow-hidden shadow-card bg-white border border-gray-100 group"
    >
      <div className="relative h-36 bg-gradient-to-br from-navy-800 to-navy-900 overflow-hidden">
        {city.image_url ? (
          <img
            src={city.image_url}
            alt={city.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-30">🏙️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <h3 className="font-bold text-white text-lg drop-shadow-md">{city.name}</h3>
          <p className="text-white/80 text-xs flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {city.country}
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          {city.cost_index && (
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-xs font-medium text-gray-600">
                Cost Index: <span className="font-mono font-semibold text-teal-500">{city.cost_index}</span>
              </span>
            </div>
          )}
          {city.popularity_score > 0 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, Math.ceil(city.popularity_score / 20)) }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
          )}
        </div>

        {city.tags && city.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {city.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-[10px] text-gray-500 font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {onAdd && (
          <Button size="sm" variant="outline" className="w-full" onClick={() => onAdd(city)}>
            <MapPin className="w-3.5 h-3.5" />
            Add to Trip
          </Button>
        )}
      </div>
    </motion.div>
  )
}
