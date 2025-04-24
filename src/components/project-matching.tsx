"use client"

import { useState, useEffect } from "react"
import { Project, Consultant } from "@/lib/supabase"
import { getProjects, getConsultants } from "@/lib/data-service"
import { calculateMatchScore, createMatch } from "@/lib/matching-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function ProjectMatching() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const projectsData = await getProjects()
      console.log("All projects:", projectsData)
      
      // Filter for not started projects only
      const notStartedProjects = projectsData.filter(p => p.status === "Not Started")
      console.log("Not started projects:", notStartedProjects)
      
      setProjects(notStartedProjects)
    } catch (error) {
      console.error("Error loading projects:", error)
    }
  }

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId)
  }

  const performMatching = async () => {
    if (!selectedProjectId) return

    setIsLoading(true)
    try {
      const selectedProject = projects.find(p => p.id === selectedProjectId)
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
      router.push(`/matching/${selectedProjectId}`)
    } catch (error) {
      console.error("Error performing matching:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedProjectId} onValueChange={handleProjectSelect}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={performMatching} 
              disabled={!selectedProjectId || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Find Matches
            </Button>
          </div>

          {selectedProject && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Project Details</h3>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{selectedProject.client}</Badge>
                  <Badge variant="outline">{selectedProject.location}</Badge>
                  {selectedProject.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <div><span className="font-medium">Budget:</span> ${selectedProject.budget.toLocaleString()}</div>
                  <div><span className="font-medium">Consultants needed:</span> {selectedProject.consultants_needed}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 