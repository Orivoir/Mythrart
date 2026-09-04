"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

import { SearchBar } from "@/components/ui/searchbar"
import { SuggestionList } from "@/components/ui/suggestion-ressource"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import type { SuggestionsData } from "@/components/ui/suggestion-ressource/types"

import { VIEWPORT_MARGIN, type FloatingSearchPosition } from "./position"

type FloatingSearchPanelProps = {
  suggestions: SuggestionsData
  position: FloatingSearchPosition | null
  onClose: () => void
  ref?: React.Ref<HTMLDivElement>
}

export function FloatingSearchPanel({
  suggestions,
  position,
  onClose,
  ref,
}: FloatingSearchPanelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus()
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={
        position
          ? {
              top: position.top,
              left: position.left,
              width: position.width,
              maxHeight: position.maxHeight,
            }
          : {
              top: VIEWPORT_MARGIN,
              left: VIEWPORT_MARGIN,
              width: `calc(100vw - ${VIEWPORT_MARGIN * 2}px)`,
              visibility: "hidden",
            }
      }
      className="
        fixed
        z-50
        flex
        min-w-[320px]
        max-h-[50vh]
        flex-col
        overflow-hidden
        rounded-md
        bg-background
        px-4
        py-6
        shadow-2xl
      "
      onMouseDown={(event) => {
        event.stopPropagation()
      }}
    >
      <div className="flex shrink-0 items-center gap-2">
        <div className="min-w-0 flex-1">
          <SearchBar
            isCompanion={false}
            inputRef={inputRef}
          />
        </div>

        <ButtonWithIcon
          type="button"
          icon={X}
          variant="ghost"
          size="icon"
          aria-label="Fermer la recherche"
          onClick={onClose}
        />
      </div>

      <div
        className="
          mt-8
          min-h-0
          flex-1
          overflow-y-auto
          rounded-md
          bg-background
          shadow-md
        "
      >
        <div className="p-1">
          {suggestions.map((suggestionList) => (
            <SuggestionList
              key={suggestionList.resource}
              suggestions={suggestionList}
              variant="workspace"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}