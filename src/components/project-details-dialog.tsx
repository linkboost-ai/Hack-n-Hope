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
import { Calendar, Clock, Users } from "lucide-react"
import type { Project } from "@/data/mock-data"

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
          <DialogDescription>Information about {project.title}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <Badge variant={project.priority === "High" ? "destructive" : "outline"}>{project.priority}</Badge>
            </div>
            <p className="text-muted-foreground">{project.client}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-1">
                {project.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Project Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Start Date: {project.startDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Duration: {project.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {project.consultantsNeeded} Consultant{project.consultantsNeeded > 1 ? "s" : ""} Needed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Budget</h3>
              <p>{project.budget}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Location</h3>
              <p>{project.location}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 