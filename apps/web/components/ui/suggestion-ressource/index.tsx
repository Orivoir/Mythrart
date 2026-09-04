import { cn } from "@/lib/utils"

import SuggestionItem, {type SuggestionItemVariant } from "./item"
import type { SuggestionsList } from "./types"

export type SuggestionListProps = {
  suggestions: SuggestionsList
  variant: SuggestionItemVariant
  className?: string
}

export function SuggestionList({
  suggestions,
  variant,
  className,
}: SuggestionListProps) {
  return (
    <section className={cn("w-full", className)}>
      <h3 className="px-3 pb-2 text-xs font-medium text-muted-foreground">
        {suggestions.resource}
      </h3>

      <div className="flex w-full flex-col">
        {suggestions.items.map((suggestion) => (
          <SuggestionItem
            key={suggestion.id}
            suggestion={suggestion}
            variant={variant}
          />
        ))}
      </div>
    </section>
  )
}