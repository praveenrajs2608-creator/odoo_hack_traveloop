export interface User {
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string
  language_pref: string
  saved_destinations: string[] | null
  onesignal_player_id: string | null
  created_at: string
}
