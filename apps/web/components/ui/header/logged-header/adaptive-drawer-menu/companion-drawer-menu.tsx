"use client"

import { useAdaptiveSurface } from "@/components/hooks/useAdaptiveSurface"

import { DrawerMenuSections } from "./menu-sections"
import type { DrawerMenuSectionsProps } from "./menu-sections"

export type CompanionDrawerMenuProps = DrawerMenuSectionsProps & {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Companion menu rendered as a bottom sheet through the shared adaptive surface (vaul). */
export function CompanionDrawerMenu({
  open,
  onOpenChange,
  ...sectionsProps
}: CompanionDrawerMenuProps) {
  const { Surface } = useAdaptiveSurface()

  return (
    <Surface
      open={open}
      onOpenChange={onOpenChange}
      // Open state is controlled externally (bottom nav "Menu" button), no visible trigger needed.
      trigger={<span aria-hidden="true" className="hidden" />}
    >
      <DrawerMenuSections {...sectionsProps} />
    </Surface>
  )
}

