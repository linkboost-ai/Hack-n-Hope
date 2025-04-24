"use client"

import { useState, useEffect } from "react"
import { Project, Consultant, Match } from "@/lib/supabase"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

export default function MatchingDetailsPage({
  params,
}: {
  params: { projectId: string }
}) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedConsultants, setSelectedConsultants] = useState<Set<string>>(new Set())
  const [consultants, setConsultants] = useState<Record<string, Consultant>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjectAndMatches()
  }, [params.projectId])

  const loadProjectAndMatches = async () => {
    setLoading(true)
    try {
      // Load project details
      const { data: projectData } = await supabase
        .from("project")
        .select("*")
        .eq("id", params.projectId)
        .single()

      if (projectData) {
        setProject(projectData)
      }

      // Load matches
      const { data: matchesData } = await supabase
        .from("Matches")
        .select("*")
        .eq("project_id", params.projectId)
        .order("score", { ascending: false })

      if (matchesData) {
        setMatches(matchesData)

        // Load consultant details for all matches
        const consultantIds = new Set(matchesData.map(m => m.consultant_id))
        const { data: consultantsData } = await supabase
          .from("consultant")
          .select("*")
          .in("id", Array.from(consultantIds))

        if (consultantsData) {
          const consultantMap = consultantsData.reduce((acc, consultant) => {
            acc[consultant.id] = consultant
            return acc
          }, {} as Record<string, Consultant>)
          setConsultants(consultantMap)
        }
      }
    } catch (error) {
      console.error("Error loading project and matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConsultantSelect = (consultantId: string) => {
    const newSelected = new Set(selectedConsultants)
    if (newSelected.has(consultantId)) {
      newSelected.delete(consultantId)
    } else if (selectedConsultants.size < (project?.consultants_needed || 0)) {
      newSelected.add(consultantId)
    }
    setSelectedConsultants(newSelected)
  }

  const handleProceedToEmail = () => {
    // Navigate to email screen with selected consultants
    router.push(`/matching/${params.projectId}/email?consultants=${Array.from(selectedConsultants).join(",")}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">Select consultants for this project</p>
        </div>
        <Button
          onClick={handleProceedToEmail}
          disabled={selectedConsultants.size !== project.consultants_needed}
        >
          Proceed to Email ({selectedConsultants.size}/{project.consultants_needed})
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{project.client}</Badge>
            <Badge variant="outline">{project.location}</Badge>
            {project.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="text-sm">
            <div><span className="font-medium">Budget:</span> ${project.budget.toLocaleString()}</div>
            <div><span className="font-medium">Consultants needed:</span> {project.consultants_needed}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matching Consultants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Consultant</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead className="w-32">Match Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => {
                const consultant = consultants[match.consultant_id]
                if (!consultant) return null

                return (
                  <TableRow key={match.consultant_id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedConsultants.has(match.consultant_id)}
                        onCheckedChange={() => handleConsultantSelect(match.consultant_id)}
                        disabled={!selectedConsultants.has(match.consultant_id) && 
                          selectedConsultants.size >= (project?.consultants_needed || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{consultant.role}</div>
                        <div className="text-sm text-muted-foreground">{consultant.seniority}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(consultant.technologies) 
                          ? consultant.technologies.slice(0, 3).map((tech, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))
                          : consultant.technologies?.split(",").slice(0, 3).map((tech, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech.trim()}
                              </Badge>
                            ))}
                        {(Array.isArray(consultant.technologies) 
                          ? consultant.technologies.length > 3
                          : consultant.technologies?.split(",").length > 3) && (
                          <span className="text-xs text-muted-foreground">+more</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{match.score}%</span>
                        </div>
                        <Progress value={match.score} className="h-2" />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 