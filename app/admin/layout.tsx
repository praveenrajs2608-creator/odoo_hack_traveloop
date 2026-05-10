'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Building2, Map, Settings, LogOut, Shield,
  ChevronRight,
} from 'lucide-react'

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'City Settings', href: '/admin/cities', icon: Building2 },
  { label: 'Trip Settings', href: '/admin/trips', icon: Map },
  { label: 'Platform', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false)
      setAuthenticated(true) // Allow login page to render
      return
    }

    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.replace('/admin/login')
    } else {
      setAuthenticated(true)
    }
    setChecking(false)
  }, [pathname, isLoginPage, router])

  // Login page renders without admin shell
  if (isLoginPage) return <>{children}</>

  if (checking) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!authenticated) return null

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-navy-900 text-white flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-navy-900" />
          </div>
          <div>
            <p className="font-bold text-sm">Traveloop</p>
            <p className="text-[10px] text-amber-400 font-semibold">ADMIN PANEL</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 mt-6 space-y-1">
          <p className="px-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">
            Management
          </p>
          {adminNav.map(item => {
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
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </Link>
            )
          })}
        </nav>

        {/* Logout + Back */}
        <div className="p-3 space-y-2 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-white/40 hover:text-white/70 rounded-lg hover:bg-white/5 transition-all"
          >
            <ChevronRight className="w-3 h-3 rotate-180" />
            Back to Traveloop
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-navy-900">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-semibold">
              ● Online
            </span>
            <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-500">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
