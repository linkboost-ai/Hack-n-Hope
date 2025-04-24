import type { Consultant, Project, Match } from './supabase'
import { supabase } from './supabase'

interface MatchScoreDetails {
  technologyMatch: number
  seniorityMatch: number
  languageMatch: number
  certificateMatch: number
  matchedTechnologies: string[]
  matchedRequirements: string[]
}

export async function calculateMatchScore(consultant: Consultant, project: Project): Promise<number> {
  // Calculate technology match
  const consultantTechs = new Set(
    Array.isArray(consultant.technologies)
      ? consultant.technologies.map(t => t.toLowerCase())
      : consultant.technologies?.split(',').map(t => t.trim().toLowerCase()) || []
  )
  const projectTechs = new Set(project.skills?.map(s => s.toLowerCase()) || [])
  
  const matchedTechs = [...consultantTechs].filter(tech => projectTechs.has(tech))
  const technologyMatch = projectTechs.size > 0 
    ? (matchedTechs.length / projectTechs.size) * 100 
    : 0

  // Calculate seniority match (simplified)
  const seniorityMatch = consultant.seniority?.toLowerCase() === project.requirements?.[0]?.recommendedSeniority?.toLowerCase() 
    ? 100 
    : 50

  // Calculate language match (simplified)
  const languageMatch = consultant.languages_spc ? 100 : 50 // Placeholder - implement actual language matching logic

  // Calculate certificate match (simplified)
  const certificateMatch = consultant.certificates ? 100 : 0

  // Calculate overall score with weighted components
  const overallScore = Math.round(
    (technologyMatch * 0.4) +
    (seniorityMatch * 0.3) +
    (languageMatch * 0.2) +
    (certificateMatch * 0.1)
  )

  return overallScore
}

export async function createMatch(projectId: string, consultantId: string, score: number): Promise<Match | null> {
  const matchDetails: MatchScoreDetails = {
    technologyMatch: 85, // These would be the actual calculated values
    seniorityMatch: 75,
    languageMatch: 90,
    certificateMatch: 70,
    matchedTechnologies: ["React", "TypeScript", "Node.js"], // These would be actual matched technologies
    matchedRequirements: ["Frontend Development", "Backend Development"] // These would be actual matched requirements
  }

  const { data: match, error } = await supabase
    .from("Matches")
    .insert({
      project_id: projectId,
      consultant_id: consultantId,
      score,
      description: JSON.stringify(matchDetails),
      type: "INTERNAL"
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating match:", error)
    return null
  }

  return match
}

export async function getMatchDetails(match: Match) {
  try {
    return {
      ...match,
      details: JSON.parse(match.description)
    }
  } catch (error) {
    console.error('Error parsing match details:', error)
    return match
  }
} 