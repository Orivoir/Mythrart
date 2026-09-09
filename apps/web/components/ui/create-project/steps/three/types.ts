import type { LucideIcon } from "lucide-react"

export type ProjectFeatureId =
  | "versioning"
  | "translation"
  | "writing-reports"

export type ProjectFeature = {
  id: ProjectFeatureId
  title: string
  describe: string
  icon: LucideIcon
  isLocked: boolean
}

export type SuggestionLevel =
  | "basic"
  | "advanced"

export type SuggestionOption = {
  id: SuggestionLevel
  title: string
  describe: string
  isLocked: boolean
}

export type WritingGoalType =
  | "words"
  | "pages"
  | "chapters"

export type WritingGoal = {
  enabled: boolean
  type: WritingGoalType
  target: number
  durationMonths: number
}

export type StepThreeValues = {
  features: Record<ProjectFeatureId, boolean>
  suggestionLevel: SuggestionLevel
  writingGoal: WritingGoal
}

export type StepThreeProps = {
  features: ProjectFeature[]
  suggestions: SuggestionOption[]

  initialValues?: Partial<StepThreeValues>

  onChange?: (values: StepThreeValues) => void
  onSuggestionDemo?: () => void
}