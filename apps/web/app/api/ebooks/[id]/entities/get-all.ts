import type { PaginatedEbookEntitiesAPI, ResponseErrorAPI } from "@/app/types/api/ebook-entity"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { parsePaginationParams, withPagination } from "@/lib/pagination"
import { CollaborationPermission, EbookEntityType, prisma } from "@mythrart/database"

import { ensureEbookPermission, mapEntityToResponse } from "./utils"

export const GET = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id?: string; ebookId?: string }> },
): Promise<NextResponse<PaginatedEbookEntitiesAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const resolvedParams = await params
    const ebookId = resolvedParams.ebookId || resolvedParams.id

    if (!ebookId) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    await ensureEbookPermission(ebookId, userId, CollaborationPermission.EBOOK_READ)

    const { page, pageSize } = parsePaginationParams(request.nextUrl.searchParams)
    const typeQuery = request.nextUrl.searchParams.get("type")
    const isValidType = typeQuery && Object.values(EbookEntityType).includes(typeQuery as EbookEntityType)

    const where = {
        ebookId,
        ...(isValidType ? { type: typeQuery as EbookEntityType } : {}),
    }

    const entities = await prisma.ebookEntity.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
            createdAt: "desc",
        },
    })

    const totalItems = await prisma.ebookEntity.count({ where })

    return NextResponse.json<PaginatedEbookEntitiesAPI>(
        withPagination(
            entities.map(mapEntityToResponse),
            page,
            pageSize,
            totalItems,
        ),
    )
})
