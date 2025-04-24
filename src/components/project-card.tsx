import { Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectDetailsDialog } from "@/components/project-details-dialog"
import type { Project } from "@/data/mock-data"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group bg-gradient-to-br from-purple-500/5 via-purple-600/5 to-indigo-500/5 group-hover:from-purple-500/10 group-hover:via-purple-600/10 group-hover:to-indigo-500/10">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {project.title}
          </h3>
          <Badge 
            variant={project.priority === "High" ? "destructive" : "outline"}
            className={project.priority === "High" ? "bg-gradient-to-r from-red-500 to-pink-500 border-none text-white" : ""}
          >
            {project.priority}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mt-1">{project.client}</p>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="text-xs bg-white/80 hover:bg-white transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Duration: {project.duration}</span>
          <Badge 
            variant="outline"
            className={
              project.status === "Not Started" 
                ? "text-amber-600 bg-amber-50 border-amber-200"
                : project.status === "In Progress"
                ? "text-blue-600 bg-blue-50 border-blue-200"
                : "text-green-600 bg-green-50 border-green-200"
            }
          >
            {project.status}
          </Badge>
        </div>

        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1 text-purple-500" />
          <span>
            {project.consultantsNeeded} consultant{project.consultantsNeeded > 1 ? "s" : ""} needed
          </span>
        </div>

        <div className="mt-4 flex justify-end">
          <ProjectDetailsDialog project={project} />
        </div>
      </CardContent>
    </Card>
  )
}