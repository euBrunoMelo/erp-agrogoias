import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types para o banco de dados
export type User = {
  id: string
  email: string
  name: string
  role: 'PRODUCER' | 'TECHNICIAN' | 'COOPERATIVE' | 'ADMIN'
  created_at: string
}

export type Property = {
  id: string
  user_id: string
  name: string
  location: string
  total_area: number
  coordinates: any
  created_at: string
}

export type Plot = {
  id: string
  property_id: string
  name: string
  area: number
  soil_type: string
  coordinates: any
  created_at: string
}

