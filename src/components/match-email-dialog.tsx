import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Consultant, Project } from "@/data/mock-data"
import { Badge } from "./ui/badge"
import { Send, AlertCircle } from "lucide-react"

interface MatchEmailDialogProps {
  matches: Array<{
    consultant: Consultant
    project: Project
    matchScore: number
  }>
  project: Project
}

export function MatchEmailDialog({ matches, project }: MatchEmailDialogProps) {
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState(`Project Match: ${project.title}`)
  const [message, setMessage] = useState(`Dear [Consultant Name],

I hope this email finds you well. We have identified a potential project match that aligns with your skills and experience.

Project Details:
- Title: ${project.title}
- Client: ${project.client}
- Duration: ${project.duration}
- Start Date: ${project.startDate}
- Location: ${project.location}

Required Skills:
${project?.skills?.map((skill: string) => `- ${skill}`).join('\n')}

Based on our matching system, you have a strong compatibility score for this project. We believe this opportunity would be an excellent fit for your expertise.

Please review the project details and let us know if you would be interested in being considered for this role. If you have any questions or would like to discuss this opportunity further, please don't hesitate to reach out.

Best regards,
[Your Name]`)

  const remainingConsultants = project.consultantsNeeded - matches.length
  const assignmentStatus = remainingConsultants > 0 
    ? `${remainingConsultants} more consultant${remainingConsultants !== 1 ? 's' : ''} needed`
    : 'All positions filled'

  const handleSendEmails = async () => {
    // In a real application, this would connect to your email service
    // For now, we'll just simulate sending emails
    console.log('Sending emails to:', matches.map(m => m.consultant.name))
    console.log('Subject:', subject)
    console.log('Message:', message)
    
    // Close the dialog after sending
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Send className="mr-2 h-4 w-4" />
          Send Match Proposals
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Match Proposals</DialogTitle>
          <DialogDescription>
            Review and customize the email that will be sent to {matches.length} consultant{matches.length !== 1 ? 's' : ''}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Project needs {project.consultantsNeeded} consultant{project.consultantsNeeded !== 1 ? 's' : ''}
              </span>
            </div>
            <Badge variant={remainingConsultants > 0 ? "secondary" : "default"}>
              {assignmentStatus}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
            {matches.map((match) => (
              <Badge key={match.consultant.id} variant="secondary">
                {match.consultant.name} ({match.matchScore}% match)
              </Badge>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Email Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendEmails}>
            Send Emails ({matches.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 