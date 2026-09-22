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

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      plan: mode,
    }
  })

  const projectFixture = await prisma.ebook.findFirst({
    where: {
        ownerId: userId,
    },
  })

  if(!projectFixture) {
    // create a ebook fixture for testing

    const result = await prisma.$transaction(async (tx) => {
        
      const ebooKTheme = await tx.ebookTheme.create({
        data: {
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
        }
      })

      const ebookType = await tx.ebookType.create({
        data: {
          name: "Default Type",
          slug: "default-type",
          description: "Default type of Mythrart"
        }
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
