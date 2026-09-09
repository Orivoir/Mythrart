import { Users } from "lucide-react"

import { Tooltip } from "@/components/ui/tooltip"
import { Text, Title } from "@/components/ui/Typography"

export function StepFourHeader() {
  return (
    <div className="flex items-start gap-4">
      <div
        className="
          flex size-14 shrink-0 items-center justify-center
          rounded-lg bg-soft-blue text-accent
        "
      >
        <Users className="size-7" />
      </div>

      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <Title>
            Collaborateurs
          </Title>

          <Tooltip
            content="Invitez d'autres personnes à participer à votre projet."
          >
            <span
              className="
                inline-flex size-5 cursor-help items-center
                justify-center rounded-full
                text-muted-foreground
              "
            >
              <Users className="size-4" />
            </span>
          </Tooltip>
        </div>

        <Text variant="muted">
          Invitez d'autres personnes à collaborer sur ce projet.
          Vous pourrez modifier les accès plus tard.
        </Text>
      </div>
    </div>
  )
}