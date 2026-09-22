import type { DeleteSceneResponseAPI, ResponseErrorAPI } from "@/app/types/api/scene"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { canManageSceneByPermission } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { CollaborationPermission, prisma } from "@mythrart/database"

export const DELETE = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<DeleteSceneResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params

    const result = await canManageSceneByPermission({
        sceneId: id,
        userId,
        permission: CollaborationPermission.CHAPTER_DELETE,
    })

    if (!result) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    await prisma.scene.delete({
        where: {
            id,
        },
    })

    return NextResponse.json<DeleteSceneResponseAPI>({ success: true }, { status: 200 })
})
