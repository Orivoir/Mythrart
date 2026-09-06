import type { ReactNode } from "react"

import type {
  PlanType,
  SubscriptionStatus,
} from "@mythrart/database"

export interface SubscriptionMenuProps {
  trigger: ReactNode
  type: PlanType
  status: SubscriptionStatus

  nextPaymentDate?: Date | string | null
  nextPaymentAmount?: number | null
  currency?: string

  onBillingClick?: () => void
  onPlansClick?: () => void
}