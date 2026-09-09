import { Crown, Lock } from "lucide-react"

import { AppLink } from "@/components/ui/app-link"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { Chip } from "@/components/ui/chip"

export function PremiumRoleBox() {
  return (
    <div
      className="
        flex flex-col gap-4 rounded-lg
        bg-soft-blue p-4
        sm:flex-row sm:items-center
        sm:justify-between
      "
    >
      <div className="flex items-start gap-3">
        <div
          className="
            flex size-10 shrink-0 items-center
            justify-center rounded bg-background
            text-accent
          "
        >
          <Crown className="size-5" />
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-medium text-foreground">
              Créer un rôle personnalisé
            </h4>

            <Chip>Premium</Chip>
          </div>

          <p className="text-sm text-muted-foreground">
            Définissez des permissions précises selon les
            besoins de votre équipe.
          </p>
        </div>
      </div>

      <ButtonWithIcon
        asChild
        variant="accent-outline"
        size="sm"
        icon={Lock}
      >
        <AppLink
          href="/billing"
          mutedOnHover={false}
        >
          Essayer gratuitement
        </AppLink>
      </ButtonWithIcon>
    </div>
  )
}