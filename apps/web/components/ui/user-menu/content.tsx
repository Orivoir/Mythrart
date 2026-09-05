"use client"

import {
  CircleHelp,
  Crown,
  Globe,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react"

import type { Subscription, User } from "@/components/api/types"

import { Chip } from "@/components/ui/chip"
import { UserMenuItem } from "./item"
import { UserIdentity } from "./identity"
import {
  getLocaleCode,
  getLocaleLabel,
  getSubscriptionLabel
} from "./utils"

interface UserMenuContentProps {
  user?: User
  subscription?: Subscription
  currentLocale?: string

  onSubscriptionClick?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLanguageClick?: () => void
  onHelpClick?: () => void
  onLogoutClick?: () => void
}

export function UserMenuContent({
  user,
  subscription,
  currentLocale = "fr-FR",
  onSubscriptionClick,
  onProfileClick,
  onSettingsClick,
  onLanguageClick,
  onHelpClick,
  onLogoutClick,
}: UserMenuContentProps) {
  return (
    <div className="mx-auto w-full max-w-sm p-4">
      <UserIdentity
        user={user}
        subscription={subscription}
      />

      <div className="my-4 h-px bg-border" />

      <div className="space-y-1">
        <UserMenuItem
          icon={Crown}
          label="État de l'abonnement"
          description={
            subscription
              ? getSubscriptionLabel(subscription)
              : undefined
          }
          loading={!subscription}
          onClick={onSubscriptionClick}
          chevron
        />

        <UserMenuItem
          icon={UserRound}
          label="Profil"
          description="Voir et modifier votre profil"
          onClick={onProfileClick}
        />

        <UserMenuItem
          icon={Settings}
          label="Paramètres"
          description="Préférences et compte"
          onClick={onSettingsClick}
        />

        <UserMenuItem
          icon={Globe}
          label="Langue"
          description={getLocaleLabel(currentLocale)}
          trailing={
            <Chip className="px-2 py-0.5 text-xs">
              {getLocaleCode(currentLocale)}
            </Chip>
          }
          onClick={onLanguageClick}
          chevron
        />
      </div>

      <div className="my-4 h-px bg-border" />

      <UserMenuItem
        icon={CircleHelp}
        label="Centre d'aide"
        description="Obtenir de l'aide et nous contacter"
        onClick={onHelpClick}
      />

      <div className="my-4 h-px bg-border" />

      <UserMenuItem
        icon={LogOut}
        label="Déconnexion"
        variant="danger"
        onClick={onLogoutClick}
      />
    </div>
  )
}