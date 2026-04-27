import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mlzvjbjqxbhvweidaodr.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1senZqYmpxeGJodndlaWRhb2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjQwMTQsImV4cCI6MjA5MjgwMDAxNH0.cz3jlUduRZPZhSChut6l0YGYMW0nYnq_bFzA0Dmjdos'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on our schema
export interface Project {
  id: string
  project_code: string
  name: string
  description: string | null
  password: string | null
  created_at: string
  updated_at: string
}

export interface Block {
  id: string
  project_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Floor {
  id: string
  block_id: string
  floor_number: number
  floor_name: string | null
  notes: string | null
  concrete_date: string | null
  concrete_review: string | null
  gro_oeuvre_progress: number
  cet_progress: number
  ces_progress: number
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  project_id: string
  type: string
  title: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Issue {
  id: string
  project_id: string
  title: string
  description: string | null
  type: string
  severity: string
  status: string
  floor: string | null
  created_at: string
  resolved_at: string | null
  updated_at: string
}

export interface AppSettings {
  id: string
  language: string
  theme: string
  notifications: boolean
  created_at: string
  updated_at: string
}
