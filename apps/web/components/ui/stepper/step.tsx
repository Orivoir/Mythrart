import type { StepperStep, StepperStepStatus } from "./types"
import { StepIndicator } from "./indicator"
import { StepHeader } from "./header"
import { StepDescription } from "./description"

export type StepIndicatorProps = {
  index: number
  status: StepperStepStatus
  isCurrent: boolean
}


export type StepProps = Pick<
  StepperStep,
  "index" | "status" | "title" | "description" | "isCurrent"
>

export function Step({
  index,
  status,
  title,
  description,
  isCurrent,
}: StepProps) {
  const header = (
    <StepHeader
      index={index}
      status={status}
      title={title}
      isCurrent={isCurrent}
    />
  )

  return <div className="min-w-0">{header}<StepDescription description={description} /></div>
}

Step.Indicator = StepIndicator
Step.Header = StepHeader
Step.Description = StepDescription
