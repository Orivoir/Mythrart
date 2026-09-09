"use client"

import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/Typography"

import type { CreateProjectStepOneValues } from "./types"

interface ProjectInformationsProps {
  value: Pick<CreateProjectStepOneValues, "title" | "subtitle">
  onChange: (
    field: "title" | "subtitle",
    value: string,
  ) => void
}

export function ProjectInformations({
  value,
  onChange,
}: ProjectInformationsProps) {
  const t = useTranslations("CreateProject.StepOne")

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div className="space-y-2">
        <label
          htmlFor="project-title"
          className="text-sm font-medium text-foreground"
        >
          {t("information.titleLabel")} {" "}
          <Text className="inline text-foreground" aria-hidden="true">*</Text>
        </label>

        <div className="relative">
          <Input
            id="project-title"
            value={value.title}
            onChange={(event) =>
              onChange("title", event.target.value)
            }
            placeholder={t("information.titlePlaceholder")}
            maxLength={120}
            required
            className="pr-14"
          />

          <Text className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-muted-foreground">
            {value.title.length}/120
          </Text>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="project-subtitle"
          className="text-sm font-medium text-foreground"
        >
          {t("information.subtitleLabel")} {" "}
          <Text className="inline text-muted-foreground">{t("optional")}</Text>
        </label>

        <div className="relative">
          <Input
            id="project-subtitle"
            value={value.subtitle}
            onChange={(event) =>
              onChange("subtitle", event.target.value)
            }
            placeholder={t("information.subtitlePlaceholder")}
            maxLength={200}
            className="pr-14"
          />

          <Text className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-muted-foreground">
            {value.subtitle.length}/200
          </Text>
        </div>
      </div>
    </div>
  )
}