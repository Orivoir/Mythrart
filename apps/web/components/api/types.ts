import type {PlanType, SubscriptionStatus} from "@mythrart/database"

export interface Subscription {
  type: PlanType
  status: SubscriptionStatus
}

export interface User {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string | null | undefined;
  plan: PlanType;
  subscriptionStatus: SubscriptionStatus
}