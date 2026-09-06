"use client"

import { useState } from "react"
import {
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

import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { LanguageMenu } from "@/components/ui/language-menu"
import { SubscriptionMenu } from "@/components/ui/subscription-menu"
import { UserMenu } from "@/components/ui/user-menu"
import {
  getLocaleCode,
  getLocaleLabel,
  getSubscriptionLabel,
} from "@/components/ui/user-menu/utils"

const user: User = {
  id: "user-1",
  name: "Samuel",
  email: "samuel@example.com",
  image: undefined,
}

const subscription: Subscription = {
  type: "premium",
  status: "active",
}

const currentLocale = "fr-FR"

const availableLanguages = [
  {
    locale: "fr-FR",
    label: "Français",
    code: "FR",
    countryCode: "FR" as const,
  },
  {
    locale: "en-GB",
    label: "English",
    code: "EN",
    countryCode: "GB" as const,
  },
]

export default function RichUserMenuFixtures() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-[600px] items-start justify-center p-10">
      <UserMenu>
        <UserMenu.Layout
          open={open}
          onOpenChange={setOpen}
          trigger={
            <Button
              type="button"
              variant="outline"
            >
              Ouvrir le Rich UserMenu
            </Button>
          }
        >
          <UserMenu.Content>
            <UserMenu.Identity
              user={user}
              subscription={subscription}
            />

            <div className="my-4 h-px bg-border" />

            <div className="space-y-1">
              <UserMenu.Action
                icon={Crown}
                label="État de l'abonnement"
                description={getSubscriptionLabel(subscription)}
                chevron
                renderMenu={(trigger) => (
                  <SubscriptionMenu
                    trigger={trigger}
                    type={subscription.type}
                    status={subscription.status}
                    nextPaymentDate="2026-10-06"
                    nextPaymentAmount={9.99}
                    currency="EUR"
                    onBillingClick={() => {
                      console.log("Billing")
                    }}
                    onPlansClick={() => {
                      console.log("Plans")
                    }}
                  />
                )}
              />

              <UserMenu.Action
                icon={UserRound}
                label="Profil"
                description="Voir et modifier votre profil"
                onClick={() => {
                  console.log("Profile")
                }}
              />

              <UserMenu.Action
                icon={Settings}
                label="Paramètres"
                description="Préférences et compte"
                onClick={() => {
                  console.log("Settings")
                }}
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
                    onLanguageChange={(locale) => {
                      console.log("Language changed:", locale)
                    }}
                  />
                )}
              />
            </div>

            <div className="my-4 h-px bg-border" />

            <UserMenu.Action
              icon={CircleHelp}
              label="Centre d'aide"
              description="Obtenir de l'aide et nous contacter"
              onClick={() => {
                console.log("Help")
              }}
            />

            <div className="my-4 h-px bg-border" />

            <UserMenu.Action
              icon={LogOut}
              label="Déconnexion"
              variant="danger"
              onClick={() => {
                console.log("Logout")
              }}
            />
          </UserMenu.Content>
        </UserMenu.Layout>
      </UserMenu>
    </div>
  )
}