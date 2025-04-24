import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  title: string
  description: string
  status: "complete" | "current" | "upcoming"
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="space-y-4">
      <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100">
        <ol className="relative z-10 flex justify-between text-sm font-medium">
          {steps.map((step, index) => (
            <li key={step.title} className="flex items-center gap-2 bg-white p-2">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  step.status === "complete"
                    ? "bg-purple-600 text-white"
                    : step.status === "current"
                    ? "bg-purple-100 text-purple-600 ring-1 ring-purple-600"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {step.status === "complete" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "hidden sm:block",
                  step.status === "complete" && "text-purple-600",
                  step.status === "current" && "text-purple-600",
                  step.status === "upcoming" && "text-gray-500"
                )}
              >
                {step.title}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="text-center sm:text-left">
        <p className="text-sm text-gray-500">{steps[currentStep].description}</p>
      </div>
    </div>
  )
} 