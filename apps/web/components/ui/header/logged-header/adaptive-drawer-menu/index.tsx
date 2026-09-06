"use client"

import { useAppMode } from "@/components/hooks/useAppMode"

import { CompanionDrawerMenu } from "./companion-drawer-menu"
import type { DrawerMenuSectionsProps } from "./menu-sections"
import { QuickDrawerMenu } from "./quick-drawer-menu"
import { WorkspaceSidebarMenu } from "./workspace"

export type AdaptiveDrawerMenuProps = DrawerMenuSectionsProps & {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onLogout?: () => void
  userId?: string;
}

export function AdaptiveDrawerMenu({
  open = false,
  onOpenChange,
  onLogout,
  ...sectionsProps
}: AdaptiveDrawerMenuProps) {
  const {
    usage: { mode },
  } = useAppMode()

  if (mode === "companion") {
    return (
      <CompanionDrawerMenu
        open={open}
        onOpenChange={(next) => onOpenChange?.(next)}
        userId={sectionsProps.userId}
        {...sectionsProps}
      />
    )
  }

  if (mode === "quick-workspace") {
    return <QuickDrawerMenu {...sectionsProps} />
  }

  return (
    <WorkspaceSidebarMenu
      userId={sectionsProps.userId}
      onLogout={onLogout}
      {...sectionsProps}
    />
  )
}
