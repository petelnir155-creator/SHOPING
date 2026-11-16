import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

/** False when .env.local is missing, so the UI can show a setup screen instead of crashing. */
export const isSupabaseConfigured = Boolean(url && key)

export const supabase = isSupabaseConfigured
  ? createClient(url, key, { realtime: { params: { eventsPerSecond: 10 } } })
  : null
