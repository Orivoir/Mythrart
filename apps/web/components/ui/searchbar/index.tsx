"use client"

import { useRef, useState } from "react"
import { Search, Command, X } from "lucide-react"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import ShortcutIcon from "./shortcut-icon"

import type { AppUsageMode } from "@/components/hooks/useAppMode"
import EntryText from "./entry-text"
import RemoveButton from "./remove-button"

export type SearcharProps = {
  mode: AppUsageMode
}

export function SearchBar({mode}: SearcharProps) {

  const isCompanion = mode === "companion"
  const refInput = useRef<HTMLInputElement | null>(null)

  return (
    <div className="relative w-full">
      <Search
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          size-5
          -translate-y-1/2
          text-muted-foreground
        "
        strokeWidth={1.8}
        aria-hidden="true"
      />

      <EntryText refInput={refInput} />

      {isCompanion ? (
        <RemoveButton refInput={refInput} />
      ): (
        <ShortcutIcon />
      )}

    </div>
  )
}