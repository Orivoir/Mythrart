import type { CreateSceneResponseAPI, ResponseErrorAPI } from "@/app/types/api/scene"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { canManageChapterByPermission } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { normalizeStringValue } from "@/lib/normalize-string-value"
import { CollaborationPermission, prisma } from "@mythrart/database"
import { CreateSceneSchema } from "@mythrart/validations"

import { mapSceneToResponse } from "./utils"

export const POST = withApiHandler(async (
    request: NextRequest,
): Promise<NextResponse<CreateSceneResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const requestBody = await parseApiJsonObject(request)
    const parsed = CreateSceneSchema.parse({
        chapterId: typeof requestBody.chapterId === "string" ? normalizeStringValue(requestBody.chapterId) ?? "" : requestBody.chapterId,
        title: typeof requestBody.title === "string" ? normalizeStringValue(requestBody.title) ?? "" : requestBody.title,
        objective: typeof requestBody.objective === "string" ? normalizeStringValue(requestBody.objective) : requestBody.objective,
        order: typeof requestBody.order === "number" ? requestBody.order : undefined,
    })

    const chapter = await canManageChapterByPermission({
        chapterId: parsed.chapterId,
        userId,
        permission: CollaborationPermission.CHAPTER_UPDATE,
    })

    if (!chapter) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    let order = parsed.order
    if (order === undefined || order === null) {
        order = await prisma.scene.count({
            where: {
                chapterId: parsed.chapterId,
            },
        })
    }

    const scene = await prisma.scene.create({
        data: {
            chapterId: parsed.chapterId,
            title: parsed.title,
            objective: parsed.objective ?? null,
            order,
        },
    })

    return NextResponse.json<CreateSceneResponseAPI>(mapSceneToResponse(scene), { status: 201 })
})
