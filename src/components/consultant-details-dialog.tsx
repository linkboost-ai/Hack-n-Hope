import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { Consultant } from "@/lib/supabase"

interface ConsultantDetailsDialogProps {
  consultant: Consultant
}

export function ConsultantDetailsDialog({ consultant }: ConsultantDetailsDialogProps) {
  // Get first letter of name or fallback to '?'
  const nameInitial = consultant.name?.charAt(0) ?? '?'
  const displayName = consultant.name || 'Unknown Consultant'
  const industry = consultant.industry || 'No Industry'
  const contactPerson = consultant.contact_person || 'No Contact'
  const employeeCount = consultant.number_of_emp || 0
  const location = consultant.location || 'No Location'
  const createdAt = consultant.created_at ? new Date(consultant.created_at).toLocaleDateString() : 'Unknown Date'

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Consultant Details</DialogTitle>
          <DialogDescription>Information about {displayName}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                {nameInitial}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{displayName}</h2>
              <p className="text-muted-foreground">Created: {createdAt}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">Company Information</h3>
            <div className="grid gap-4">
              <div>
                <div className="text-sm font-medium">Industry</div>
                <div className="text-sm text-muted-foreground">{industry}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Contact Person</div>
                <div className="text-sm text-muted-foreground">{contactPerson}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Number of Employees</div>
                <div className="text-sm text-muted-foreground">{employeeCount}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Location</div>
                <div className="text-sm text-muted-foreground">{location}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 