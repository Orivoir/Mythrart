import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import { NextRequest, NextResponse } from "next/server"

import { GetChapterResponseAPI } from "@/app/types/api/chapter"
import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { canManageChapterByPermission } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { getRequestLocale } from "@/lib/request-locale"
import { CollaborationPermission, prisma } from "@mythrart/database"

export const GET = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<GetChapterResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params

    const chapter = await canManageChapterByPermission({
        chapterId: id,
        userId,
        permission: CollaborationPermission.CHAPTER_READ,
    })

    if (!chapter) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const locale = getRequestLocale({
        headers: request.headers,
        requestLocale: request.nextUrl?.searchParams.get("locale"),
    }).toLocaleLowerCase()

    const chapterLocale = await prisma.chapterLocale.findUnique({
        where: {
            chapterId_locale: {
                chapterId: id,
                locale,
            },
        },
        select: {
            locale: true,
            title: true,
            content: true,
        },
    })

    const selectedLocale = chapterLocale ?? {
        locale,
        title: chapter.title,
        content: {},
    }

    return NextResponse.json<GetChapterResponseAPI>({
        id: chapter.id,
        ebookId: chapter.ebookId,
        position: chapter.position,
        title: selectedLocale.title,
        locale: selectedLocale.locale,
        content: selectedLocale.content,
        createdAt: chapter.createdAt.getTime(),
        updatedAt: chapter.updatedAt.getTime(),
    }, { status: 200 })
})
