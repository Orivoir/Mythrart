import type { User } from "@/components/api/types"

export type CreateProjectTheme = {
  id: string
  name: string
  shortDescribe?: string
  cover?: string
  author?: User
}

export type SynopsisShortAnalysisData = {
  entityCount: number
  locationCount: number
  narrativeArcCount: number
  timelineCount: number
}

export type SynopsisAnalysisState = {
  percent: number
  data?: SynopsisShortAnalysisData
}

export type AnalysisJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"

export type AnalysisJob = {
  status: AnalysisJobStatus
  percent: number
  data?: SynopsisShortAnalysisData
}

export type CreateProjectStepTwoValues = {
  synopsisFile: File | null
}

export type CreateProjectStepTwoProps = {
  // feature premium user. Fallback to CTA free trial period => /billing
  hasAnalysisAccess: boolean

  value: CreateProjectStepTwoValues

  analysis: SynopsisAnalysisState

  onFileChange: (file: File) => void

  onCancelAnalysis: () => void
}