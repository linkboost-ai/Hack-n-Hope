import { Star, Briefcase, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ConsultantDetailsDialog } from "@/components/consultant-details-dialog"
import type { Consultant } from "@/data/mock-data"

interface ConsultantCardProps {
  consultant: Consultant
}

export function ConsultantCard({ consultant }: ConsultantCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="ring-2 ring-purple-500/20 ring-offset-2">
              <AvatarImage src={consultant.avatar} alt={consultant.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                {consultant.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{consultant.name}</h3>
              <p className="text-sm text-muted-foreground">{consultant.role}</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none hover:from-purple-600 hover:to-indigo-600">
            {consultant.score}
          </Badge>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium">{consultant.rating} Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium">{consultant.experience}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-medium">{consultant.completedProjects} Projects</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {consultant.skills.map((skill) => (
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

        <div className="mt-6 flex justify-between items-center">
          <Badge
            variant="outline"
            className={
              consultant.availability.includes("Available")
                ? "text-green-600 bg-green-50 border-green-200"
                : "text-amber-600 bg-amber-50 border-amber-200"
            }
          >
            {consultant.availability}
          </Badge>
          <ConsultantDetailsDialog consultant={consultant} />
        </div>
      </CardContent>
    </Card>
  )
}