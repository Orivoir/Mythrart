import { BarChart3 } from "lucide-react"
import { HelperText } from "@/components/ui/Typography"
import type { WritingGoal } from "../types"
import {useTranslations} from "next-intl"

interface WritingGoalBottomProps {
  goal: WritingGoal
}

export function WritingGoalBottom({
  goal,
}: WritingGoalBottomProps) {

  const t = useTranslations("CreateProject.StepThree.GoalWriting")

  const dailyTarget = Math.ceil(
    goal.target / (goal.durationMonths * 30),
  )

  const unit =
    goal.type === "words"
      ? "mots"
      : goal.type === "pages"
        ? "pages"
        : "chapitres"

  return (
    <div
      className="
        flex items-start gap-3
        rounded-lg
        bg-soft-blue
        px-3 py-2.5
      "
    >
      <BarChart3
        className="mt-0.5 size-4 shrink-0 text-accent"
        aria-hidden="true"
      />

      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">
          {t("GoalComputeByDay", {
            dailyTarget,
            unit,
          })}
        </p>

        <HelperText>
          {t("HelperText")}
        </HelperText>
      </div>
    </div>
  )
}