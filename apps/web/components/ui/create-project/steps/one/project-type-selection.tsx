"use client"

import { useTranslations } from "next-intl"
import { Select } from "@/components/ui/select"
import { Text } from "@/components/ui/Typography"

import type { SelectOption } from "@/components/ui/select"

interface ProjectTypeSelectionProps {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}

export function ProjectTypeSelection({
  value,
  options,
  onChange,
}: ProjectTypeSelectionProps) {
  const t = useTranslations("CreateProject.StepOne")

  return (
    <div className="space-y-2">
      <label
        htmlFor="project-type"
        className="text-sm font-medium text-foreground"
      >
        {t("type.label")} {" "}
        <Text className="inline text-foreground" aria-hidden="true">*</Text>
      </label>

      <Select
        name="project-type"
        value={value}
        options={options}
        onValueChange={onChange}
        placeholder={t("type.placeholder")}
        required
        className="md:max-w-[340px]"
      />
    </div>
  )
}