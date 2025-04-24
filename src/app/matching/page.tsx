"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { consultants, projects } from "@/data/mock-data"
import { Star, Users, Briefcase, Calendar, Clock, Mail, CheckCircle2, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { cn } from "@/lib/utils"

type MatchingStep = "selecting" | "emailing_consultants" | "waiting_acceptance" | "emailing_client" | "completed"

export default function MatchingPage() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [assignedConsultants, setAssignedConsultants] = useState<Set<string>>(new Set())
  const [step, setStep] = useState<MatchingStep>("selecting")
  const [consultantResponses, setConsultantResponses] = useState<Set<string>>(new Set())

  // Get available projects that haven't started
  const availableProjects = projects.filter(project => project.status === "Not Started")

  // Calculate consultant matches for selected project
  const consultantMatches = selectedProject
    ? consultants
        .filter(consultant => consultant.availability.includes("Available"))
        .map(consultant => {
          // Calculate match score based on skills overlap
          const consultantSkills = new Set(consultant.skills)
          const matchingSkills = selectedProject.skills.filter(skill => consultantSkills.has(skill))
          const skillScore = Number(matchingSkills.length) / Number(selectedProject.skills.length)

          // Factor in consultant's rating and experience
          const experienceScore = Math.min(Number(consultant.experience) / 10, 1)
          const ratingScore = Number(consultant.rating) / 5

          // Weighted average of scores
          const totalScore = (skillScore * 0.5 + experienceScore * 0.3 + ratingScore * 0.2) * 100

          return {
            consultant,
            score: Math.round(totalScore)
          }
        })
        .filter(match => match.score > 50) // Only keep good matches
        .sort((a, b) => b.score - a.score) // Sort by score descending
    : []

  const handleAssign = (consultantId: string) => {
    setAssignedConsultants(prev => {
      const newAssigned = new Set(prev)
      if (newAssigned.has(consultantId)) {
        newAssigned.delete(consultantId)
      } else {
        // Check if we've reached the limit
        if (newAssigned.size < (selectedProject?.consultantsNeeded || 0)) {
          newAssigned.add(consultantId)
        }
      }
      return newAssigned
    })
  }

  const handleSendConsultantEmails = () => {
    // Mock sending emails to consultants
    console.log('Sending emails to consultants:', Array.from(assignedConsultants))
    setStep("waiting_acceptance")
    // Mock some consultant responses after a delay
    setTimeout(() => {
      const responses = new Set(assignedConsultants)
      setConsultantResponses(responses)
      setStep("emailing_client")
    }, 2000)
  }

  const handleSendClientEmail = () => {
    // Mock sending email to client
    console.log('Sending email to client:', selectedProject?.client)
    setStep("completed")
  }

  const getStepContent = () => {
    if (!selectedProject) return null

    const progressSteps = [
      { label: "Select Consultants", step: "selecting" },
      { label: "Send Consultant Emails", step: "emailing_consultants" },
      { label: "Await Responses", step: "waiting_acceptance" },
      { label: "Confirm with Client", step: "emailing_client" },
      { label: "Completed", step: "completed" }
    ]

    const currentStepIndex = progressSteps.findIndex(s => s.step === step)

    return (
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="w-full bg-background rounded-lg p-4 border">
          <div className="space-y-4">
            <div className="flex justify-between relative">
              {progressSteps.map((s, index) => (
                <div 
                  key={s.step} 
                  className={cn(
                    "flex flex-col items-center relative z-10",
                    index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-2",
                    index <= currentStepIndex ? 'bg-primary text-primary-foreground' : 'bg-muted border-2'
                  )}>
                    {index < currentStepIndex ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-center whitespace-nowrap">{s.label}</span>
                </div>
              ))}
              {/* Progress line */}
              <div className="absolute top-4 left-0 w-full h-[2px] bg-muted -z-0">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${(currentStepIndex / (progressSteps.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Progress */}
        <div className="bg-background rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">
                Consultant Assignment Progress
              </span>
            </div>
            <Badge 
              variant={assignedConsultants.size === selectedProject.consultantsNeeded ? "default" : "secondary"}
              className="px-3 py-1"
            >
              {assignedConsultants.size} / {selectedProject.consultantsNeeded} Selected
            </Badge>
          </div>
          <div className="relative">
            <Progress 
              value={(assignedConsultants.size / selectedProject.consultantsNeeded) * 100}
              className="h-3"
            />
            {assignedConsultants.size === selectedProject.consultantsNeeded && (
              <CheckCircle2 className="absolute right-0 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
            )}
          </div>
        </div>

        {/* Consultant Selection */}
        {step === "selecting" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-muted-foreground">
                Select up to {selectedProject.consultantsNeeded} consultant{selectedProject.consultantsNeeded !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-muted-foreground">
                {consultantMatches.length} matches found
              </p>
            </div>

            <div className="grid gap-3">
              {consultantMatches.map(({ consultant, score }) => (
                <div 
                  key={consultant.id}
                  className={cn(
                    "p-4 rounded-lg border transition-colors",
                    assignedConsultants.has(consultant.id) && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={consultant.avatar} />
                        <AvatarFallback>{consultant.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{consultant.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{consultant.role}</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{consultant.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={score} 
                          className={cn(
                            "w-24 h-2",
                            score >= 80 ? "bg-green-100" : "bg-yellow-100",
                            score >= 80 ? "[&>div]:bg-green-600" : "[&>div]:bg-yellow-600"
                          )}
                        />
                        <span className={cn(
                          "text-sm font-medium",
                          score >= 80 ? "text-green-600" : "text-yellow-600"
                        )}>
                          {score}%
                        </span>
                      </div>
                      <Button 
                        size="sm"
                        variant={assignedConsultants.has(consultant.id) ? "outline" : "default"}
                        onClick={() => handleAssign(consultant.id)}
                        disabled={!assignedConsultants.has(consultant.id) && 
                          assignedConsultants.size >= (selectedProject?.consultantsNeeded || 0)}
                        className={cn(
                          "min-w-[100px]",
                          assignedConsultants.has(consultant.id) && "border-primary text-primary hover:bg-primary/10"
                        )}
                      >
                        {assignedConsultants.has(consultant.id) ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Assigned
                          </>
                        ) : (
                          "Assign"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {consultantMatches.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 border rounded-lg">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No Matching Consultants</p>
                  <p className="text-sm text-muted-foreground">
                    There are no available consultants that match the project requirements.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          {step === "selecting" && assignedConsultants.size === selectedProject.consultantsNeeded && (
            <Button 
              onClick={() => setStep("emailing_consultants")}
              className="gap-2"
            >
              <Mail className="w-4 h-4" />
              Continue to Emails
            </Button>
          )}
          {step === "emailing_consultants" && (
            <Button 
              onClick={handleSendConsultantEmails}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Send Emails to Consultants
            </Button>
          )}
          {step === "waiting_acceptance" && (
            <Button disabled className="gap-2">
              <span className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
              <span>Waiting for Responses...</span>
            </Button>
          )}
          {step === "emailing_client" && (
            <Button 
              onClick={handleSendClientEmail}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Send Confirmation to Client
            </Button>
          )}
          {step === "completed" && (
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Project Assignment Completed</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <main className="p-6 space-y-6">
      <Card className="border-none bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <CardHeader>
          <div className="flex flex-col space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">Project Matching</CardTitle>
            <p className="text-muted-foreground text-sm">
              Select a project to find matching consultants
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {!selectedProject ? (
          // Project Selection View
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableProjects.map(project => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => {
                  setSelectedProject(project)
                  setAssignedConsultants(new Set())
                  setStep("selecting")
                }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">{project.title}</CardTitle>
                    <Badge variant={project.priority === "High" ? "destructive" : "outline"}>
                      {project.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map(skill => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{project.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{project.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Consultant Matches View
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-medium">{selectedProject.title}</CardTitle>
                  <p className="text-muted-foreground">{selectedProject.client}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedProject(null)
                    setAssignedConsultants(new Set())
                    setStep("selecting")
                  }}
                >
                  Change Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {selectedProject.skills.map(skill => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm">{selectedProject.description}</p>
                {getStepContent()}
              </div>
            </CardContent>
          </Card>
        )}

        {availableProjects.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No Available Projects</p>
              <p className="text-sm text-muted-foreground">
                There are no projects available for matching at the moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
} 