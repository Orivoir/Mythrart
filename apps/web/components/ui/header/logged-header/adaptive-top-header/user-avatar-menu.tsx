"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import {
  ChevronDown,
  CircleHelp,
  Crown,
  Globe,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react"

import type {
  Subscription,
  User,
} from "@/components/api/types"
import Avatar from "@/components/ui/avatar"
import { Chip } from "@/components/ui/chip"
import { LanguageMenu } from "@/components/ui/language-menu"
import type { AvailableLanguage } from "@/components/ui/language-menu/types"
import { UserMenu } from "@/components/ui/user-menu"
import {
  getLocaleCode,
  getLocaleLabel,
  getSubscriptionLabel,
} from "@/components/ui/user-menu/utils"

const DEFAULT_AVAILABLE_LANGUAGES: AvailableLanguage[] = [
  {
    locale: "fr",
    label: "Français",
    code: "FR",
    countryCode: "FR",
  },
  {
    locale: "en",
    label: "English",
    code: "EN",
    countryCode: "GB",
  },
]

export type UserAvatarMenuProps = {
  user?: User
  subscription?: Subscription
  availableLanguages?: AvailableLanguage[]
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onHelpClick?: () => void
  onLogout?: () => void
  onLanguageChange?: (locale: string) => void
}

/** Avatar trigger + adaptive menu shared by every top header variant. */
export function UserAvatarMenu({
  user,
  subscription,
  availableLanguages = DEFAULT_AVAILABLE_LANGUAGES,
  onProfileClick,
  onSettingsClick,
  onHelpClick,
  onLogout,
  onLanguageChange,
}: UserAvatarMenuProps) {
  const [open, setOpen] = useState(false)
  const currentLocale = useLocale()

  return (
    <UserMenu>
      <UserMenu.Layout
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button
            type="button"
            aria-label="Menu utilisateur"
            className="
              flex
              shrink-0
              items-center
              gap-1
              rounded-full
              p-1
              transition-colors
              duration-150
              hover:bg-muted/5
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary/30
            "
          >
            {user ? (
              <Avatar
                image={user.image ?? undefined}
                email={user.email}
                alt={user.name}
                size="md"
              />
            ) : (
              <div
                className="size-8 shrink-0 animate-pulse rounded-full bg-muted"
                aria-hidden="true"
              />
            )}

            <ChevronDown
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </button>
        }
      >
        <UserMenu.Content>
          <UserMenu.Identity
            user={user}
            subscription={subscription}
          />

          <div className="my-4 h-px bg-border" />

          <div className="space-y-1">
            {subscription && (
              <UserMenu.Action
                icon={Crown}
                label="État de l'abonnement"
                description={getSubscriptionLabel(subscription)}
                chevron
              />
            )}

            <UserMenu.Action
              icon={UserRound}
              label="Profil"
              description="Voir et modifier votre profil"
              onClick={onProfileClick}
            />

            <UserMenu.Action
              icon={Settings}
              label="Paramètres"
              description="Préférences et compte"
              onClick={onSettingsClick}
            />

            <UserMenu.Action
              icon={Globe}
              label="Langue"
              description={getLocaleLabel(currentLocale)}
              trailing={
                <Chip className="px-2 py-0.5 text-xs">
                  {getLocaleCode(currentLocale)}
                </Chip>
              }
              chevron
              renderMenu={(trigger) => (
                <LanguageMenu
                  trigger={trigger}
                  availableLanguages={availableLanguages}
                  currentLocale={currentLocale}
                  onLanguageChange={onLanguageChange}
                />
              )}
            />
          </div>

          <div className="my-4 h-px bg-border" />

          <UserMenu.Action
            icon={CircleHelp}
            label="Centre d'aide"
            description="Obtenir de l'aide et nous contacter"
            onClick={onHelpClick}
          />

          <div className="my-4 h-px bg-border" />

          <UserMenu.Action
            icon={LogOut}
            label="Déconnexion"
            variant="danger"
            onClick={onLogout}
          />
        </UserMenu.Content>
      </UserMenu.Layout>
    </UserMenu>
  )
}
