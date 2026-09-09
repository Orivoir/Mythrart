"use client"

import { Info } from "lucide-react"
import { useTranslations } from "next-intl"

import { Select } from "@/components/ui/select"
import { Text } from "@/components/ui/Typography"

import type { CreateProjectTheme } from "./types"

interface ProjectThemingProps {
  value: string
  themes: CreateProjectTheme[]
  onChange: (value: string) => void
}

export function ProjectTheming({
  value,
  themes,
  onChange,
}: ProjectThemingProps) {
  const t = useTranslations("CreateProject.StepOne")

  const options = themes.map((theme) => ({
    value: theme.id,
    label: theme.name + (theme.author && `- ${t("theme.by")} ${theme.author.name || t("theme.anonymous")}`),
    description: theme.shortDescribe,
    image: theme.cover,
  }))

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label
          htmlFor="project-theme"
          className="text-sm font-medium text-foreground"
        >
          {t("theme.label")} {" "}
          <Text className="inline text-foreground" aria-hidden="true">*</Text>
        </label>

        <Info
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      <Select
        name="project-theme"
        value={value}
        options={options}
        onValueChange={onChange}
        placeholder={t("theme.placeholder")}
        required
        className="md:max-w-[340px]"
      />
    </div>
  )
}