"use client"

import { ArrowUpRight, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { AppLink } from "@/components/ui/app-link"
import { suggestionResourceIcons } from "./suggestion-ressource-icons"
import type { Suggestion } from "./types"

export type SuggestionItemVariant = "companion" | "workspace"

export type SuggestionItemProps = {
  suggestion: Suggestion
  variant: SuggestionItemVariant
  className?: string
}

export default function SuggestionItem({
  suggestion,
  variant,
  className,
}: SuggestionItemProps) {
  const Icon = suggestionResourceIcons[suggestion.resource]
  const isCompanion = variant === "companion"

  return (
    <AppLink
      href={suggestion.href}
      mutedOnHover={false}
      className={cn(
        "group flex w-full items-center",
        isCompanion ? "gap-3 px-3 py-3" : "gap-3 px-2 py-2",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md bg-muted",
          isCompanion ? "size-10" : "size-8",
        )}
      >
        <Icon
          className={cn(
            "text-muted-foreground",
            isCompanion ? "size-5" : "size-4",
          )}
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate font-medium text-foreground",
            isCompanion ? "text-base" : "text-sm",
          )}
        >
          {suggestion.label}
        </p>

        <p
          className={cn(
            "truncate text-muted-foreground",
            isCompanion ? "text-sm" : "text-xs",
          )}
        >
          {suggestion.type}
        </p>
      </div>

      {isCompanion ? (
        <ChevronRight
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      ) : (
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      )}
    </AppLink>
  )
}