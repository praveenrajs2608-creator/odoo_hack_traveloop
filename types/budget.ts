export type BudgetCategory =
  | 'transport'
  | 'stay'
  | 'activities'
  | 'meals'
  | 'shopping'
  | 'misc'

export interface BudgetItem {
  id: string
  trip_id: string
  category: BudgetCategory
  label: string
  amount: number
  currency: string
  date: string | null
  created_at: string
}

export interface CreateBudgetItemInput {
  trip_id: string
  category: BudgetCategory
  label: string
  amount: number
  currency?: string
  date?: string
}

export interface PackingItem {
  id: string
  trip_id: string
  name: string
  category: PackingCategory
  is_packed: boolean
  created_at: string
}

export type PackingCategory =
  | 'clothing'
  | 'documents'
  | 'electronics'
  | 'toiletries'
  | 'medicine'
  | 'misc'

export interface CreatePackingItemInput {
  trip_id: string
  name: string
  category: PackingCategory
}

export interface TripNote {
  id: string
  trip_id: string
  stop_id: string | null
  content: string
  day_number: number | null
  created_at: string
  updated_at: string
}

export interface CreateTripNoteInput {
  trip_id: string
  stop_id?: string
  content: string
  day_number?: number
}
