"use client"

import type { ReactNode } from "react"

import { useAdaptiveSurface } from "@/components/hooks/useAdaptiveSurface"

export interface UserMenuLayoutProps {
  trigger: ReactNode
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function UserMenuLayout({
  trigger,
  children,
  open,
  onOpenChange,
}: UserMenuLayoutProps) {
  const { Surface } = useAdaptiveSurface()

  return (
    <Surface
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </Surface>
  )
}