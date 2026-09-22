import type { PaginatedScenesAPI, ResponseErrorAPI } from "@/app/types/api/scene"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { canManageChapterByPermission } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { parsePaginationParams, withPagination } from "@/lib/pagination"
import { CollaborationPermission, prisma } from "@mythrart/database"

export const GET = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<PaginatedScenesAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params

    const chapter = await canManageChapterByPermission({
        chapterId: id,
        userId,
        permission: CollaborationPermission.CHAPTER_READ,
    })

    if (!chapter) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const { page, pageSize } = parsePaginationParams(request.nextUrl.searchParams)

    const scenes = await prisma.scene.findMany({
        where: {
            chapterId: id,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [
            { order: "asc" },
            { createdAt: "asc" },
        ],
    })

    const totalItems = await prisma.scene.count({
        where: {
            chapterId: id,
        },
    })

    const items = scenes.map((scene) => ({
        id: scene.id,
        chapterId: scene.chapterId,
        title: scene.title,
        objective: scene.objective,
        order: scene.order,
        createdAt: scene.createdAt.getTime(),
        updatedAt: scene.updatedAt.getTime(),
    }))

    return NextResponse.json<PaginatedScenesAPI>(
        withPagination(items, page, pageSize, totalItems),
    )
})
