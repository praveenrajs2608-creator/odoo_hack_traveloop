import { Activity } from './activity'

export interface Stop {
  id: string
  trip_id: string
  city: string
  country: string
  latitude: number | null
  longitude: number | null
  start_date: string | null
  end_date: string | null
  order_index: number
  cost_index: number | null
  created_at: string
  // Relations (joined)
  activities?: Activity[]
}

export interface CreateStopInput {
  trip_id: string
  city: string
  country: string
  latitude?: number
  longitude?: number
  start_date?: string
  end_date?: string
  order_index: number
  cost_index?: number
}
