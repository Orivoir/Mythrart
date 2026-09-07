import type { LucideIcon } from "lucide-react"

export type SelectOption = {
  value: string
  label: string
  description?: string
  image?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  disabled?: boolean
}

export type SelectProps = {
  options: SelectOption[]

  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void

  placeholder?: string

  disabled?: boolean
  name?: string
  required?: boolean

  className?: string
}