import { randomUUID } from "node:crypto"

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

export async function createEbookTypeFixture() {
  return prisma.ebookType.create({
    data: {
      name: "Roman",
      slug: `roman-integration-test-${randomUUID()}`,
      description: "Integration test ebook type",
    },
    select: {
      id: true,
    },
  })
}

export async function createEbookThemeFixture() {
  return prisma.ebookTheme.create({
    data: {
      name: "Classique",
      slug: `classique-integration-test-${randomUUID()}`,
      description: "Integration test ebook theme",
      backgroundColor: "#ffffff",
      textColor: "#374151",
      textFont: "Inter",
      titleFont: "Inter",
      subtitleFont: "Inter",
      headingColor: "#1e3a5f",
      fontSize: "16px",
      lineHeight: "1.6",
      paragraphSpacing: "1rem",
      headingSpacing: "1.5rem",
    },
    select: {
      id: true,
    },
  })
}

export async function createEbooksFixture(
  ownerId: string,
  ebooks: CreateEbookRequestAPI[],
): Promise<number> {
  if (ebooks.length === 0) {
    return 0
  }

  const ebookType = await createEbookTypeFixture()
  const ebookTheme = await createEbookThemeFixture()

  const result = await prisma.ebook.createMany({
    data: ebooks.map((ebook) => ({
      title: ebook.title,
      subtitle: ebook.subtitle,
      shortDescription: ebook.shortDescription,
      ownerId,
      ebookTypeId: ebookType.id,
      ebookThemeId: ebookTheme.id,
    })),
  })

  return result.count
}