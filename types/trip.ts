import { Stop } from './stop'
import { BudgetItem } from './budget'

export interface Trip {
  id: string
  user_id: string
  name: string
  description: string | null
  start_date: string
  end_date: string
  cover_photo_url: string | null
  is_public: boolean
  share_token: string
  total_budget: number
  created_at: string
  updated_at: string
  // Relations (joined)
  stops?: Stop[]
  budget_items?: BudgetItem[]
}

export interface CreateTripInput {
  name: string
  description?: string
  start_date: string
  end_date: string
  cover_photo_url?: string
  total_budget?: number
}

export type TripStatus = 'upcoming' | 'ongoing' | 'completed' | 'draft'
