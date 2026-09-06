"use client"

import { useState } from "react"
import { Grid2X2, X } from "lucide-react"

import { Button } from "@/components/ui/button"

import { DrawerMenuSections } from "./menu-sections"
import type { DrawerMenuSectionsProps } from "./menu-sections"

/** Floating action button opening the menu as a right-anchored overlay panel. */
export function QuickDrawerMenu(props: DrawerMenuSectionsProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        aria-label="Ouvrir le menu"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 size-12 rounded-full p-0 shadow-lg"
      >
        <Grid2X2 className="size-5" aria-hidden="true" />
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            className="
              fixed
              inset-y-0
              right-0
              z-50
              flex
              w-full
              max-w-sm
              flex-col
              overflow-hidden
              border-l
              border-border
              bg-background
              shadow-xl
            "
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border p-4">
              <p className="text-sm font-semibold">
                Menu
              </p>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Fermer le menu"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <DrawerMenuSections {...props} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
