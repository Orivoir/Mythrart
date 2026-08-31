import { PrismaClient } from "./app/generated/prisma/index.js"

import { PrismaPg } from "@prisma/adapter-pg"

import {loadEnv} from "@mythrart/env"

loadEnv()

const connectionString = process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL or TEST_DATABASE_URL is required to initialize Prisma client")
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
}

const adapter = new PrismaPg({ connectionString })

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    adapter,
  })
}

function hasAuthModels(client: PrismaClient): boolean {
  const candidate = client as unknown as {
    user?: unknown;
    account?: unknown;
    verificationToken?: unknown;
  }

  return Boolean(candidate.user && candidate.account && candidate.verificationToken)
}

const cachedPrisma = globalForPrisma.prisma

export const prisma =
  cachedPrisma && hasAuthModels(cachedPrisma)
    ? cachedPrisma
    : createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// expose runtime enums (avoid `export *` from a CJS module, which breaks edge/middleware bundling)
export {
  PlanType,
  AssetReferenceType,
  CollaborationRole,
  CollaborationPermission,
  UploadHandshakeStatus,
} from "./app/generated/prisma/index.js"

// expose type schemas
export type {
  Chapter,
  EbookCollaborator,
  EbookCustomRole,
} from "./app/generated/prisma/index.js"

// expose type Prisma
export type {JsonValue} from "./app/generated/prisma/runtime/client.js"