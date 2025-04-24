"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FolderPlus } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getProjects, debugSupabaseConfig } from "@/lib/data-service"
import type { Project } from "@/lib/supabase"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const config = debugSupabaseConfig()
        setDebugInfo(config)
        const data = await getProjects()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
        setError(error instanceof Error ? error.message : 'Failed to load projects')
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProjects = projects
    .filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  if (loading) {
    return (
      <main className="p-6 space-y-6">
        <Card>
          <CardContent className="py-20">
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (error) {
    return (
      <main className="p-6 space-y-6">
        <Card className="bg-red-50">
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Projects</h2>
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <div className="text-left bg-white p-4 rounded-md shadow-sm mx-auto max-w-lg">
                <h3 className="font-medium mb-2">Debug Information:</h3>
                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Make sure:</p>
                  <ul className="list-disc list-inside">
                    <li>Your .env.local file exists with the correct variables</li>
                    <li>The table name in Supabase is exactly &quot;Projects&quot; (with capital P)</li>
                    <li>You&apos;ve created the table in your Supabase project</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="p-6 space-y-6">
      <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
        <CardHeader>
          <CardTitle className="text-2xl">Projects</CardTitle>
          <CardDescription>
            Browse and manage your projects. Find the perfect consultants for each project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[300px]"
              />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <FolderPlus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  )
} 