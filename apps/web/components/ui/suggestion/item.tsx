"use client"
import type { EbookEntityWithRelationsResponseAPI } from "@/app/types/api/ebook-entity"
import { Text } from "@/components/ui/Typography"
import { ebookEntityTypeIcons } from "./entity-type-icons"
import {ButtonWithIcon} from "@/components/ui/button-with-icon"

interface EntitySuggestionItemProps {
  entity: EbookEntityWithRelationsResponseAPI | null
  selected?: boolean
  onSelect: (entity: EbookEntityWithRelationsResponseAPI) => void
}

export function EntitySuggestionItem({
  entity,
  selected = false,
  onSelect,
}: EntitySuggestionItemProps) {
  if (!entity) {
    return null
  }

  const Icon = ebookEntityTypeIcons[entity.type]

  return (
    <ButtonWithIcon
      icon={Icon}
      iconSize="lg"
      size="default"
      onClick={() => onSelect(entity)}
      variant={selected ? "accent-outline" : "ghost"}
      className="justify-start"
    >
      <Text className="block truncate">
        {entity.name}
      </Text>
    </ButtonWithIcon>
  )
}