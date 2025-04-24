"use client"

import { useState, useEffect } from "react"
import { Project, Consultant } from "@/lib/supabase"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"

export default function EmailPage({
  params,
}: {
  params: { projectId: string }
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const consultantIds = searchParams.get("consultants")?.split(",") || []
  
  const [project, setProject] = useState<Project | null>(null)
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [subject, setSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadProjectAndConsultants()
  }, [params.projectId, consultantIds])

  const loadProjectAndConsultants = async () => {
    setLoading(true)
    try {
      // Load project details
      const { data: projectData } = await supabase
        .from("project")
        .select("*")
        .eq("id", params.projectId)
        .single()

      if (projectData) {
        setProject(projectData)
        // Set default subject and body
        setSubject(`Invitation: ${projectData.name} Project`)
        setEmailBody(generateDefaultEmailBody(projectData))
      }

      // Load consultant details
      if (consultantIds.length > 0) {
        const { data: consultantsData } = await supabase
          .from("consultant")
          .select("*")
          .in("id", consultantIds)

        if (consultantsData) {
          setConsultants(consultantsData)
        }
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateDefaultEmailBody = (project: Project) => {
    return `Dear Consultant,

We are excited to invite you to participate in the ${project.name} project. Based on your skills and experience, we believe you would be a great fit for this opportunity.

Project Details:
- Client: ${project.client}
- Location: ${project.location}
- Start Date: ${new Date(project.start_date).toLocaleDateString()}
${project.end_date ? `- End Date: ${new Date(project.end_date).toLocaleDateString()}` : ''}
- Budget: $${project.budget.toLocaleString()}

Required Skills:
${project.skills.map(skill => `- ${skill}`).join('\n')}

Please let us know if you are interested in this opportunity by responding to this email. We will provide more details about the project and next steps once we hear back from you.

Best regards,
Your Project Team`
  }

  const handleSendEmails = async () => {
    setSending(true)
    try {
      // Here you would implement the actual email sending logic
      // For now, we'll just simulate it with a delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update project status
      await supabase
        .from("project")
        .update({ status: "In Progress" })
        .eq("id", params.projectId)

      // Navigate back to projects list
      router.push("/projects")
    } catch (error) {
      console.error("Error sending emails:", error)
    } finally {
      setSending(false)
    }
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

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Send Invitations</h1>
          <p className="text-muted-foreground">
            Review and send invitations to selected consultants
          </p>
        </div>
        <Button
          onClick={() => router.back()}
          variant="outline"
        >
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selected Consultants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {consultants.map((consultant) => (
              <div key={consultant.id} className="flex items-center gap-2">
                <div className="font-medium">{consultant.role}</div>
                <div className="text-muted-foreground">•</div>
                <div className="text-sm text-muted-foreground">{consultant.seniority}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Enter email message"
              rows={15}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={handleSendEmails}
            disabled={sending || !subject || !emailBody}
          >
            {sending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                Sending Invitations...
              </>
            ) : (
              "Send Invitations"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 