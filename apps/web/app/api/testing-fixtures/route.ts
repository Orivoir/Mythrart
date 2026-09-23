import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import {PlanType, prisma} from "@mythrart/database"

import { mapEbookToResponse } from "../ebooks/utils"

export const GET = withApiHandler(async (
    request: NextRequest,
): Promise<NextResponse> => {

  const userId = getAuthenticatedUserIdFromHeaders(request.headers)

  if (!userId) {
      throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
  }

  const mode: PlanType =
    (request.nextUrl.searchParams.get("mode")?.toLowerCase().trim() ?? "free") as PlanType
  const shouldReset = request.nextUrl.searchParams.has("reset")

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      plan: mode,
    }
  })

  if (shouldReset) {
    const fixtureEbooks = await prisma.ebook.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
      },
    })

    const ebookIds = fixtureEbooks.map(({ id }) => id)

    if (ebookIds.length > 0) {
      await prisma.chapterLocale.deleteMany({
        where: {
          chapter: {
            ebookId: { in: ebookIds },
          },
        },
      })

      await prisma.chapter.deleteMany({
        where: {
          ebookId: { in: ebookIds },
        },
      })

      await prisma.ebook.deleteMany({
        where: {
          id: { in: ebookIds },
        },
      })
    }
  }

  const projectFixture = await prisma.ebook.findFirst({
    where: {
        ownerId: userId,
    },
  })

  if(!projectFixture) {
    // create a ebook fixture for testing

    const result = await prisma.$transaction(async (tx) => {
        
      const ebooKTheme = await tx.ebookTheme.upsert({
        where: {
          slug: "default-theme"
        },
        create: {
          name: "Default Theme",
          slug: "default-theme",
          description: "Default theme of Mythrart",
          backgroundColor: "#ffffff",
          textColor: "#000000",
          textFont: "serif",
          titleFont: "serif",
          subtitleFont: "serif",
          headingColor: "#000000",
          fontSize: "16px",
          lineHeight: "1.5",
          paragraphSpacing: "1.5",
          headingSpacing: "3"
        },
        update: {}
      })

      const ebookType = await tx.ebookType.upsert({
        where: {
          slug: "default-type"
        },
        create: {
          name: "Default Type",
          slug: "default-type",
          description: "Default type of Mythrart"
        },
        update: {}
      })

      const ebook = await tx.ebook.create({
        data: {
          title: "Fixture E-book",
          subtitle: "Awesome story of Mythrart",
          ownerId: userId,
          ebookThemeId: ebooKTheme.id,
          ebookTypeId: ebookType.id
        }
      })

      const chapterDefinitions = [
        {
          title: "Origin of Mythrart",
          position: 1,
          locales: [
            {
              locale: "en",
              title: "Origin of Mythrart",
              content: {
                type: "doc",
                content: [{ type: "paragraph", content: [{ type: "text", text: "A newborn world awakens." }] }],
              },
            },
            {
              locale: "fr",
              title: "Origine de Mythrart",
              content: {},
            },
          ],
        },
        {
          title: "Start of new world",
          position: 2,
          locales: [
            {
              locale: "en",
              title: "Start of new world",
              content: {
                type: "doc",
                content: [{ type: "paragraph", content: [{ type: "text", text: "The first steps of the journey begin." }] }],
              },
            },
            {
              locale: "fr",
              title: "Début d'un nouveau monde",
              content: {},
            },
          ],
        },
        {
          title: "The Rise of Mythrart",
          position: 3,
          locales: [
            {
              locale: "en",
              title: "The Rise of Mythrart",
              content: {
                type: "doc",
                content: [{ type: "paragraph", content: [{ type: "text", text: "The city takes shape under new skies." }] }],
              },
            },
            {
              locale: "fr",
              title: "L'ascension de Mythrart",
              content: {},
            },
          ],
        },
        {
          title: "The Last Secret",
          position: 4,
          locales: [
            {
              locale: "en",
              title: "The Last Secret",
              content: {
                type: "doc",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Every hidden door leads to a greater truth." }] }],
              },
            },
            {
              locale: "fr",
              title: "Le dernier secret",
              content: {},
            },
          ],
        },
      ]

      for (const chapterDefinition of chapterDefinitions) {
        await tx.chapter.create({
          data: {
            title: chapterDefinition.title,
            position: chapterDefinition.position,
            ebookId: ebook.id,
            locales: {
              create: chapterDefinition.locales.map((localeData) => ({
                locale: localeData.locale,
                title: localeData.title,
                content: localeData.content,
              })),
            },
          },
        })
      }

      return ebook
    })

    return NextResponse.json({
      ebook: result
    })
  }

  const projectNormalize = mapEbookToResponse(projectFixture)

  return NextResponse.json<{ebook: ReturnType<typeof mapEbookToResponse>}>({
    ebook: projectNormalize
  })
})
