import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {useTranslations} from "next-intl"

import type {
  WritingGoal,
  WritingGoalType,
} from "../types"

interface WritingGoalInputProps {
  value: WritingGoal
  onChange: (value: Partial<WritingGoal>) => void
}

export function WritingGoalInput({
  value,
  onChange,
}: WritingGoalInputProps) {

  const t = useTranslations("CreateProject.StepThree.GoalWriting")

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          {t("LabelSelectQuantity")}
        </label>

        <Select
          value={value.type}
          options={[
            {
              value: "words",
              label: t("SelectOptionsQuantity.label_1"),
            },
            {
              value: "pages",
              label: t("SelectOptionsQuantity.label_2"),
            },
            {
              value: "chapters",
              label: t("SelectOptionsQuantity.label_3"),
            },
          ]}
          onValueChange={(type) =>
            onChange({
              type: type as WritingGoalType,
            })
          }
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          {t("LabelSelectType")}
        </label>

        <div className="flex">
          <Input
            type="number"
            min={1}
            value={value.target}
            onChange={(event) =>
              onChange({
                target: Number(event.target.value),
              })
            }
            className="rounded-r-none"
          />

          <span
            className="
              flex items-center
              rounded-r-sm border border-l-0 border-border
              bg-surface px-3
              text-xs text-muted-foreground
            "
          >
            {value.type === "words"
              ? t("VolumeUnit.words")
              : value.type === "pages"
                ? t("VolumeUnit.pages")
                : t("VolumeUnit.chapters")}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          {t("LabelSelectDuration")}
        </label>

        <Select
          value={String(value.durationMonths)}
          options={[
            {
              value: "1",
              label: t("SelectOptionsDuration.label_1"),
            },
            {
              value: "3",
              label: t("SelectOptionsDuration.label_2"),
            },
            {
              value: "6",
              label: t("SelectOptionsDuration.label_3"),
            },
            {
              value: "12",
              label: t("SelectOptionsDuration.label_4"),
            },
          ]}
          onValueChange={(duration) =>
            onChange({
              durationMonths: Number(duration),
            })
          }
        />
      </div>
    </div>
  )
}