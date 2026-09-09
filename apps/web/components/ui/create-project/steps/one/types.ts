import type { FileUploadProps } from "@/components/ui/file-upload"
import type { SelectOption } from "@/components/ui/select"
import type { User } from "@/components/api/types"

export type CreateProjectTheme = {
  id: string
  name: string
  shortDescribe?: string
  cover?: string
  author?: User
}

export type CreateProjectCoverPreset = {
  id: string
  image: string
  label?: string
}

export type CreateProjectStepOneValues = {
  title: string
  subtitle: string
  type: string
  description: string
  theme: string
  cover: File | null
  coverPreset: string | null
}

export type CreateProjectStepOneProps = {
  value: CreateProjectStepOneValues

  projectTypes: SelectOption[]
  themes: CreateProjectTheme[]
  coverPresets: CreateProjectCoverPreset[]

  onChange: (
    field: keyof Omit<
      CreateProjectStepOneValues,
      "cover" | "coverPreset"
    >,
    value: string,
  ) => void

  onCoverChange: FileUploadProps["onChange"]
  onCoverPresetChange: (preset: string | null) => void

  onMorePresetCover?: () => void
}