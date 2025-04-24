import { Calendar, MapPin, Coins } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectDetailsDialog } from "@/components/project-details-dialog"
import type { Project } from "@/lib/supabase"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group bg-gradient-to-br from-purple-500/5 via-purple-600/5 to-indigo-500/5 group-hover:from-purple-500/10 group-hover:via-purple-600/10 group-hover:to-indigo-500/10">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {project.name}
          </h3>
          <Badge 
            variant="outline"
            className={
              project.status === "DRAFT" 
                ? "text-slate-600 bg-slate-50 border-slate-200"
                : project.status === "SUBMITTED"
                ? "text-purple-600 bg-purple-50 border-purple-200"
                : project.status === "INTERNAL_REVIEW"
                ? "text-amber-600 bg-amber-50 border-amber-200"
                : project.status === "INTERNAL_APPROVED"
                ? "text-green-600 bg-green-50 border-green-200"
                : project.status === "CUSTOMER_REVIEW"
                ? "text-blue-600 bg-blue-50 border-blue-200"
                : project.status === "CUSTOMER_APPROVED"
                ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                : project.status === "FINALIZING"
                ? "text-indigo-600 bg-indigo-50 border-indigo-200"
                : "text-gray-600 bg-gray-50 border-gray-200"
            }
          >
            {project.status}
          </Badge>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {project.requirements.map((req, index) => (
              <Badge 
                key={`${req.skill}-${index}`}
                variant="secondary" 
                className="text-xs bg-white/50 flex items-center gap-1"
              >
                <span>{req.skill}</span>
                {req.amount && (
                  <span className="text-muted-foreground">
                    ({req.amount})
                  </span>
                )}
                {req.recommendedSeniority && (
                  <span className="text-xs text-muted-foreground ml-1">
                    • {req.recommendedSeniority}
                  </span>
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-muted-foreground">
              {new Date(project.start_date).toLocaleDateString()} - {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-500" />
            <span className="text-sm text-muted-foreground">{project.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Budget: ${project.budget.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <ProjectDetailsDialog project={project} />
        </div>
      </CardContent>
    </Card>
  )
}