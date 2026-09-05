"use client"

import { Drawer } from "vaul"

import type { AdaptiveSurfaceProps } from "@/components/hooks/useAdaptiveSurface/types"

export function DrawerSurface({
  open,
  onOpenChange,
  trigger,
  children,
}: AdaptiveSurfaceProps) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Drawer.Trigger asChild>
        {trigger}
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay
          className="
            fixed
            inset-0
            z-50
            bg-black/40
          "
        />

        <Drawer.Content
          className="
            fixed
            inset-x-0
            bottom-0
            z-50
            flex
            max-h-[max(60vh,320px)]
            flex-col
            overflow-hidden
            rounded-t-2xl
            bg-background
            outline-none
          "
        >
          <div
            className="
              flex
              shrink-0
              justify-center
              pb-2
              pt-3
            "
          >
            <div
              className="
                h-1.5
                w-12
                rounded-full
                bg-muted-foreground/30
              "
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}