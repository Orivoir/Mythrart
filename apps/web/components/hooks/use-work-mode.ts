"use client"

import { useEffect } from "react"

import { useProjectContext } from "@/components/hooks/use-project-context"
import fired from "@/lib/constants/custom-events"

export function useWorkMode() {
  const { project } = useProjectContext()

  useEffect(() => {
    if (!project) {
      return
    }

    fired.workModeStart(project)

  }, [project])

  return project
}