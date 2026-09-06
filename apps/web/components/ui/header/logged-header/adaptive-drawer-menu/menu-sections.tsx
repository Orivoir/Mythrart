"use client"

import type { DrawerMenuActionKey } from "./menu-data"
import { DRAWER_MENU_ACTIONS } from "./menu-data"
import { MenuActionItem } from "./menu-action-item"
import { PlanCard } from "./plan-card"
import { SupportSection } from "./support-section"

export type DrawerMenuSectionsProps = {
  planLabel?: string
  projectsUsed?: number
  projectsLimit?: number
  clientId?: string
  onActionClick?: (key: DrawerMenuActionKey) => void
  onPlansClick?: () => void
  onHelpClick?: () => void
}

export function DrawerMenuSections({
  planLabel,
  projectsUsed,
  projectsLimit,
  clientId,
  onActionClick,
  onPlansClick,
  onHelpClick,
}: DrawerMenuSectionsProps) {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-1">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Raccourcis
        </p>

        {DRAWER_MENU_ACTIONS.map((action) => (
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
          Abonnement
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
          Support
        </p>

        <SupportSection
          clientId={clientId}
          onHelpClick={onHelpClick}
        />
      </div>
    </div>
  )
}
