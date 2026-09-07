import type { StepperStepStatus } from "./types"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export type StepIndicatorProps = {
  index: number
  status: StepperStepStatus
  isCurrent: boolean
}

export function StepIndicator({
  index,
  status,
  isCurrent,
}: StepIndicatorProps) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full",
        "text-sm font-medium",
        status === "active" && [
          "bg-primary text-primary-foreground",
          "ring-4 ring-primary/10",
        ],
        status === "completed" && [
          "bg-primary text-primary-foreground",
        ],
        status === "upcoming" && [
          "border bg-background",
          "text-muted-foreground",
        ],
      )}
      aria-current={isCurrent ? "step" : undefined}
    >
      {status === "completed" ? (
        <Check
          className="size-4"
          aria-hidden="true"
        />
      ) : (
        index
      )}
    </div>
  )
}