"use client"

import type { ReactNode } from "react"

export interface UserMenuContentProps {
  children: ReactNode
}

export function UserMenuContent({
  children,
}: UserMenuContentProps) {
  return (
    <div className="mx-auto w-full max-w-sm p-4">
      {children}
    </div>
  )
}