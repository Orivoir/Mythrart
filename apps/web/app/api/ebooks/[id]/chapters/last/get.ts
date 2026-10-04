import type { ChapterResponseAPI } from "@/app/types/api/chapter"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { getEbookCollaboratorForUser } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { mapModelTimestamps } from "@/lib/map-date-fields-to-timestamps"
import { getRequestLocale } from "@/lib/request-locale"
import { prisma } from "@mythrart/database"

export const GET = withApiHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ChapterResponseAPI | ResponseErrorAPI>> => {

  const userId = getAuthenticatedUserIdFromHeaders(request.headers)

  if (!userId) {
    throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
  }

  const { id } = await params

  const ebook = await prisma.ebook.findFirst({
    where: {
      id,
      ownerId: userId,
    },
  })

  let allowedChapterIds: string[] | null = null

  if (!ebook) {
    const collaborator = await getEbookCollaboratorForUser(id, userId)

    if (!collaborator) {
      throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    if (!collaborator.allChaptersAccess) {
      allowedChapterIds = collaborator.chapterAccess.map(
        (entry) => entry.chapterId,
      )
    }
  }

  const locale = getRequestLocale({
    headers: request.headers,
    requestLocale: request.nextUrl.searchParams.get("locale"),
  })

  const chapter = await prisma.chapter.findFirst({
    where: {
      ebookId: id,
      ...(allowedChapterIds
        ? {
            id: {
              in: allowedChapterIds,
            },
          }
        : {}),
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      ebookId: true,
      title: true,
      position: true,
      createdAt: true,
      updatedAt: true,
      locales: {
        where: {
          locale,
        },
        select: {
          title: true,
        },
        take: 1,
      },
    },
  })

  if (!chapter) {
    throw new ApiException(HTTP_ERRORS.NOT_FOUND)
  }

  const localizedTitle = chapter.locales[0]?.title || chapter.title

  const {
    ...baseChapter
  } = chapter

  return NextResponse.json<ChapterResponseAPI>({
    ...mapModelTimestamps(baseChapter),
    title: localizedTitle,
    locale,
  })
})