import type { SubscriptionMenuProps } from "./types"

export function getStatusLabel(
  status: SubscriptionMenuProps["status"],
) {
  switch (status) {
    case "trialing":
      return "Période d'essai"

    case "active":
      return "Actif"

    case "past_due":
      return "Paiement en retard"

    case "canceled":
      return "Annulé"

    case "unpaid":
      return "Impayé"

    case "none":
    default:
      return "Aucun abonnement"
  }
}

export function formatPaymentDate(
  date: Date | string,
) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export function formatPaymentAmount(
  amount: number,
  currency: string,
) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount)
}

export function getPlanLabel(type: SubscriptionMenuProps["type"]) {
  switch (type) {
    case "premium":
      return "Premium"

    case "pro":
      return "Pro"

    case "free":
    default:
      return "Free"
  }
}