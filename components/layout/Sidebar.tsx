'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Map,
  Compass,
  Building2,
  UserCircle,
  BarChart3,
  PlusCircle,
  Users2,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Trips', href: '/trips', icon: Map },
  { label: 'Cities', href: '/cities', icon: Building2 },
  { label: 'Activities', href: '/activities', icon: Compass },
  { label: 'Community', href: '/community', icon: Users2 },
  { label: 'Profile', href: '/profile', icon: UserCircle },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname.startsWith(href)
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-navy-900 text-white h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
        <span className="text-2xl">🧳</span>
        <span className="font-bold text-lg tracking-tight text-white">Traveloop</span>
      </div>

      {/* New Trip CTA */}
      <div className="px-4 mt-6">
        <Link
          href="/trips/new"
          className="flex items-center justify-center gap-2 w-full bg-amber-500 text-navy-900 rounded-xl px-4 py-3 font-semibold text-sm hover:bg-amber-400 transition-all duration-200 shadow-lg shadow-amber-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          Plan New Trip
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-6 space-y-1">
        <p className="px-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">
          Navigation
        </p>
        {navItems.map(item => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-white/10 text-amber-400'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'
              )}
            >
              <Icon className={cn('w-5 h-5', active ? 'text-amber-400' : 'text-white/40')} />
              {item.label}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-xs text-white/50">Traveloop v1.0</p>
          <p className="text-[11px] text-white/30 mt-1">AI-Powered Travel Planning</p>
        </div>
      </div>
    </aside>
  )
}
