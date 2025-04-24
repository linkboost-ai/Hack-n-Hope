"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FolderPlus } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { projects } from "@/data/mock-data"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("priority")

  const filteredProjects = projects
    .filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "client") return a.client.localeCompare(b.client)
      return 0
    })

  return (
    <main className="p-6 space-y-6">
      <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
        <CardHeader>
          <CardTitle className="text-2xl">Projects</CardTitle>
          <CardDescription>
            Browse and manage project listings. Find and track ongoing and upcoming projects.
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
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Sort by Priority</SelectItem>
                  <SelectItem value="title">Sort by Title</SelectItem>
                  <SelectItem value="client">Sort by Client</SelectItem>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  )
} 