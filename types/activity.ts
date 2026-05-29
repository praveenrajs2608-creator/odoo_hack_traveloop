export type ActivityType =
  | 'sightseeing'
  | 'food'
  | 'adventure'
  | 'shopping'
  | 'culture'
  | 'nightlife'
  | 'transport'
  | 'stay'

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export interface Activity {
  id: string
  stop_id: string
  name: string
  description: string | null
  type: ActivityType
  estimated_cost: number
  duration_hours: number | null
  time_of_day: TimeOfDay | null
  image_url: string | null
  day_number: number | null
  is_ai_suggested: boolean
  created_at: string
}

export interface CreateActivityInput {
  stop_id: string
  name: string
  description?: string
  type: ActivityType
  estimated_cost?: number
  duration_hours?: number
  time_of_day?: TimeOfDay
  day_number?: number
  is_ai_suggested?: boolean
}

export type BudgetLevel = 'budget' | 'moderate' | 'premium' | 'luxury'
export type SeasonTag = 'summer' | 'monsoon' | 'winter' | 'spring'
export type GroupTag = 'solo' | 'couple' | 'friends' | 'family'

export interface City {
  id: string
  name: string
  country: string
  region: string | null
  latitude: number | null
  longitude: number | null
  cost_index: number | null
  popularity_score: number
  image_url: string | null
  tags: string[] | null
  budget_level: BudgetLevel | null
  best_season: SeasonTag[] | null
  group_suitability: GroupTag[] | null
  estimated_cost_inr: string | null
  match_score?: number
}
