"use client"

import { useAppMode } from "@/components/hooks/useAppMode"
import type {
  Subscription,
  User,
} from "@/components/api/types"
import { BottomNavigation as CompanionBottomNavigation } from "@/components/ui/bottom-navigation"

import { CompanionTopHeader } from "./companion-top-header"
import { WorkspaceTopHeader } from "./workspace"

export type AdaptiveTopHeaderProps = {
  user?: User
  subscription?: Subscription
  onMenuClick?: () => void
}

export function AdaptiveTopHeader({
  user,
  subscription,
  onMenuClick,
}: AdaptiveTopHeaderProps) {
  const {
    usage: { mode },
  } = useAppMode()

  if (mode === "companion") {
    return (
      <>
        <CompanionTopHeader
          user={user}
          subscription={subscription}
        />
        <CompanionBottomNavigation
          onMenuClick={onMenuClick}
        />
      </>
    )
  }

  return (
    <WorkspaceTopHeader
      mode={mode === "quick-workspace" ? "quick" : "workspace"}
      user={user}
      subscription={subscription}
    />
  )
}
