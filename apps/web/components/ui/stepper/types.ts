export type StepperStep = {
  id: string
  index: number
  status: StepperStepStatus
  title: string
  description?: string
  isCurrent: boolean
}

export type StepperProps = {
  steps: StepperStep[]
  currentStep: number
  className?: string
}

export type StepperStepStatus =
  | "completed"
  | "active"
  | "upcoming"