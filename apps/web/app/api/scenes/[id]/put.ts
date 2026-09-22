import type { ResponseErrorAPI, UpdateSceneResponseAPI } from "@/app/types/api/scene"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { canManageChapterByPermission, canManageSceneByPermission } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { normalizeStringValue } from "@/lib/normalize-string-value"
import { CollaborationPermission, prisma } from "@mythrart/database"
import { UpdateSceneSchema } from "@mythrart/validations"

import { mapSceneToResponse } from "../utils"

export const PUT = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<UpdateSceneResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params

    const result = await canManageSceneByPermission({
        sceneId: id,
        userId,
        permission: CollaborationPermission.CHAPTER_UPDATE,
    })

    if (!result) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const requestBody = await parseApiJsonObject(request)
    const parsed = UpdateSceneSchema.parse({
        title: typeof requestBody.title === "string" ? normalizeStringValue(requestBody.title) ?? undefined : requestBody.title,
        objective: typeof requestBody.objective === "string" ? normalizeStringValue(requestBody.objective) : requestBody.objective,
        order: typeof requestBody.order === "number" ? requestBody.order : undefined,
        chapterId: typeof requestBody.chapterId === "string" ? normalizeStringValue(requestBody.chapterId) ?? undefined : requestBody.chapterId,
    })

    if (parsed.chapterId && parsed.chapterId !== result.scene.chapterId) {
        const targetChapter = await canManageChapterByPermission({
            chapterId: parsed.chapterId,
            userId,
            permission: CollaborationPermission.CHAPTER_UPDATE,
        })

        if (!targetChapter) {
            throw new ApiException(HTTP_ERRORS.NOT_FOUND)
        }
    }

    const updatedScene = await prisma.scene.update({
        where: {
            id,
        },
        data: {
            ...(parsed.title !== undefined ? { title: parsed.title } : {}),
            ...(parsed.objective !== undefined ? { objective: parsed.objective } : {}),
            ...(parsed.order !== undefined ? { order: parsed.order } : {}),
            ...(parsed.chapterId !== undefined ? { chapterId: parsed.chapterId } : {}),
        },
    })

    return NextResponse.json<UpdateSceneResponseAPI>(mapSceneToResponse(updatedScene), { status: 200 })
})
