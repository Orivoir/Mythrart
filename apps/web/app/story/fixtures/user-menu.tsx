"use client"

import { useState } from "react"

import type {
  Subscription,
  User,
} from "@/components/api/types"

import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/ui/user-menu"

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
          <UserMenu
            user={user}
            subscription={subscription}
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
          />

          <UserMenu
            subscription={subscription}
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
          />

          <UserMenu
            user={user}
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
          />

          <UserMenu
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
          />
        </div>
      </section>
    </div>
  )
}