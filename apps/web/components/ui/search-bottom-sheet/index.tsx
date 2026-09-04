"use client"

import { Drawer } from "vaul"

import { SearchBar } from "@/components/ui/searchbar"
import { SuggestionList } from "@/components/ui/suggestion-ressource"

import type { SuggestionsData } from "@/components/ui/suggestion-ressource/types"

export type SearchBottomSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  suggestions: SuggestionsData
}

export function SearchBottomSheet({
  open,
  onOpenChange,
  suggestions,
}: SearchBottomSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />

        <Drawer.Content
          className="
            fixed
            inset-x-0
            bottom-0
            z-50
            flex
            max-h-[max(60vh,320px)]
            flex-col
            rounded-t-2xl
            bg-background
            outline-none
          "
        >
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted" />

          <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-6 pt-4">
            <div className="shrink-0">
              <SearchBar isCompanion />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {suggestions.map((suggestionList) => (
                <SuggestionList
                  key={suggestionList.resource}
                  suggestions={suggestionList}
                  variant="companion"
                />
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}