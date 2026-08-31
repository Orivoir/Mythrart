import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import { NextRequest, NextResponse } from "next/server"

import { UpdateChapterRequestAPI, UpdateChapterResponseAPI } from "@/app/types/api/chapter"
import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { canManageChapterByPermission } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { getRequestLocale } from "@/lib/request-locale"
import { prisma, CollaborationPermission } from "@mythrart/database"
import { UpdateChapterSchema } from "@mythrart/validations"

export const PUT = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<UpdateChapterResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params

    const chapter = await canManageChapterByPermission({
        chapterId: id,
        userId,
        permission: CollaborationPermission.CHAPTER_UPDATE,
    })

    if (!chapter) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const requestBody = await parseApiJsonObject(request)
    const parsed = UpdateChapterSchema.parse({
        title: typeof requestBody.title === "string" ? requestBody.title.trim() : requestBody.title,
        content: requestBody.content,
    })
    const locale = getRequestLocale({
        headers: request.headers,
        requestLocale: requestBody.locale,
    })
    const hasContentInRequest = Object.prototype.hasOwnProperty.call(requestBody, "content")

    const chapterUpdated = await prisma.$transaction(async (tx) => {
        const updatedChapter = await tx.chapter.update({
            where: {
                id,
            },
            data: parsed.title
                ? {
                    title: parsed.title,
                }
                : {},
            select: {
                id: true,
                ebookId: true,
                position: true,
                createdAt: true,
                updatedAt: true,
                title: true,
            },
        })

        const updatedLocale = await tx.chapterLocale.upsert({
            where: {
                chapterId_locale: {
                    chapterId: id,
                    locale,
                },
            },
            update: {
                ...(parsed.title
                    ? {
                        title: parsed.title,
                    }
                    : {}),
                ...(hasContentInRequest
                    ? {
                        content: requestBody.content as UpdateChapterRequestAPI["content"] || {},
                    }
                    : {}),
            },
            create: {
                chapterId: id,
                locale,
                title: parsed.title ?? updatedChapter.title,
                content: requestBody.content as UpdateChapterRequestAPI["content"] || {},
            },
            select: {
                locale: true,
                title: true,
                content: true,
            },
        })

        return {
            chapter: updatedChapter,
            chapterLocale: updatedLocale,
        }
    })

    return NextResponse.json<UpdateChapterResponseAPI>({
        id: chapterUpdated.chapter.id,
        ebookId: chapterUpdated.chapter.ebookId,
        position: chapterUpdated.chapter.position,
        title: chapterUpdated.chapterLocale.title,
        locale: chapterUpdated.chapterLocale.locale,
        content: chapterUpdated.chapterLocale.content,
        createdAt: chapterUpdated.chapter.createdAt.getTime(),
        updatedAt: chapterUpdated.chapter.updatedAt.getTime(),
    }, { status: 200 })
})