"use client"

import { Crown } from "lucide-react"

import { ButtonWithIcon } from "@/components/ui/button-with-icon"

export type PlanCardProps = {
  planLabel?: string
  projectsUsed?: number
  projectsLimit?: number
  onPlansClick?: () => void
}

export function PlanCard({
  planLabel = "Plan Free",
  projectsUsed = 0,
  projectsLimit = 1,
  onPlansClick,
}: PlanCardProps) {
  const progress =
    projectsLimit > 0
      ? Math.min(100, (projectsUsed / projectsLimit) * 100)
      : 0

  return (
    <div className="rounded-lg bg-soft-blue p-3">
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <Crown
          className="size-4 text-primary"
          aria-hidden="true"
        />

        {planLabel}
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        Projets {projectsUsed} / {projectsLimit}
      </p>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ButtonWithIcon
        type="button"
        icon={Crown}
        iconPosition="left"
        iconSize="sm"
        variant="primary"
        size="full"
        className="mt-3 h-10"
        onClick={onPlansClick}
      >
        Voir les offres
      </ButtonWithIcon>
    </div>
  )
}
