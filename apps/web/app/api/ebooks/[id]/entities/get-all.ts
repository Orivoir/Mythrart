import type {
    PaginatedEbookEntitiesAPI,
    ResponseErrorAPI,
} from "@/app/types/api/ebook-entity"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { parsePaginationParams, withPagination } from "@/lib/pagination"
import {
    CollaborationPermission,
    EbookEntityType,
} from "@mythrart/database"

import { ensureEbookPermission, mapEntityWithRelationsToResponse } from "./utils"
import {
    findEbookEntities,
    findSceneEntityIds,
    sortEbookEntitiesByScene,
} from "./shared"

export const GET = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id?: string }> },
): Promise<NextResponse<PaginatedEbookEntitiesAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const {id: ebookId} = await params

    if (!ebookId) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    await ensureEbookPermission(
        ebookId,
        userId,
        CollaborationPermission.EBOOK_READ,
    )

    const searchParams = request.nextUrl.searchParams

    const { page, pageSize } = parsePaginationParams(searchParams)

    const typeQuery = searchParams.get("type")
    const sceneId = searchParams.get("sceneId")
    const search = searchParams.get("search")?.trim()

    const isValidType =
        typeQuery &&
        Object.values(EbookEntityType).includes(
            typeQuery as EbookEntityType,
        )

    const entities = await findEbookEntities({
        ebookId,
        type: isValidType
            ? typeQuery as EbookEntityType
            : undefined,
        search: search || undefined,
    })

    let sortedEntities = entities

    if (sceneId) {
        const sceneEntityIds = await findSceneEntityIds(sceneId)

        sortedEntities = sortEbookEntitiesByScene(
            entities,
            sceneEntityIds,
        )
    }

    const totalItems = sortedEntities.length

    const paginatedEntities = sortedEntities.slice(
        (page - 1) * pageSize,
        page * pageSize,
    )

    return NextResponse.json<PaginatedEbookEntitiesAPI>(
        withPagination(
            paginatedEntities.map(mapEntityWithRelationsToResponse),
            page,
            pageSize,
            totalItems,
        ),
    )
})