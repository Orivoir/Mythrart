"use client"

import { useAppMode } from "@/components/hooks/useAppMode"
import { BottomNavigation as CompanionBottomNavigation } from "@/components/ui/bottom-navigation"

import { CompanionTopHeader } from "./companion-top-header"
import { WorkspaceTopHeader } from "./workspace"

export type AdaptiveTopHeaderProps = {
  onMenuClick?: () => void
}

export function AdaptiveTopHeader({
  onMenuClick,
}: AdaptiveTopHeaderProps) {
  const {
    usage: { mode },
  } = useAppMode()

  if (mode === "companion") {
    return (
      <>
        <CompanionTopHeader />
        <CompanionBottomNavigation
          onMenuClick={onMenuClick}
        />
      </>
    )
  }

  return (
    <WorkspaceTopHeader
      mode={mode === "quick-workspace" ? "quick" : "workspace"}
    />
  )
}
