import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast'

export const metadata: Metadata = {
  title: 'Traveloop — AI-Powered Travel Planning',
  description:
    'Plan your dream trips with AI. Build itineraries, track budgets, explore cities, and share travel plans — all in one beautiful platform.',
  keywords: ['travel', 'trip planner', 'AI itinerary', 'travel planning', 'budget tracker'],
  openGraph: {
    title: 'Traveloop — AI-Powered Travel Planning',
    description: 'Plan your dream trips with AI. Build itineraries, track budgets, and share travel plans.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-gray-50">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
