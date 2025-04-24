import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Coins } from "lucide-react"
import type { Project } from "@/lib/supabase"

interface ProjectDetailsDialogProps {
  project: Project
}

export function ProjectDetailsDialog({ project }: ProjectDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
          <DialogDescription>Information about {project.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">{project.name}</h2>
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
            <p className="text-muted-foreground">Created: {new Date(project.created_at).toLocaleDateString()}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">Project Information</h3>
            <div className="grid gap-4">
              <div>
                <div className="text-sm font-medium">Client</div>
                <div className="text-sm text-muted-foreground">{project.client}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Title</div>
                <div className="text-sm text-muted-foreground">{project.title}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Consultants Needed</div>
                <div className="text-sm text-muted-foreground">{project.consultants_needed}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-1">
              {project.skills?.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Requirements</h3>
            <div className="flex flex-wrap gap-1">
              {project.requirements.map((req, index) => (
                <Badge 
                  key={`${req.skill}-${index}`}
                  variant="secondary"
                  className="flex items-center gap-1"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Project Timeline</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Start Date</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(project.start_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">End Date</div>
                    <div className="text-sm text-muted-foreground">
                      {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Project Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">{project.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-cyan-500" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Budget</div>
                    <div className="text-sm text-muted-foreground">
                      ${project.budget.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 