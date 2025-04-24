import { ProjectMatching } from "@/components/project-matching"

export default function MatchingPage() {
    return (
    <div className="container py-8 space-y-8">
                      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Matching</h1>
        <p className="text-muted-foreground">
          Select a project to find matching consultants based on skills, experience, and requirements.
        </p>
      </div>
      <ProjectMatching />
        </div>
  )
} 