// proxy of archived: (https://github.com/Orivoir/mythart/blob/main/worker/src/config/prisma.ts)

import {prisma, PrismaClient} from "@mythrart/database"

export function createPrismaClient(): PrismaClient {
  return prisma
}

export function getPrisma() {
  return prisma
}

export async function connectPrisma()  {
  const client = getPrisma()
  await client.$connect()

  return client
}

export function hasAuthModels(client: PrismaClient): boolean {
  const candidate = client as unknown as {
    user?: unknown;
    account?: unknown;
    verificationToken?: unknown;
  }

  return Boolean(candidate.user && candidate.account && candidate.verificationToken)
}

export async function closePrisma(): Promise<void> {
  if (!prisma) {
    return
  }

  await prisma.$disconnect()
}
