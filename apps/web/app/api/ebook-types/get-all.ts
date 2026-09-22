import type { PaginatedEbookTypesAPI, ResponseErrorAPI } from "@/app/types/api/ebook-type"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { parsePaginationParams, withPagination } from "@/lib/pagination"
import { prisma } from "@mythrart/database"

import { mapTypeToResponse } from "./utils"

export const GET = withApiHandler(async (
    request: NextRequest,
): Promise<NextResponse<PaginatedEbookTypesAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { page, pageSize } = parsePaginationParams(request.nextUrl.searchParams)

    const types = await prisma.ebookType.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
            createdAt: "desc",
        },
    })

    const totalItems = await prisma.ebookType.count()

    return NextResponse.json<PaginatedEbookTypesAPI>(
        withPagination(
            types.map(mapTypeToResponse),
            page,
            pageSize,
            totalItems,
        ),
    )
})
