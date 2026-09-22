import type { ResponseErrorAPI, SceneResponseAPI } from "@/app/types/api/scene"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { canManageSceneByPermission } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { CollaborationPermission } from "@mythrart/database"

import { mapSceneToResponse } from "../utils"

export const GET = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<SceneResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params

    const result = await canManageSceneByPermission({
        sceneId: id,
        userId,
        permission: CollaborationPermission.CHAPTER_READ,
    })

    if (!result) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    return NextResponse.json<SceneResponseAPI>(mapSceneToResponse(result.scene))
})
