import { Star, Languages, Award, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ConsultantDetailsDialog } from "@/components/consultant-details-dialog"
import { Progress } from "@/components/ui/progress"
import type { Consultant } from "@/lib/supabase"

interface ConsultantCardProps {
  consultant: Consultant
}

// Mock function to calculate level based on various factors
function calculateConsultantLevel(consultant: Consultant) {
  // Mock calculation based on technologies and time since creation
  const getTechnologiesCount = (tech: string | string[] | null | undefined): number => {
    if (!tech) return 1
    if (Array.isArray(tech)) return tech.filter(Boolean).length || 1
    return tech.split(',').map(t => t.trim()).filter(Boolean).length || 1
  }

  const technologiesCount = getTechnologiesCount(consultant.technologies)
  const creationDate = new Date(consultant.created_at)
  const monthsSinceCreation = Math.floor((Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
  const experienceBonus = Math.floor(monthsSinceCreation / 6) // Level up every 6 months
  
  return Math.min(technologiesCount + experienceBonus, 10) // Cap at level 10
}

// Mock function to calculate experience percentage to next level
function calculateExperienceProgress(consultant: Consultant) {
  const creationDate = new Date(consultant.created_at)
  const monthsSinceCreation = Math.floor((Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
  return (monthsSinceCreation % 6) * 16.67 // 100% / 6 months ≈ 16.67% per month
}

export function ConsultantCard({ consultant }: ConsultantCardProps) {
  // Debug log the incoming consultant data
  console.log('Rendering consultant card:', {
    id: consultant.id,
    role: consultant.role,
    technologies: consultant.technologies,
    seniority: consultant.seniority
  })

  // Base data with fallbacks
  const roleInitial = consultant.role?.charAt(0) ?? '?'
  const displayRole = consultant.role || 'Unknown Role'
  const seniority = consultant.seniority || 'No Seniority'
  const certificates = consultant.certificates || 'No Certificates'

  // Handle both string and array types for technologies and languages
  const parseTechnologies = (tech: string | string[] | null | undefined): string[] => {
    if (!tech) return []
    if (Array.isArray(tech)) return tech.filter(Boolean)
    return tech.split(',').map(t => t.trim()).filter(Boolean)
  }

  const technologies = parseTechnologies(consultant.technologies)
  const languages = parseTechnologies(consultant.languages_spc)

  // Debug log the processed data
  console.log('Processed consultant data:', {
    displayRole,
    technologies,
    languages
  })

  // Calculate mock level data
  const level = calculateConsultantLevel(consultant)
  const experienceProgress = calculateExperienceProgress(consultant)

  // Determine experience tier based on seniority with type safety
  const experienceTier = (consultant.seniority || 'Junior') as 'Junior' | 'Mid-Level' | 'Senior' | 'Expert'
  const tierColors = {
    'Junior': 'text-blue-600 bg-blue-50 border-blue-200',
    'Mid-Level': 'text-purple-600 bg-purple-50 border-purple-200',
    'Senior': 'text-amber-600 bg-amber-50 border-amber-200',
    'Expert': 'text-rose-600 bg-rose-50 border-rose-200'
  } as const

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="ring-2 ring-purple-500/20 ring-offset-2">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                {roleInitial}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{displayRole}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={tierColors[experienceTier] || tierColors['Junior']}>
                  {experienceTier}
                </Badge>
                <span className="text-sm text-muted-foreground">Level {level}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <Progress value={experienceProgress} className="h-1" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-muted-foreground">{seniority}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-indigo-500" />
            <span className="text-sm text-muted-foreground">{certificates}</span>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">{languages.join(', ')}</span>
          </div>
        </div>

        {technologies.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {technologies.slice(0, 3).map((tech, index) => (
                <Badge key={`${tech}-${index}`} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {technologies.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{technologies.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-1">
            {[...Array(Math.min(5, Math.ceil(level/2)))].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <ConsultantDetailsDialog consultant={consultant} />
        </div>
      </CardContent>
    </Card>
  )
}