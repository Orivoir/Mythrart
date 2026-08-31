import type { AuthOptions } from "next-auth"
import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

import { prisma } from "@mythrart/database"

export const authSecret = process.env.AUTH_SECRET
export const AUTH_USER_ID_HEADER = "x-auth-user-id"

// create a fake stripe customer id for the user, since we don't have stripe integration yet
// should be call at the time of user pay a subscription, and then store it in the user table
export async function createStripeCustomerId(): Promise<string> {
  return `cus_${Math.random().toString(36).slice(2, 12)}`
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    async signIn({ user, profile, email }) {
      if (!user.email) {
        return false
      }

      if (email?.verificationRequest) {
        return true
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: {
          id: true,
          stripeCustomerId: true,
          emailVerified: true,
        },
      })

      if (existingUser) {
        const shouldUpdate = !existingUser.emailVerified

        if (shouldUpdate) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              ...(existingUser.emailVerified ? {} : { emailVerified: new Date() })
            },
          })
        }

        return true
      }

      await prisma.user.create({
        data: {
          email: user.email,
          name: user.name ?? profile?.name ?? null,
          emailVerified: new Date()
        },
      })

      return true
    },
  },

  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify-request",
  },

  secret: authSecret,
}

const handler = NextAuth(authOptions)

export default handler

export async function getAuthenticatedUserId(request: NextRequest): Promise<string | null> {
  const token = await getToken({ req: request, secret: authSecret })

  return token?.sub ?? null
}

export function getAuthenticatedUserIdFromHeaders(headers: Headers): string | null {
  const userId = headers.get(AUTH_USER_ID_HEADER)

  return userId && userId.length > 0 ? userId : null
}