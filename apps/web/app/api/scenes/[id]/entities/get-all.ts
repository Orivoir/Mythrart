import type { PaginatedSceneEntitiesAPI, ResponseErrorAPI } from "@/app/types/api/scene-entity"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { canManageSceneByPermission } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { parsePaginationParams, withPagination } from "@/lib/pagination"
import { CollaborationPermission, prisma } from "@mythrart/database"

import { mapSceneEntityToResponse } from "./utils"

export const GET = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string; sceneId?: string }> },
): Promise<NextResponse<PaginatedSceneEntitiesAPI | ResponseErrorAPI>> => {
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
        permission: CollaborationPermission.CHAPTER_READ,
    })

    if (!result) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const { page, pageSize } = parsePaginationParams(request.nextUrl.searchParams)

    const where = {
        sceneId,
    }

    const sceneEntities = await prisma.sceneEntity.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
            createdAt: "asc",
        },
        include: {
            entity: true,
        },
    })

    const totalItems = await prisma.sceneEntity.count({ where })

    return NextResponse.json<PaginatedSceneEntitiesAPI>(
        withPagination(
            sceneEntities.map(mapSceneEntityToResponse),
            page,
            pageSize,
            totalItems,
        ),
    )
})
