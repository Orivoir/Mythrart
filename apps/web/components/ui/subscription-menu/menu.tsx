"use client"

import {
  ChevronRight,
  CreditCard,
} from "lucide-react"

import { useAdaptiveSurface } from "@/components/hooks/useAdaptiveSurface"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { Separator } from "@/components/ui/Separator"
import { Text } from "@/components/ui/Typography"

import CurrentSubscription from "./current-subscription"
import { NextBilling } from "./next-billing"

import type { SubscriptionMenuProps } from "./types"
import {
  getPlanLabel,
  getStatusLabel,
} from "./utils"

export function SubscriptionMenu({
  trigger,
  type,
  status,
  nextPaymentDate,
  nextPaymentAmount,
  currency = "EUR",
  onBillingClick,
  onPlansClick,
}: SubscriptionMenuProps) {
  const { Surface } = useAdaptiveSurface()

  const planLabel = getPlanLabel(type)
  const statusLabel = getStatusLabel(status)

  const hasSubscription =
    type !== "free" &&
    (status === "active" || status === "trialing")

  const hasNextPayment =
    hasSubscription &&
    nextPaymentDate != null &&
    nextPaymentAmount != null

  return (
    <Surface trigger={trigger}>
      <div className="w-fit p-2">
        <CurrentSubscription
          planLabel={planLabel}
          statusLabel={statusLabel}
        />

        {hasNextPayment && (
          <NextBilling
            nextPaymentDate={nextPaymentDate}
            nextPaymentAmount={nextPaymentAmount}
            currency={currency}
          />
        )}

        <Separator className="my-2" />

        <div className="w-fit space-y-1 flex flex-col">
          <ButtonWithIcon
            type="button"
            icon={CreditCard}
            iconPosition="left"
            iconSize="md"
            variant="ghost"
            className="
              h-auto
              min-h-11
              w-full
              justify-start
              rounded-lg
              px-2
              py-2
              text-left
            "
            onClick={onBillingClick}
          >
            <span className="min-w-0 flex-1">
              <Text className="font-medium">
                Facturation
              </Text>

              <Text
                variant="muted"
                className="text-xs"
              >
                Voir vos factures et paiements
              </Text>
            </span>

            <ChevronRight
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </ButtonWithIcon>

          <ButtonWithIcon
            type="button"
            icon={CreditCard}
            iconPosition="left"
            iconSize="md"
            variant="ghost"
            className="
              h-auto
              min-h-11
              w-full
              justify-start
              rounded-lg
              px-2
              py-2
              text-left
            "
            onClick={onPlansClick}
          >
            <span className="min-w-0 flex-1">
              <Text className="font-medium">
                {hasSubscription
                  ? "Changer d'offre"
                  : "Comparer les offres"}
              </Text>

              <Text
                variant="muted"
                className="text-xs"
              >
                Découvrez les offres disponibles
              </Text>
            </span>

            <ChevronRight
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </ButtonWithIcon>
        </div>
      </div>
    </Surface>
  )
}