import type { PaginatedEbookThemesAPI, ResponseErrorAPI } from "@/app/types/api/theme"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { parsePaginationParams, withPagination } from "@/lib/pagination"
import { CollaborationPermission, prisma } from "@mythrart/database"

import { ensureEbookPermission, mapThemeToResponse } from "./utils"

export const GET = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<PaginatedEbookThemesAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params
    await ensureEbookPermission(id, userId, CollaborationPermission.EBOOK_READ)

    const { page, pageSize } = parsePaginationParams(request.nextUrl.searchParams)

    const themes = await prisma.ebookTheme.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
            createdAt: "desc",
        },
    })

    const totalItems = await prisma.ebookTheme.count()

    return NextResponse.json<PaginatedEbookThemesAPI>(
        withPagination(
            themes.map(mapThemeToResponse),
            page,
            pageSize,
            totalItems,
        ),
    )
})
