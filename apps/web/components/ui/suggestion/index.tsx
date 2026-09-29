"use client"
import LoadingSuggestion from "./loading"

import type { EbookEntityWithRelationsResponseAPI } from "@/app/types/api/ebook-entity"
import { EntitySuggestionItem } from "./item"
import EmptySuggestion from "./empty"

interface SuggestionProps {
  loading: boolean
  items: (EbookEntityWithRelationsResponseAPI | null)[]
  selectedIndex: number
  command: (options: CommandOptions) => void
}

export type CommandOptions = {
  id: string
  label?: string
}

export function Suggestion({
  items,
  loading,
  selectedIndex,
  command,
}: SuggestionProps) {

  if (loading) {
    return <LoadingSuggestion />
  }

  if(!loading && items.length === 0) {
    return <EmptySuggestion />
  }

  return (
    <div className="flex flex-col gap-1 bg-soft-blue/40">
      {items.map((entity, index) => (
        <EntitySuggestionItem
          key={entity?.id ?? `loading-${index}`}
          entity={entity}
          selected={index === selectedIndex}
          onSelect={() => command({
            id: entity?.id ?? "",
            label: entity?.name,
          })}
        />
      ))}
    </div>
  )
}