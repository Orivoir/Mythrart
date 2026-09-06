import type { PlanType, SubscriptionStatus } from "@mythrart/database"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      plan: PlanType
      subscriptionStatus: SubscriptionStatus
      id: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan?: PlanType
    subscriptionStatus?: SubscriptionStatus
  }
}

