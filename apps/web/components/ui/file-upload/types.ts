import type { ReactNode } from "react"

export type FileUploadProps = {
  children: ReactNode

  maxSize?: number
  allowedFileTypes?: string[]

  multiple?: boolean
  maxFiles?: number

  onChange?: (files: File[]) => void
  onReject?: (files: File[]) => void

  disabled?: boolean
  className?: string
}