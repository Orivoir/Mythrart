"use client"

import { useContext } from "react"

import { ProjectContext } from "@/components/contexts/ProjectContext"

export function useProjectContext() {
  const context = useContext(ProjectContext)

  if (!context) {
    throw new Error(
      "useProjectContext must be used inside ProjectProvider",
    )
  }

  return context
}