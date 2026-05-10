import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays, isAfter, isBefore, isToday } from 'date-fns'
import type { TripStatus } from '@/types/trip'
import type { Trip } from '@/types/trip'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const startMonth = format(startDate, 'MMM d')
  const endMonth = format(endDate, 'MMM d, yyyy')
  return `${startMonth} — ${endMonth}`
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getTripStatus(trip: Trip): TripStatus {
  const now = new Date()
  const start = new Date(trip.start_date)
  const end = new Date(trip.end_date)

  if (!trip.name) return 'draft'
  if (isAfter(now, end)) return 'completed'
  if (isBefore(now, start)) return 'upcoming'
  return 'ongoing'
}

export function getDaysUntilTrip(startDate: string): number {
  return differenceInDays(new Date(startDate), new Date())
}

export function getTripDuration(start: string, end: string): number {
  return differenceInDays(new Date(end), new Date(start)) + 1
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Shared animation variants for Framer Motion
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20 },
}

export const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  hover: { y: -4 },
}

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08 },
  },
}

export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}
