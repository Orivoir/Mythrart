"use client"

import { Crown } from "lucide-react"
import { useTranslations } from "next-intl"

import { ButtonWithIcon } from "@/components/ui/button-with-icon"

export type PlanCardProps = {
  planLabel?: string
  projectsUsed?: number
  projectsLimit?: number
  onPlansClick?: () => void
}

export function PlanCard({
  planLabel,
  projectsUsed = 0,
  projectsLimit = 1,
  onPlansClick,
}: PlanCardProps) {
  const t = useTranslations("Header.Logged.DrawerMenu.PlanCard")
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

        {planLabel ?? t("DefaultPlanLabel")}
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {t("Projects", { used: projectsUsed, limit: projectsLimit })}
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
        {t("ViewOffers")}
      </ButtonWithIcon>
    </div>
  )
}
