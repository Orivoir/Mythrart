import { StepThreeHeader } from "../header"

import { WritingGoalBottom } from "./bottom"
import { WritingGoalInput } from "./input"

import type { WritingGoal } from "../types"

interface WritingGoalProps {
  value: WritingGoal
  onChange: (value: Partial<WritingGoal>) => void
}

export function WritingGoal({
  value,
  onChange,
}: WritingGoalProps) {
  return (
    <section
      className="
        space-y-4
        rounded-lg border border-border
        bg-background p-4
      "
    >
      <StepThreeHeader
        title="Objectif d’écriture"
        subtitle="Fixez un objectif pour rester motivé et suivre votre progression."
        withEnable
        enabled={value.enabled}
        onEnabledChange={(enabled) =>
          onChange({ enabled })
        }
        infos={{
          title: "Objectif d’écriture",
          describe:
            "Votre objectif vous permet de suivre votre progression tout au long de votre projet.",
        }}
      />

      {value.enabled && (
        <>
          <WritingGoalInput
            value={value}
            onChange={onChange}
          />

          <WritingGoalBottom
            goal={value}
          />
        </>
      )}
    </section>
  )
}