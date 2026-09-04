"use client"

import { useContext } from "react"
import { AppUsageContext } from "@/components/contexts/AppUsageMode"

export type {AppUsageMode} from "@/components/contexts/AppUsageMode" 

export function useAppMode() {
  const context = useContext(AppUsageContext)

  if (!context) {
    throw new Error(
      "useAppMode must be used within an AppUsageProvider",
    )
  }

  return context
}

