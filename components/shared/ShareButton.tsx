'use client'

import { useState } from 'react'
import { Share2, Copy, Check, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

interface ShareButtonProps {
  tripId: string
  tripName: string
  shareToken?: string
}

export function ShareButton({ tripId, tripName, shareToken }: ShareButtonProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${tripId}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Check out my trip "${tripName}" on Traveloop! ${shareUrl}`)}`,
      '_blank'
    )
  }

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my trip "${tripName}" on @Traveloop! 🧳✈️`)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    )
  }

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setShowMenu(!showMenu)}>
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-float border border-gray-100 py-2 z-20 animate-slide-up">
          <button
            onClick={copyLink}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={shareWhatsApp}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
          >
            <MessageCircle className="w-4 h-4 text-green-500" />
            WhatsApp
          </button>
          <button
            onClick={shareTwitter}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
          >
            <span className="w-4 h-4 text-center text-sm">𝕏</span>
            Twitter / X
          </button>
        </div>
      )}
    </div>
  )
}
