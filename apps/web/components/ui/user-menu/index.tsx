"use client"

import type { ReactNode } from "react"

import type { Subscription, User } from "@/components/api/types"
import { useAdaptiveSurface } from "@/components/hooks/useAdaptiveSurface"

import Avatar from "@/components/ui/avatar"
import { UserMenuContent } from "./content"

export interface UserMenuProps {
  subscription?: Subscription
  user?: User
  currentLocale?: string

  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void

  onSubscriptionClick?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLanguageClick?: () => void
  onHelpClick?: () => void
  onLogoutClick?: () => void
}

export function UserMenu({
  subscription,
  user,
  currentLocale = "fr-FR",
  trigger,
  open,
  onOpenChange,
  onSubscriptionClick,
  onProfileClick,
  onSettingsClick,
  onLanguageClick,
  onHelpClick,
  onLogoutClick,
}: UserMenuProps) {
  const { Surface } = useAdaptiveSurface()

  const defaultTrigger = user ? (
    <button
      type="button"
      aria-label="Ouvrir le menu utilisateur"
      className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <Avatar
        image={user.image ?? undefined}
        email={user.email}
        alt={user.name}
        size="md"
      />
    </button>
  ) : (
    <button
      type="button"
      aria-label="Ouvrir le menu utilisateur"
      className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <div className="size-10 animate-pulse rounded-full bg-muted" />
    </button>
  )

  return (
    <Surface
      trigger={trigger ?? defaultTrigger}
      open={open}
      onOpenChange={onOpenChange}
    >
      <UserMenuContent
        user={user}
        subscription={subscription}
        currentLocale={currentLocale}
        onSubscriptionClick={onSubscriptionClick}
        onProfileClick={onProfileClick}
        onSettingsClick={onSettingsClick}
        onLanguageClick={onLanguageClick}
        onHelpClick={onHelpClick}
        onLogoutClick={onLogoutClick}
      />
    </Surface>
  )
}