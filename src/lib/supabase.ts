import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our database tables
export interface Consultant {
  id: string
  created_at: string
  role: string
  seniority: string
  description: string
  certificates: string
  technologies: string[] | string
  languages_spc: string
}

interface Requirement {
  skill: string
  amount?: number
  recommendedSeniority?: string
}

export interface Project {
  id: string
  status: 'DRAFT' | 'SUBMITTED' | 'INTERNAL_REVIEW' | 'INTERNAL_APPROVED' | 'CUSTOMER_REVIEW' | 'CUSTOMER_APPROVED' | 'FINALIZING'
  start_date: string
  end_date: string | null
  name: string
  location: string
  requirements: Requirement[]
  budget: number
  created_at: string
  title: string
  client: string
  consultants_needed: number
  skills: string[]
}

export interface Match {
  project_id: string
  consultant_id: string
  score: number
  description: string
  created_at: string
  type: string
}

// Database response types
export type DbConsultant = Consultant
export type DbProject = Project
export type DbMatch = Match 