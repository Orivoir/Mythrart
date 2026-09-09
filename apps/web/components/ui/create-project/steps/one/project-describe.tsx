"use client"

import { useTranslations } from "next-intl"
import { Textarea } from "@/components/ui/textarea"

interface ProjectDescribeProps {
  value: string
  onChange: (value: string) => void
}

export function ProjectDescribe({
  value,
  onChange,
}: ProjectDescribeProps) {
  const t = useTranslations("CreateProject.StepOne")

  return (
    <div className="space-y-2">
      <label
        htmlFor="project-description"
        className="text-sm font-medium text-foreground"
      >
        {t("description.label")}
      </label>

      <Textarea
        id="project-description"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t("description.placeholder")}
        maxCount={500}
        rows={4}
      />
    </div>
  )
}