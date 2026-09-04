"use client"

import { AnimatePresence } from "framer-motion"

import { SearchBar } from "@/components/ui/searchbar"
import type { SuggestionsData } from "@/components/ui/suggestion-ressource/types"

import { FloatingSearchOverlay } from "./floating-search-overlay"
import { FloatingSearchPanel } from "./floating-search-panel"
import { useFloatingSearch } from "./use-floating-search"

export type FloatingSearchProps = {
  suggestions: SuggestionsData
}

/** Renders the anchored SearchBar and its floating search overlay. */
export function FloatingSearch({ suggestions }: FloatingSearchProps) {
  const { open, position, anchorRef, floatingRef, openSearch, close } =
    useFloatingSearch()

  return (
    <>
      {/* Regular in-flow location of the SearchBar. */}
      <div
        ref={anchorRef}
        className="relative w-full"
        onFocusCapture={openSearch}
      >
        <SearchBar isCompanion={false} />
      </div>

      <AnimatePresence>
        {open && (
          <>
            <FloatingSearchOverlay onClose={close} />
            <FloatingSearchPanel
              ref={floatingRef}
              suggestions={suggestions}
              position={position}
              onClose={close}
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}
