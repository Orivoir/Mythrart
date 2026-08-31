import type {
    CreateChapterRequestAPI,
    CreateChapterResponseAPI,
} from "@/app/types/api/chapter"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { canCreateChapterForEbook } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { getRequestLocale } from "@/lib/request-locale"
import { prisma } from "@mythrart/database"
import { ChapterSchema } from "@mythrart/validations"

export const POST = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<CreateChapterResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params

    const authorization = await canCreateChapterForEbook({
        ebookId: id,
        userId,
    })

    if (authorization.limitReached) {
        throw new ApiException(HTTP_ERRORS.PAYMENT_REQUIRED)
    }

    if (!authorization.canCreate) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const requestBody = await parseApiJsonObject(request)
    const parsed = ChapterSchema.parse({
        title: typeof requestBody.title === "string" ? requestBody.title.trim() : requestBody.title,
    })
    const locale = getRequestLocale({
        headers: request.headers,
        requestLocale: requestBody.locale,
    })

    const newChapter = await prisma.$transaction(async (tx) => {
        const count = await tx.chapter.count({
            where: {
                ebookId: id,
            },
        })

        return tx.chapter.create({
            data: {
                title: parsed.title,
                ebookId: id,
                position: count,
                locales: {
                    create: {
                        locale,
                        title: parsed.title,
                        content: requestBody.content as CreateChapterRequestAPI["content"] || {},
                    },
                },
            },
            select: {
                id: true,
                ebookId: true,
                position: true,
                createdAt: true,
                updatedAt: true,
                locales: {
                    where: {
                        locale,
                    },
                    select: {
                        locale: true,
                        title: true,
                        content: true,
                    },
                    take: 1,
                },
            },
        })
    })

    const chapterLocale = newChapter.locales[0]

    return NextResponse.json<CreateChapterResponseAPI>({
        id: newChapter.id,
        ebookId: newChapter.ebookId,
        title: chapterLocale?.title || parsed.title,
        locale: chapterLocale?.locale || locale,
        content: chapterLocale?.content || {},
        position: newChapter.position,
        createdAt: newChapter.createdAt.getTime(),
        updatedAt: newChapter.updatedAt.getTime(),
    }, { status: 201 })
})