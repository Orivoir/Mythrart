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

export type CreateProjectStepTwoValues = {
  synopsisFile: File | null
}

export type CreateProjectStepTwoProps = {
  hasAnalysisAccess: boolean

  value: CreateProjectStepTwoValues
  analysis: SynopsisAnalysisState

  onFileChange: (file: File) => void
  onCancelAnalysis: () => void
  onClickDemo: () => void
  onShowDetails: (data: SynopsisShortAnalysisData) => void
}