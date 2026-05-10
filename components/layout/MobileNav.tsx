'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Map, Compass, Building2, UserCircle } from 'lucide-react'

const navItems = [
  { label: 'Home', href: '/', icon: LayoutDashboard },
  { label: 'Trips', href: '/trips', icon: Map },
  { label: 'Cities', href: '/cities', icon: Building2 },
  { label: 'Explore', href: '/activities', icon: Compass },
  { label: 'Profile', href: '/profile', icon: UserCircle },
]

export default function MobileNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 lg:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(item => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all',
                active ? 'text-amber-500' : 'text-gray-400'
              )}
            >
              <Icon className={cn('w-5 h-5', active && 'text-amber-500')} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-amber-500 mt-0.5" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
