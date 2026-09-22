import type { CreateSceneEntityResponseAPI, ResponseErrorAPI } from "@/app/types/api/scene-entity"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { canManageSceneByPermission } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { normalizeStringValue } from "@/lib/normalize-string-value"
import { CollaborationPermission, prisma } from "@mythrart/database"
import { SceneEntityCreateSchema } from "@mythrart/validations"

import { mapSceneEntityToResponse } from "./utils"

export const POST = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; sceneId?: string }> },
): Promise<NextResponse<CreateSceneEntityResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const resolvedParams = await params
    const sceneId = resolvedParams.id || resolvedParams.sceneId

    if (!sceneId) {
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

    const requestBody = await parseApiJsonObject(request)
    const parsed = SceneEntityCreateSchema.parse({
        entityId: typeof requestBody.entityId === "string" ? normalizeStringValue(requestBody.entityId) ?? "" : requestBody.entityId,
    })

    // Check that the entity belongs to the same ebook as the scene's chapter
    const ebookEntity = await prisma.ebookEntity.findFirst({
        where: {
            id: parsed.entityId,
            ebookId: result.chapter.ebookId,
        },
    })

    if (!ebookEntity) {
        throw new ApiException({
            ...HTTP_ERRORS.VALIDATION_ERROR,
            message: "Ebook entity not found for this ebook",
        })
    }

    const sceneEntity = await prisma.sceneEntity.upsert({
        where: {
            sceneId_entityId: {
                sceneId,
                entityId: parsed.entityId,
            },
        },
        update: {},
        create: {
            sceneId,
            entityId: parsed.entityId,
        },
        include: {
            entity: true,
        },
    })

    return NextResponse.json<CreateSceneEntityResponseAPI>(mapSceneEntityToResponse(sceneEntity), { status: 201 })
})
