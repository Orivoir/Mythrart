import type { Subscription } from "@/components/api/types"

export type PlanLabel = "Plan Premium" | "Plan Pro" | "Plan Free"

export function getPlanLabel(subscription: Subscription): PlanLabel {
  switch (subscription.type) {
    case "premium":
      return "Plan Premium"

    case "pro":
      return "Plan Pro"

    case "free":
    default:
      return "Plan Free"
  }
}

export function getSubscriptionLabel(subscription: Subscription): string {
  switch (subscription.status) {
    case "trialing":
      return "Période d'essai"

    case "active":
      return getPlanLabel(subscription)

    case "past_due":
      return "Paiement en retard"

    case "canceled":
      return "Abonnement annulé"

    case "unpaid":
      return "Paiement impayé"

    case "none":
    default:
      return getPlanLabel(subscription)
  }
}

export function getLocaleLabel(locale: string) {
  switch (locale.toLowerCase()) {
    case "fr":
    case "fr-fr":
      return "Français (FR)"

    case "en":
    case "en-gb":
      return "English (EN)"

    case "en-us":
      return "English (US)"

    default:
      return locale
  }
}

export function getLocaleCode(locale: string): string {
  const language = locale.split("-")[0].toLowerCase()

  switch (language) {
    case "fr":
      return "FR"

    case "en":
      return "EN"

    default:
      return language.toUpperCase()
  }
}