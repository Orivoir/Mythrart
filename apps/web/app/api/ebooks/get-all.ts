import type { PaginatedEbooksAPI, ResponseErrorAPI } from "@/app/types/api/ebook"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { parsePaginationParams, withPagination } from "@/lib/pagination"
import { prisma } from "@mythrart/database"

import { mapEbookToResponse } from "./utils"

export const GET = withApiHandler(async (request: NextRequest): Promise<NextResponse<PaginatedEbooksAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { page, pageSize } = parsePaginationParams(request.nextUrl.searchParams)

    const where = {
        ownerId: userId,
    }

    const items = await prisma.ebook.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
            createdAt: "desc",
        },
    })

    const totalItems = await prisma.ebook.count({ where })

    return NextResponse.json<PaginatedEbooksAPI>(
        withPagination(
            items.map(mapEbookToResponse),
            page,
            pageSize,
            totalItems,
        ),
    )
})