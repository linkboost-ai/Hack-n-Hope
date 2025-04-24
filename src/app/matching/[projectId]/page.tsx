"use client"

import { useState, useEffect } from "react"
import { Project, Consultant, Match } from "@/lib/supabase"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Users, Mail, CheckCircle2, Clock, CalendarDays, X, FileText } from "lucide-react"
import { Stepper } from "@/components/ui/stepper"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

interface ConsultantResponses {
  pending: string[]
  approved: string[]
  rejected: string[]
}

interface CustomerResponse {
  status: 'pending' | 'approved' | 'rejected'
}

interface Step {
  title: string
  description: string
  status: "complete" | "current" | "upcoming"
}

export default function MatchingDetailsPage({
  params,
}: {
  params: { projectId: string }
}) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedConsultants, setSelectedConsultants] = useState<Set<string>>(new Set())
  const [consultants, setConsultants] = useState<Record<string, Consultant>>({})
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [consultantResponses, setConsultantResponses] = useState<ConsultantResponses>({
    pending: [],
    approved: [],
    rejected: []
  })
  const [customerResponse, setCustomerResponse] = useState<CustomerResponse>({ status: "pending" })
  const [customerMessage, setCustomerMessage] = useState(
    `Dear Customer,

I am pleased to present you with our selected consultants for your project. Based on our thorough matching process, these professionals have been carefully chosen to meet your project requirements.

Please review their profiles attached and let me know if you have any questions.

Best regards,
Your Account Manager`
  )

  const steps: Step[] = [
    {
      title: "Select Consultants",
      description: "Choose the required number of consultants for the project",
      status: currentStep === 0 ? "current" : currentStep > 0 ? "complete" : "upcoming"
    },
    {
      title: "Contact Consultants",
      description: "Send invitations to selected consultants",
      status: currentStep === 1 ? "current" : currentStep > 1 ? "complete" : "upcoming"
    },
    {
      title: "Await Responses",
      description: "Waiting for consultant responses",
      status: currentStep === 2 ? "current" : currentStep > 2 ? "complete" : "upcoming"
    },
    {
      title: "Customer Approval",
      description: "Waiting for customer approval",
      status: currentStep === 3 ? "current" : currentStep > 3 ? "complete" : "upcoming"
    },
    {
      title: "Completed",
      description: "Matching process completed",
      status: currentStep === 4 ? "current" : "upcoming"
    }
  ]

  useEffect(() => {
    loadProjectAndMatches()
  }, [params?.projectId])

  const handleSendInvitations = async () => {
    setIsProcessing(true)
    // Set selected consultants as pending
    setConsultantResponses({
      pending: Array.from(selectedConsultants),
      approved: [],
      rejected: []
    })
    await new Promise(resolve => setTimeout(resolve, 2000))
    setCurrentStep(2)
    setIsProcessing(false)
  }

  const handleSendCustomerApproval = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setCustomerResponse({ status: "approved" })
    setIsProcessing(false)
  }

  const simulateConsultantApprovals = async () => {
    // Simulate consultants approving over time
    const consultants = Array.from(selectedConsultants)
    for (let i = 0; i < consultants.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setConsultantResponses(prev => ({
        pending: prev.pending.filter(id => id !== consultants[i]),
        approved: [...prev.approved, consultants[i]],
        rejected: prev.rejected
      }))
    }
    setCurrentStep(3)
  }

  useEffect(() => {
    if (currentStep === 2 && consultantResponses.pending.length > 0) {
      simulateConsultantApprovals()
    }
  }, [currentStep, consultantResponses.pending])

  const loadProjectAndMatches = async () => {
    setLoading(true)
    try {
      // Load project details
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", params.projectId)
        .single()

      if (projectError) {
        // Silently handle error for demo
        setProject({
          id: "demo-1",
          name: "Demo Project",
          client: "Demo Client",
          location: "Remote",
          budget: 150000,
          consultants_needed: 2,
          skills: ["React", "Node.js", "TypeScript"],
          status: "SUBMITTED",
          start_date: new Date().toISOString(),
          end_date: null,
          created_at: new Date().toISOString(),
          requirements: [],
          title: "Demo Project"
        } as unknown as Project)
        return
      }

      if (project) {
        setProject(project)
      }

      // Load matches
      const { data: matches, error: matchesError } = await supabase
        .from("matches")
        .select("*")
        .eq("project_id", params?.projectId)
        .order("score", { ascending: false })

      if (matchesError) {
        // Silently handle error for demo
        const demoMatches = [
          {
            project_id: "demo-1",
            consultant_id: "consultant-1",
            score: 95,
            created_at: new Date().toISOString(),
            description: "Great match",
            type: "auto"
          },
          {
            project_id: "demo-1",
            consultant_id: "consultant-2",
            score: 90,
            created_at: new Date().toISOString(),
            description: "Good match",
            type: "auto"
          },
          {
            project_id: "demo-1",
            consultant_id: "consultant-3",
            score: 85,
            created_at: new Date().toISOString(),
            description: "Good match",
            type: "auto"
          },
          {
            project_id: "demo-1",
            consultant_id: "consultant-4",
            score: 80,
            created_at: new Date().toISOString(),
            description: "Decent match",
            type: "auto"
          },
          {
            project_id: "demo-1",
            consultant_id: "consultant-5",
            score: 75,
            created_at: new Date().toISOString(),
            description: "Potential match",
            type: "auto"
          }
        ] as unknown as Match[]
        
        setMatches(demoMatches)
        
        const demoConsultants = {
          "consultant-1": {
            id: "consultant-1",
            role: "Senior Frontend Developer",
            seniority: "Senior",
            technologies: ["React", "TypeScript", "Next.js", "TailwindCSS"],
            created_at: new Date().toISOString(),
            description: "Experienced frontend developer",
            certificates: "AWS Certified",
            languages_spc: "English, German"
          },
          "consultant-2": {
            id: "consultant-2",
            role: "Backend Developer",
            seniority: "Mid-Level",
            technologies: ["Node.js", "Python", "PostgreSQL", "AWS"],
            created_at: new Date().toISOString(),
            description: "Backend specialist",
            certificates: "AWS Solutions Architect",
            languages_spc: "English"
          },
          "consultant-3": {
            id: "consultant-3",
            role: "Full Stack Developer",
            seniority: "Senior",
            technologies: ["React", "Node.js", "MongoDB", "Docker"],
            created_at: new Date().toISOString(),
            description: "Full stack expert",
            certificates: "MongoDB Certified",
            languages_spc: "English, Spanish"
          },
          "consultant-4": {
            id: "consultant-4",
            role: "DevOps Engineer",
            seniority: "Senior",
            technologies: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
            created_at: new Date().toISOString(),
            description: "DevOps specialist",
            certificates: "Kubernetes Administrator",
            languages_spc: "English"
          },
          "consultant-5": {
            id: "consultant-5",
            role: "Mobile Developer",
            seniority: "Mid-Level",
            technologies: ["React Native", "TypeScript", "iOS", "Android"],
            created_at: new Date().toISOString(),
            description: "Mobile development expert",
            certificates: "Apple Developer",
            languages_spc: "English, French"
          }
        } as Record<string, Consultant>
        
        setConsultants(demoConsultants)
        return
      }

      if (matches) {
        setMatches(matches)

        // Load consultant details for all matches
        const consultantIds = new Set(matches?.map(m => m.consultant_id))
        const { data: consultants } = await supabase
          .from("consultants")
          .select("*")
          .in("id", Array.from(consultantIds))

        if (consultants) {
          const consultantMap = consultants.reduce((acc, consultant) => {
            acc[consultant.id] = consultant
            return acc
          }, {} as Record<string, Consultant>)
          setConsultants(consultantMap)
        }
      }
    } catch (error) {
      // Silently handle error for demo
    } finally {
      setLoading(false)
    }
  }

  const handleConsultantSelect = (consultantId: string) => {
    const newSelected = new Set(selectedConsultants)
    if (newSelected.has(consultantId)) {
      newSelected.delete(consultantId)
    } else if (selectedConsultants.size < 2) {
      newSelected.add(consultantId)
    }
    setSelectedConsultants(newSelected)
  }

  const handleProceedToEmail = () => {
    setCurrentStep(1)
  }

  const handleFinish = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setCurrentStep(4)
    setIsProcessing(false)
  }

  const handleClose = () => {
    router.push('/projects')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!project) {
    return <div>Project not found</div>
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            

            <Card>
              <CardHeader>
                <CardTitle>Matching Consultants</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Consultant</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead className="w-32">Match Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matches
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 5)
                      .map((match) => {
                        const consultant = consultants[match.consultant_id]
                        if (!consultant) return null

                        return (
                          <TableRow 
                            key={match.consultant_id} 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleConsultantSelect(match.consultant_id)}
                          >
                            <TableCell className="w-[52px]">
                              <div 
                                className="flex h-full items-center justify-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Checkbox
                                  checked={selectedConsultants.has(match.consultant_id)}
                                  onCheckedChange={() => handleConsultantSelect(match.consultant_id)}
                                  disabled={!selectedConsultants.has(match.consultant_id) && 
                                    selectedConsultants.size >= 2}
                                  className="border-2"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{consultant.role}</div>
                                <div className="text-sm text-muted-foreground">{consultant.seniority}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {typeof consultant.technologies === 'string' 
                                  ? consultant.technologies.split(",").slice(0, 3).map((tech: string, i: number) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {tech.trim()}
                                      </Badge>
                                    ))
                                  : Array.isArray(consultant.technologies) 
                                    ? consultant.technologies.slice(0, 3).map((tech: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                          {tech}
                                        </Badge>
                                      ))
                                    : null}
                                {(typeof consultant.technologies === 'string'
                                  ? consultant.technologies.split(",").length > 3
                                  : Array.isArray(consultant.technologies)
                                    ? consultant.technologies.length > 3
                                    : false) && (
                                  <span className="text-xs text-muted-foreground">+more</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{match.score}%</span>
                                </div>
                                <Progress value={match.score} className="h-2" />
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  Showing top 5 matching consultants
                </div>
              </CardContent>
            </Card>
          </>
        )
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Contact Selected Consultants</CardTitle>
              <CardDescription>Choose how to reach out to the selected consultants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="h-32 flex flex-col items-center justify-center gap-2"
                  variant={isProcessing ? "outline" : "default"}
                  onClick={() => !isProcessing && handleSendInvitations()}
                  disabled={isProcessing}
                >
                  <Mail className="h-8 w-8" />
                  <span>Send Email Invitations</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center gap-2"
                  onClick={() => !isProcessing && handleSendInvitations()}
                  disabled={isProcessing}
                >
                  <CalendarDays className="h-8 w-8" />
                  <span>Schedule Meetings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Awaiting Consultant Responses</CardTitle>
              <CardDescription>Consultants are reviewing the invitation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-8">
                <Clock className="h-16 w-16 text-purple-500 animate-pulse" />
              </div>
              <Alert>
                <AlertTitle>Status</AlertTitle>
                <AlertDescription className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Pending responses:</span>
                    <Badge variant="outline">{consultantResponses.pending.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Approved:</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {consultantResponses.approved.length}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Customer Review</CardTitle>
              <CardDescription>Send the selected consultants to the customer for review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {customerResponse.status === "pending" ? (
                <>
                  <div className="space-y-6">
                    <Alert>
                      <AlertTitle>Ready to Send</AlertTitle>
                      <AlertDescription>
                        All consultants have approved. You can now send the selection to the customer for review.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Selected Consultant Profiles</h3>
                        <div className="space-y-2">
                          {Array.from(selectedConsultants).map((consultantId) => {
                            const consultant = consultants[consultantId]
                            if (!consultant) return null
                            
                            return (
                              <div 
                                key={consultantId}
                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                              >
                                <FileText className="h-5 w-5 text-purple-500" />
                                <div className="flex-grow">
                                  <div className="font-medium">{consultant.role}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {consultant.seniority} • Profile.pdf
                                  </div>
                                </div>
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                  Ready
                                </Badge>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Message to Customer</h3>
                        <Textarea 
                          value={customerMessage}
                          onChange={(e) => setCustomerMessage(e.target.value)}
                          className="min-h-[200px]"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center p-8">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                  </div>
                  <Alert>
                    <AlertTitle>Approved!</AlertTitle>
                    <AlertDescription>
                      The customer has approved the selected consultants.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Matching Complete</CardTitle>
                  <CardDescription>The matching process has been completed successfully</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-8">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <Alert>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  All parties have approved and the matching process is now complete.
                </AlertDescription>
              </Alert>
              <div className="flex justify-end">
                <Button
                  onClick={handleClose}
                  className="w-32"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  const renderNavigation = () => {
    if (currentStep === 4) return null; // Don't show navigation on completion step

    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={true} // Back functionality not implemented
            >
              Back
            </Button>
            {currentStep === 0 && (
              <Button
                onClick={handleProceedToEmail}
                disabled={selectedConsultants.size !== 2}
              >
                Next Step ({selectedConsultants.size}/2)
              </Button>
            )}
            {currentStep === 1 && (
              <Button
                onClick={handleSendInvitations}
                disabled={isProcessing}
              >
                Send Invitations
              </Button>
            )}
            {currentStep === 2 && (
              <Button disabled={consultantResponses.pending.length > 0}>
                Next Step
              </Button>
            )}
            {currentStep === 3 && (
              customerResponse.status === "pending" ? (
                <Button 
                  onClick={handleSendCustomerApproval}
                  disabled={isProcessing}
                >
                  Send to Customer
                </Button>
              ) : (
                <Button 
                  onClick={handleFinish}
                  disabled={isProcessing}
                >
                  Complete Process
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container space-y-6 py-6 px-8">
      <Card className="border-none shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-50 rounded-full">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-2xl">{project.name}</CardTitle>
                <CardDescription>Project Matching Process</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Stepper steps={steps} currentStep={currentStep} />
        </CardContent>
      </Card>

      {renderStepContent()}
      {renderNavigation()}
    </div>
  )
} 