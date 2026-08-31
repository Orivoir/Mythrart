import prisma from "./prisma"
import type { CreateEbookRequestAPI } from "../../app/types/api/ebook"
import { PlanType } from "@mythrart/database"

interface CreateUserFixtureOptions {
  plan?: PlanType
}

export async function createUserFixture({ plan = PlanType.free }: CreateUserFixtureOptions = {}) {
  const idSuffix = Date.now()

  return prisma.user.create({
    data: {
      email: `fixture-${idSuffix}@example.com`,
      name: "Fixture User",
      emailVerified: new Date(),
      stripeCustomerId: `cus_fixture_${idSuffix}`,
      plan,
    },
  })
}

export async function createPremiumUserFixture() {
  return createUserFixture({ plan: PlanType.premium })
}

export async function createProUserFixture() {
  return createUserFixture({ plan: PlanType.pro })
}

export async function createEbooksFixture(
  ownerId: string,
  ebooks: CreateEbookRequestAPI[],
): Promise<number> {
  if (ebooks.length === 0) {
    return 0
  }

  const result = await prisma.ebook.createMany({
    data: ebooks.map((ebook) => ({
      title: ebook.title,
      subtitle: ebook.subtitle,
      shortDescription: ebook.shortDescription,
      ownerId,
    })),
  })

  return result.count
}
