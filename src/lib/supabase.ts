import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Use placeholder values if environment variables are not properly configured
const defaultUrl = 'https://placeholder.supabase.co'
const defaultKey = 'placeholder_anon_key'

const finalUrl = supabaseUrl && supabaseUrl !== 'your_supabase_project_url' ? supabaseUrl : defaultUrl
const finalKey = supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key' ? supabaseAnonKey : defaultKey

export const supabase = createClient(finalUrl, finalKey)

// Types pour TypeScript
export interface Subscriber {
  id: string
  first_name: string
  last_name: string
  email: string
  gdpr_consent: boolean
  checklist_sent: boolean
  created_at: string
  updated_at: string
}