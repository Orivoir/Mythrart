"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Headphones,
  LogOut,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { AppLink } from "@/components/ui/app-link"
import { BrandName } from "@/components/ui/brand/brand-name"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { useDrawerMenuActions } from "./menu-data"
import { DrawerMenuSections } from "./menu-sections"
import type { DrawerMenuSectionsProps } from "./menu-sections"

export type WorkspaceSidebarMenuProps = DrawerMenuSectionsProps & {
  onLogout?: () => void
  userId?: string
}

/** Fixed left sidebar with an expanded (labels) and reduced (icons only) state. */
export function WorkspaceSidebarMenu({
  onLogout,
  onActionClick,
  onPlansClick,
  onHelpClick,
  userId,
  ...sectionsProps
}: WorkspaceSidebarMenuProps) {
  const [collapsed, setCollapsed] = useState(false)
  const t = useTranslations("Header.Logged.DrawerMenu.Workspace")
  const brandT = useTranslations("Brand")
  const drawerMenuActions = useDrawerMenuActions()

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r border-border bg-background transition-[width] duration-200",
        collapsed ? "w-16" : "w-72"
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border",
          collapsed ? "justify-center" : "justify-start px-4"
        )}
      >
        <AppLink href="/dashboard" mutedOnHover={false}>
          {collapsed ? (
            <span
              className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
              aria-label={brandT("Name")}
            >
              M
            </span>
          ) : (
            <BrandName size="sm" />
          )}
        </AppLink>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {collapsed ? (
          <div className="flex flex-col items-center gap-1 py-4">
            {drawerMenuActions.map((action) => (
              <Button
                key={action.key}
                type="button"
                variant="ghost"
                size="icon"
                title={action.label}
                aria-label={action.label}
                onClick={() => onActionClick?.(action.key)}
              >
                <action.icon className="size-5" aria-hidden="true" />
              </Button>
            ))}

            <div className="my-2 h-px w-8 bg-border" />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              title={t("SubscriptionAria")}
              aria-label={t("SubscriptionAria")}
              onClick={onPlansClick}
            >
              <Crown className="size-5" aria-hidden="true" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              title={t("HelpAria")}
              aria-label={t("HelpAria")}
              onClick={onHelpClick}
            >
              <Headphones className="size-5" aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <DrawerMenuSections
            userId={userId}
            {...sectionsProps}
            onActionClick={onActionClick}
            onPlansClick={onPlansClick}
            onHelpClick={onHelpClick}
          />
        )}
      </div>

      <div
        className={cn(
          "shrink-0 border-t border-border p-2",
          collapsed && "flex justify-center"
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className={collapsed ? "" : "w-full justify-start gap-2"}
          title={t("Logout")}
          aria-label={t("Logout")}
          onClick={onLogout}
        >
          <LogOut className="size-5" aria-hidden="true" />

          {!collapsed && t("Logout")}
        </Button>
      </div>

      <button
        type="button"
        aria-label={collapsed ? t("ExpandAria") : t("CollapseAria")}
        onClick={() => setCollapsed((value) => !value)}
        className="
          absolute
          -right-3
          top-1/2
          z-30
          flex
          size-6
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          bg-primary
          text-primary-foreground
          shadow-md
        "
      >
        {collapsed ? (
          <ChevronRight className="size-3.5" aria-hidden="true" />
        ) : (
          <ChevronLeft className="size-3.5" aria-hidden="true" />
        )}
      </button>
    </aside>
  )
}
