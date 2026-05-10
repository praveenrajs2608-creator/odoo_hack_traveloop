'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AIGenerateButtonProps {
  onGenerate: (prompt: string) => Promise<void>
}

export function AIGenerateButton({ onGenerate }: AIGenerateButtonProps) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      await onGenerate(prompt)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="font-bold text-navy-900">AI Trip Generator</h3>
          <p className="text-xs text-gray-500">Describe your dream trip and let AI build your itinerary</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. 5-day trip to Rajasthan with ₹30k budget, culture & food focus"
          className="flex-1 rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm 
                     placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 
                     focus:border-amber-500 transition-all"
          onKeyDown={e => e.key === 'Enter' && handleGenerate()}
        />
        <Button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            {['Building your itinerary...', 'Finding the best activities...', 'Calculating budget...'].map(
              (text, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 1.2 }}
                  className="flex items-center gap-2 text-sm text-amber-700"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {text}
                </motion.div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
