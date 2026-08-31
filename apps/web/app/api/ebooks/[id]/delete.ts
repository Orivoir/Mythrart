import { NextRequest, NextResponse } from "next/server"
import type { DeleteEbookResponseAPI, ResponseErrorAPI } from "@/app/types/api/ebook"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { prisma } from "@mythrart/database"

export const DELETE = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<DeleteEbookResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params

    // Snapshots is not delete here, a "restore" feature will be implemented in the future, so we will keep the snapshots for now.
    // @TODO: Here should delete snapshots without LAST snapshots, or create once if not exists.
    const deletedEbook = await prisma.$transaction(async (transaction) => {
        const ebook = await transaction.ebook.findFirst({
            where: {
                id,
                ownerId: userId,
            },
            select: {
                id: true,
            },
        })

        if (!ebook) {
            return null
        }

        await transaction.chapter.deleteMany({
            where: {
                ebookId: id,
            },
        })

        await transaction.ebook.delete({
            where: {
                id,
            },
        })

        return ebook
    })

    if (!deletedEbook) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    return NextResponse.json<DeleteEbookResponseAPI>({ success: true })
})