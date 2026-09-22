import type { DeleteEbookEntityResponseAPI, ResponseErrorAPI } from "@/app/types/api/ebook-entity"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { CollaborationPermission, prisma } from "@mythrart/database"

import { ensureEbookPermission } from "../utils"

export const DELETE = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id?: string; ebookId?: string; entityId: string }> },
): Promise<NextResponse<DeleteEbookEntityResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const resolvedParams = await params
    const ebookId = resolvedParams.ebookId || resolvedParams.id
    const { entityId } = resolvedParams

    if (!ebookId || !entityId) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    await ensureEbookPermission(ebookId, userId, CollaborationPermission.EBOOK_UPDATE_METADATA)

    const existingEntity = await prisma.ebookEntity.findFirst({
        where: {
            id: entityId,
            ebookId,
        },
    })

    if (!existingEntity) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    await prisma.ebookEntity.delete({
        where: {
            id: entityId,
        },
    })

    return NextResponse.json<DeleteEbookEntityResponseAPI>({ success: true }, { status: 200 })
})
