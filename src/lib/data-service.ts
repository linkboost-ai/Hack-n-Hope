import { supabase } from './supabase'
import type { Consultant, Project, Match } from './supabase'

// Debug function to check Supabase configuration
export function debugSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('=== Supabase Debug Info ===')
  console.log('Supabase URL:', supabaseUrl)
  // Only show first and last 4 characters of the key for security
  console.log('Supabase Key:', supabaseKey ? `${supabaseKey.slice(0, 4)}...${supabaseKey.slice(-4)}` : 'not set')
  console.log('Supabase client initialized:', !!supabase)
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables!')
  }
  
  return {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    clientInitialized: !!supabase,
    url: supabaseUrl,
    keyPreview: supabaseKey ? `${supabaseKey.slice(0, 4)}...${supabaseKey.slice(-4)}` : 'not set'
  }
}

export async function getConsultants() {
  const config = debugSupabaseConfig()
  
  if (!supabase) {
    throw new Error(`Supabase client is not initialized. Debug info: ${JSON.stringify(config)}`)
  }

  console.log('Fetching consultants...')
  const { data, error } = await supabase
    .from('Consultants')  // Changed to match the actual table name
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      config
    })
    throw error
  }

  // Debug log the first consultant to check data structure
  if (data && data.length > 0) {
    console.log('First consultant data:', {
      id: data[0].id,
      role: data[0].role,
      technologies: data[0].technologies,
      seniority: data[0].seniority
    })
  } else {
    console.log('No consultants found in database')
  }
  
  return data as Consultant[]
}

export async function getProjects() {
  const config = debugSupabaseConfig()
  
  if (!supabase) {
    throw new Error(`Supabase client is not initialized. Debug info: ${JSON.stringify(config)}`)
  }

  console.log('Fetching projects...')
  const { data, error } = await supabase
    .from('Projects')  // Changed to match the actual table name
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      config
    })
    throw error
  }

  // Debug log the first project to check data structure
  if (data && data.length > 0) {
    console.log('First project data:', {
      id: data[0].id,
      name: data[0].name,
      status: data[0].status,
      skills: data[0].skills
    })
  } else {
    console.log('No projects found in database')
  }
  
  return data as Project[]
}

export async function getMatches() {
  const config = debugSupabaseConfig()
  
  if (!supabase) {
    throw new Error(`Supabase client is not initialized. Debug info: ${JSON.stringify(config)}`)
  }

  const { data, error } = await supabase
    .from('Matches')  // Changed from 'match' to 'matches'
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      config
    })
    throw error
  }
  
  return data as Match[]
}

export async function getMatchesByProject(projectId: string) {
  const config = debugSupabaseConfig()
  
  if (!supabase) {
    throw new Error(`Supabase client is not initialized. Debug info: ${JSON.stringify(config)}`)
  }

  const { data, error } = await supabase
    .from('Matches')  // Changed to match the actual table name
    .select('*')
    .eq('project_id', projectId)
    .order('score', { ascending: false })
  
  if (error) {
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      config
    })
    throw error
  }
  
  return data as Match[]
}

export async function getMatchesByConsultant(consultantId: string) {
  const config = debugSupabaseConfig()
  
  if (!supabase) {
    throw new Error(`Supabase client is not initialized. Debug info: ${JSON.stringify(config)}`)
  }

  const { data, error } = await supabase
    .from('Matches')  // Changed to match the actual table name
    .select('*')
    .eq('consultant_id', consultantId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      config
    })
    throw error
  }
  
  return data as Match[]
} 