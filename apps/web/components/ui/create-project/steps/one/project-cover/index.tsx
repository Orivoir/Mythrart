"use client"

import { useTranslations } from "next-intl"
import { Text } from "@/components/ui/Typography"
import type {
  CreateProjectCoverPreset,
} from "./../types"
import ButtonMore from "./button-more"
import PresetItem from "./preset-item"
import CoverUpload from "./cover-upload"
import fireEvent from "@/lib/constants/custom-events"

interface ProjectCoverProps {
  cover: File | null
  coverPreset: string | null
  coverPresets: CreateProjectCoverPreset[]

  onCoverChange?: (files: File[]) => void
  onCoverPresetChange: (preset: string | null) => void
}

export function ProjectCover({
  cover,
  coverPreset,
  coverPresets,
  onCoverChange,
  onCoverPresetChange
}: ProjectCoverProps) {
  const t = useTranslations("CreateProject.StepOne")

  const onMorePresetCover = () => {
    fireEvent.showMorePresetCover()
  }

  return (
    <div className="space-y-2">
      <Text className="font-medium text-foreground">
        {t("cover.label")}
      </Text>

      <div className="flex gap-3 overflow-x-auto pb-1">
        <CoverUpload
          onCoverPresetReset={() => onCoverPresetChange(null)}
          onCoverChange={onCoverChange}
        />

        {coverPresets.map((preset) => {
          const isSelected = coverPreset === preset.id

          return (
            <PresetItem
              key={preset.id}
              id={preset.id}
              isSelected={isSelected}
              label={preset.label ?? ""}
              image={preset.image}
              onCoverPresetChange={() => onCoverPresetChange(preset.id)}
            />
          )
        })}

        <ButtonMore onClick={onMorePresetCover} />
      </div>

      {cover && (
        <Text className="text-xs text-muted-foreground">
          {cover.name}
        </Text>
      )}
    </div>
  )
}