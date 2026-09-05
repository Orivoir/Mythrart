"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import type { AdaptiveSurfaceProps } from "@/components/hooks/useAdaptiveSurface/types"

export function DropdownSurface({
  open,
  onOpenChange,
  trigger,
  children,
}: AdaptiveSurfaceProps) {
  return (
    <DropdownMenu.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <DropdownMenu.Trigger asChild>
        {trigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="
            z-50
            min-w-[220px]
            max-h-[var(--radix-dropdown-menu-content-available-height)]
            overflow-x-hidden
            overflow-y-auto
            rounded-xl
            border
            bg-background
            p-0
            shadow-xl
            outline-none
          "
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}