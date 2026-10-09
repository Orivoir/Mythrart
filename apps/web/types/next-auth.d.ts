import type { User } from "@mythrart/database"

type SessionUser = Pick<
  User,
  | "id"
  | "email"
  | "firstName"
  | "lastName"
  | "username"
  | "plan"
  | "subscriptionStatus"
  | "image"
>

declare module "next-auth" {
  interface Session {
    user?: SessionUser
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan?: User["plan"]
    subscriptionStatus?: User["subscriptionStatus"]
  }
}
