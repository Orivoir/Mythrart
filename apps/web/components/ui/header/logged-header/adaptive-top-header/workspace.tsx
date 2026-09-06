"use client"

import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import type {
  Subscription,
  User,
} from "@/components/api/types"
import { AppLink } from "@/components/ui/app-link"
import { BrandName } from "@/components/ui/brand/brand-name"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { FloatingSearch } from "@/components/ui/floating-search"
import { NavigationItem } from "@/components/ui/navigation-item"
import { Notification } from "@/components/ui/notifications"
import type { SuggestionsData } from "@/components/ui/suggestion-ressource/types"

import { useTopNavItems } from "./nav-items"
import { UserAvatarMenu } from "./user-avatar-menu"

export type WorkspaceTopHeaderProps = {
  mode: "quick" | "workspace"
  user?: User
  subscription?: Subscription
  notificationsCount?: number
  suggestions?: SuggestionsData
  onNewProject?: () => void
  onNotificationsClick?: () => void
}

export function WorkspaceTopHeader({
  mode,
  user,
  subscription,
  notificationsCount = 0,
  suggestions = [],
  onNewProject,
  onNotificationsClick,
}: WorkspaceTopHeaderProps) {
  const pathname = usePathname()
  const t = useTranslations("Header.Logged.TopHeader")
  const topNavItems = useTopNavItems()
  const isQuick = mode === "quick"

  const items = isQuick
    ? topNavItems.filter((item) => item.quickWorkspace)
    : topNavItems

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-16
        w-full
        items-center
        gap-4
        border-b
        border-border
        bg-background
        px-4
        md:px-6
      "
    >
      <AppLink
        href="/dashboard"
        mutedOnHover={false}
        className="shrink-0"
      >
        <BrandName size="sm" />
      </AppLink>

      <nav
        aria-label={t("NavAriaLabel")}
        className="flex shrink-0 items-center gap-1"
      >
        {items.map((item) => (
          <NavigationItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={pathname === item.href}
            withTitle={!isQuick}
          />
        ))}
      </nav>

      <div className={isQuick ? "max-w-sm flex-1" : "max-w-xl flex-1"}>
        <FloatingSearch suggestions={suggestions} />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ButtonWithIcon
          type="button"
          icon={Plus}
          iconPosition="left"
          iconSize="sm"
          onClick={onNewProject}
        >
          {t("NewProject")}
        </ButtonWithIcon>

        <Notification
          count={notificationsCount}
          onClick={onNotificationsClick}
        />

        <UserAvatarMenu
          user={user}
          subscription={subscription}
        />
      </div>
    </header>
  )
}
