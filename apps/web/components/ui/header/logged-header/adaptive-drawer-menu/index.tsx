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
        {...sectionsProps}
      />
    )
  }

  if (mode === "quick-workspace") {
    return <QuickDrawerMenu {...sectionsProps} />
  }

  return (
    <WorkspaceSidebarMenu
      onLogout={onLogout}
      {...sectionsProps}
    />
  )
}
