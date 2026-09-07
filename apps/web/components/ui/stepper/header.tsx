import type { StepperStepStatus } from "./types"
import { StepIndicator } from "./indicator"
import { Title } from "@/components/ui/Typography"

export type StepHeaderProps = {
  index: number
  status: StepperStepStatus
  title: string
  isCurrent: boolean
}

export function StepHeader({
  index,
  status,
  title,
  isCurrent,
}: StepHeaderProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <StepIndicator
        index={index}
        status={status}
        isCurrent={isCurrent}
      />

      <Title
        className="min-w-0 text-sm"
        variant={status === "upcoming" ? "muted" : "default"}
      >
        {title}
      </Title>
    </div>
  )
}