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
  type: "free",
  status: "active",
}

const currentLocale = "fr-FR"

export default function UserMenuFixtures() {
  const [loadedOpen, setLoadedOpen] = useState(false)
  const [userLoadingOpen, setUserLoadingOpen] = useState(false)
  const [subscriptionLoadingOpen, setSubscriptionLoadingOpen] =
    useState(false)
  const [bothLoadingOpen, setBothLoadingOpen] = useState(false)

  return (
    <div className="space-y-12 p-10">
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">
            User Menu
          </h2>

          <p className="text-sm text-muted-foreground">
            Menu utilisateur adaptatif avec chargement granulaire
            des données utilisateur et abonnement.
          </p>
        </div>

        <div className="flex flex-wrap items-start gap-4">
          {/* Loaded */}
          <UserMenu>
            <UserMenu.Layout
              open={loadedOpen}
              onOpenChange={setLoadedOpen}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                >
                  Ouvrir le menu loaded
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
                  />

                  <UserMenu.Action
                    icon={UserRound}
                    label="Profil"
                    description="Voir et modifier votre profil"
                  />

                  <UserMenu.Action
                    icon={Settings}
                    label="Paramètres"
                    description="Préférences et compte"
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
                  />
                </div>

                <div className="my-4 h-px bg-border" />

                <UserMenu.Action
                  icon={CircleHelp}
                  label="Centre d'aide"
                  description="Obtenir de l'aide et nous contacter"
                />

                <div className="my-4 h-px bg-border" />

                <UserMenu.Action
                  icon={LogOut}
                  label="Déconnexion"
                  variant="danger"
                />
              </UserMenu.Content>
            </UserMenu.Layout>
          </UserMenu>

          {/* User loading */}
          <UserMenu>
            <UserMenu.Layout
              open={userLoadingOpen}
              onOpenChange={setUserLoadingOpen}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                >
                  Ouvrir le menu user is loading
                </Button>
              }
            >
              <UserMenu.Content>
                <UserMenu.Identity
                  subscription={subscription}
                />

                <div className="my-4 h-px bg-border" />

                <div className="space-y-1">
                  <UserMenu.Action
                    icon={Crown}
                    label="État de l'abonnement"
                    description={getSubscriptionLabel(subscription)}
                    chevron
                  />

                  <UserMenu.Action
                    icon={UserRound}
                    label="Profil"
                    description="Voir et modifier votre profil"
                  />

                  <UserMenu.Action
                    icon={Settings}
                    label="Paramètres"
                    description="Préférences et compte"
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
                  />
                </div>

                <div className="my-4 h-px bg-border" />

                <UserMenu.Action
                  icon={CircleHelp}
                  label="Centre d'aide"
                  description="Obtenir de l'aide et nous contacter"
                />

                <div className="my-4 h-px bg-border" />

                <UserMenu.Action
                  icon={LogOut}
                  label="Déconnexion"
                  variant="danger"
                />
              </UserMenu.Content>
            </UserMenu.Layout>
          </UserMenu>

          {/* Subscription loading */}
          <UserMenu>
            <UserMenu.Layout
              open={subscriptionLoadingOpen}
              onOpenChange={setSubscriptionLoadingOpen}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                >
                  Ouvrir le menu subscription is loading
                </Button>
              }
            >
              <UserMenu.Content>
                <UserMenu.Identity
                  user={user}
                />

                <div className="my-4 h-px bg-border" />

                <div className="space-y-1">
                  <UserMenu.Action
                    icon={Crown}
                    label="État de l'abonnement"
                    loading
                    chevron
                  />

                  <UserMenu.Action
                    icon={UserRound}
                    label="Profil"
                    description="Voir et modifier votre profil"
                  />

                  <UserMenu.Action
                    icon={Settings}
                    label="Paramètres"
                    description="Préférences et compte"
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
                  />
                </div>

                <div className="my-4 h-px bg-border" />

                <UserMenu.Action
                  icon={CircleHelp}
                  label="Centre d'aide"
                  description="Obtenir de l'aide et nous contacter"
                />

                <div className="my-4 h-px bg-border" />

                <UserMenu.Action
                  icon={LogOut}
                  label="Déconnexion"
                  variant="danger"
                />
              </UserMenu.Content>
            </UserMenu.Layout>
          </UserMenu>

          {/* Both loading */}
          <UserMenu>
            <UserMenu.Layout
              open={bothLoadingOpen}
              onOpenChange={setBothLoadingOpen}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                >
                  Ouvrir le menu both is loading
                </Button>
              }
            >
              <UserMenu.Content>
                <UserMenu.Identity />

                <div className="my-4 h-px bg-border" />

                <div className="space-y-1">
                  <UserMenu.Action
                    icon={Crown}
                    label="État de l'abonnement"
                    loading
                    chevron
                  />

                  <UserMenu.Action
                    icon={UserRound}
                    label="Profil"
                    description="Voir et modifier votre profil"
                  />

                  <UserMenu.Action
                    icon={Settings}
                    label="Paramètres"
                    description="Préférences et compte"
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
                  />
                </div>

                <div className="my-4 h-px bg-border" />

                <UserMenu.Action
                  icon={CircleHelp}
                  label="Centre d'aide"
                  description="Obtenir de l'aide et nous contacter"
                />

                <div className="my-4 h-px bg-border" />

                <UserMenu.Action
                  icon={LogOut}
                  label="Déconnexion"
                  variant="danger"
                />
              </UserMenu.Content>
            </UserMenu.Layout>
          </UserMenu>
        </div>
      </section>
    </div>
  )
}