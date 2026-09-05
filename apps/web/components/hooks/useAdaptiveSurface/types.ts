import type { ReactNode } from "react"

export type AdaptiveSurfaceProps = {
  trigger: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}