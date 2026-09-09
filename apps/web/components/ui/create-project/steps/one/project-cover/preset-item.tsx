"use client"

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl"

export interface PresetItemProps {
  isSelected: boolean
  id: string;
  label?: string
  image: string
  onCoverPresetChange: (id: string) => void
}

export default function PresetItem({isSelected, id, label, image, onCoverPresetChange}: PresetItemProps) {
  const t = useTranslations("CreateProject.StepOne")

  return (
    <Button
      key={id}
      type="button"
      variant="ghost"
      onClick={() => {
        onCoverPresetChange(id)
      }}
      aria-label={
        label
          ? t("cover.usePreset", { label })
          : t("cover.useCover")
      }
      aria-pressed={isSelected}
      className="
        relative h-[132px] w-[90px] shrink-0
        overflow-hidden rounded-md p-0
        hover:bg-transparent
      "
    >
      <img
        src={image}
        alt={label ?? ""}
        className="size-full object-cover"
      />

      {isSelected && (
        <div
          className="
            absolute inset-0
            ring-2 ring-inset ring-accent
          " 
          aria-hidden="true"
        />
      )}
    </Button>
  )
}