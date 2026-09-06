import { Crown } from "lucide-react"
import { Chip } from "@/components/ui/chip"


import {getPlanLabel, getStatusLabel} from "./utils"

export interface CurrentSubscriptionProps {
  planLabel: ReturnType<typeof getPlanLabel>
  statusLabel: ReturnType<typeof getStatusLabel>
}

export default function CurrentSubscription({
  planLabel,
  statusLabel,
}: CurrentSubscriptionProps) {

  return (
    <div className="rounded-lg bg-soft-blue p-3 w-full">
      <div className="flex items-start gap-3 w-fit">
        <div
          className="
            flex size-10 shrink-0 items-center
            justify-center rounded-full
            bg-primary/10 text-primary
          "
        >
          <Crown
            className="size-5"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">
            Abonnement actuel
          </p>

          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm font-semibold">
              {planLabel}
            </p>

            <Chip className="px-2 py-0.5 text-xs">
              {statusLabel}
            </Chip>
          </div>
        </div>
      </div>
    </div>
  )
}