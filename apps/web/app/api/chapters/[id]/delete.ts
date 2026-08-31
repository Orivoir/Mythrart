import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import { NextRequest, NextResponse } from "next/server"

import { DeleteChapterResponseAPI } from "@/app/types/api/chapter"
import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { canManageChapterByPermission } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { prisma, CollaborationPermission } from "@mythrart/database"

export const DELETE = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<DeleteChapterResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params

    const chapter = await canManageChapterByPermission({
        chapterId: id,
        userId,
        permission: CollaborationPermission.CHAPTER_DELETE,
    })

    if (!chapter) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    await prisma.$transaction(async (tx) => {
        // Snapshot should stock all content of version and chapter, without "soft" deleted for chapter is apply.
        await tx.chapter.delete({
            where: {
                id,
            },
        })

        // offset the position of all chapters that come after the deleted chapter
        await tx.chapter.updateMany({
            where: {
                ebookId: chapter.ebookId,
                position: {
                    gt: chapter.position,
                },
            },
            data: {
                position: {
                    decrement: 1,
                },
            },
        })
    })

    return NextResponse.json<DeleteChapterResponseAPI>({ success: true }, { status: 200 })
})