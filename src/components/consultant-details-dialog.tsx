import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Star, Briefcase, Award } from "lucide-react"
import type { Consultant } from "@/data/mock-data"

interface ConsultantDetailsDialogProps {
  consultant: Consultant
}

export function ConsultantDetailsDialog({ consultant }: ConsultantDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Consultant Profile</DialogTitle>
          <DialogDescription>Detailed information about {consultant.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={consultant.avatar} alt={consultant.name} />
              <AvatarFallback>{consultant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{consultant.name}</h2>
              <p className="text-muted-foreground">{consultant.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={
                    consultant.availability.includes("Available")
                      ? "text-green-600 bg-green-50"
                      : "text-amber-600 bg-amber-50"
                  }
                >
                  {consultant.availability}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">{consultant.score} Score</Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">About</h3>
            <p className="text-sm text-muted-foreground">{consultant.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-1">
                {consultant.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Experience</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{consultant.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>{consultant.completedProjects} Completed Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{consultant.rating} Average Rating</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Performance Metrics</h3>
            <div className="space-y-3">
              {Object.entries(consultant.metrics).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</span>
                    <span>{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Recent Projects</h3>
            <div className="space-y-2">
              {consultant.recentProjects.map((project, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-muted-foreground">Client: {project.client}</div>
                  <div className="text-sm text-muted-foreground">Duration: {project.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 