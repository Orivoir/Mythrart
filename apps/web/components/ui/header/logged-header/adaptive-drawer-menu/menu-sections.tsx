"use client"

import { useTranslations } from "next-intl"

import type { DrawerMenuActionKey } from "./menu-data"
import { useDrawerMenuActions } from "./menu-data"
import { MenuActionItem } from "./menu-action-item"
import { PlanCard } from "./plan-card"
import { SupportSection } from "./support-section"

export type DrawerMenuSectionsProps = {
  planLabel?: string
  projectsUsed?: number
  projectsLimit?: number
  onActionClick?: (key: DrawerMenuActionKey) => void
  onPlansClick?: () => void
  onHelpClick?: () => void
  userId?: string
}

export function DrawerMenuSections({
  planLabel,
  projectsUsed,
  projectsLimit,
  userId,
  onActionClick,
  onPlansClick,
  onHelpClick
}: DrawerMenuSectionsProps) {
  const t = useTranslations("Header.Logged.DrawerMenu.Sections")
  const drawerMenuActions = useDrawerMenuActions()

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-1">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("Shortcuts")}
        </p>

        {drawerMenuActions.map((action) => (
          <MenuActionItem
            key={action.key}
            icon={action.icon}
            label={action.label}
            description={action.description}
            onClick={() => onActionClick?.(action.key)}
          />
        ))}
      </div>

      <div className="space-y-2">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("Subscription")}
        </p>

        <PlanCard
          planLabel={planLabel}
          projectsUsed={projectsUsed}
          projectsLimit={projectsLimit}
          onPlansClick={onPlansClick}
        />
      </div>

      <div className="space-y-2">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("Support")}
        </p>

        <SupportSection
          clientId={userId}
          onHelpClick={onHelpClick}
        />
      </div>
    </div>
  )
}
