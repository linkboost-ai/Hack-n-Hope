"use client"

import { useState, useEffect } from "react"
import { Project, Consultant } from "@/lib/supabase"
import { getProjects, getConsultants } from "@/lib/data-service"
import { calculateMatchScore, createMatch } from "@/lib/matching-service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export function ProjectMatching() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [processingProjectId, setProcessingProjectId] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const projectsData = await getProjects()
      console.log("All projects:", projectsData)
      
      // Filter for submitted projects only
      const submittedProjects = projectsData.filter(p => p.status === "SUBMITTED")
      console.log("Submitted projects:", submittedProjects)
      
      setProjects(submittedProjects)
    } catch (error) {
      console.error("Error loading projects:", error)
    }
  }

  const performMatching = async (projectId: string) => {
    setProcessingProjectId(projectId)
    setIsLoading(true)
    try {
      const selectedProject = projects.find(p => p.id === projectId)
      if (!selectedProject) return

      // Load all consultants
      const consultants = await getConsultants()
      if (!consultants.length) return

      // Calculate and create matches for all consultants
      const matchPromises = consultants.map(async (consultant: Consultant) => {
        const score = await calculateMatchScore(consultant, selectedProject)
        return createMatch(selectedProject.id, consultant.id, score)
      })

      await Promise.all(matchPromises)

      // Navigate to the matching details page
      router.push(`/matching/${projectId}`)
    } catch (error) {
      console.error("Error performing matching:", error)
    } finally {
      setIsLoading(false)
      setProcessingProjectId(null)
    }
  }

  return (
    <div className="container space-y-6 py-6">
      <Card className="border-none shadow-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-8 w-8 text-purple-500" />
            <div>
              <CardTitle className="text-2xl">Project Matching</CardTitle>
              <CardDescription>Find the best consultants for submitted projects</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">No Projects to Match</h2>
            <p className="text-muted-foreground">There are currently no submitted projects waiting for matching.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.client}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{project.location}</Badge>
                  {project?.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <div><span className="font-medium">Budget:</span> ${project.budget.toLocaleString()}</div>
                  <div><span className="font-medium">Consultants needed:</span> {project.consultants_needed}</div>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <Button 
                  className="w-full"
                  onClick={() => performMatching(project.id)}
                  disabled={isLoading && processingProjectId === project.id}
                >
                  {isLoading && processingProjectId === project.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding Matches...
                    </>
                  ) : (
                    "Find Matches"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 