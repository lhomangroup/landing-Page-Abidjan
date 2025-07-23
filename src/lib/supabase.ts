import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Use valid placeholder values if environment variables are not properly configured
const defaultUrl = 'https://placeholder.supabase.co'
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'

const finalUrl = supabaseUrl && supabaseUrl !== 'https://your-project.supabase.co' ? supabaseUrl : defaultUrl
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