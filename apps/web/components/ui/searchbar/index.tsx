"use client"

import { useRef } from "react"
import { Search } from "lucide-react"
import type { FocusEventHandler, RefObject } from "react"

import ShortcutIcon from "./shortcut-icon"
import EntryText from "./entry-text"
import RemoveButton from "./remove-button"

export type SearcharProps = {
  isCompanion?: boolean
  onFocus?: FocusEventHandler<HTMLDivElement>
  inputRef?: RefObject<HTMLInputElement | null>
}

export function SearchBar({
  isCompanion = false,
  onFocus,
  inputRef,
}: SearcharProps) {
  const internalRef = useRef<HTMLInputElement | null>(null)
  const refInput = inputRef ?? internalRef

  return (
    <div
      className="relative w-full"
      onFocus={onFocus}
    >
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
      ) : (
        <ShortcutIcon />
      )}
    </div>
  )
}