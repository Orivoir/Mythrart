import type { DeleteSceneEntityResponseAPI, ResponseErrorAPI } from "@/app/types/api/scene-entity"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { canManageSceneByPermission } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { CollaborationPermission, prisma } from "@mythrart/database"

export const DELETE = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; sceneId?: string; entityId: string }> },
): Promise<NextResponse<DeleteSceneEntityResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const resolvedParams = await params
    const sceneId = resolvedParams.id || resolvedParams.sceneId
    const { entityId } = resolvedParams

    if (!sceneId || !entityId) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const result = await canManageSceneByPermission({
        sceneId,
        userId,
        permission: CollaborationPermission.CHAPTER_UPDATE,
    })

    if (!result) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const existing = await prisma.sceneEntity.findUnique({
        where: {
            sceneId_entityId: {
                sceneId,
                entityId,
            },
        },
    })

    if (!existing) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    await prisma.sceneEntity.delete({
        where: {
            sceneId_entityId: {
                sceneId,
                entityId,
            },
        },
    })

    return NextResponse.json<DeleteSceneEntityResponseAPI>({ success: true }, { status: 200 })
})
