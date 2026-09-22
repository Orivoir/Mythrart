import type { DeleteEbookThemeResponseAPI, ResponseErrorAPI } from "@/app/types/api/theme"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { CollaborationPermission, prisma } from "@mythrart/database"
import { DeleteEbookThemeSchema } from "@mythrart/validations"

import { ensureEbookPermission } from "./utils"

export const DELETE = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<DeleteEbookThemeResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params
    await ensureEbookPermission(id, userId, CollaborationPermission.EBOOK_UPDATE_METADATA)

    let targetThemeId = request.nextUrl.searchParams.get("themeId") || request.nextUrl.searchParams.get("id")

    if (!targetThemeId) {
        try {
            const body = await parseApiJsonObject(request)
            const parsed = DeleteEbookThemeSchema.parse(body)
            targetThemeId = parsed.themeId || parsed.id || null
        } catch {
            // body was empty or not provided
        }
    }

    if (!targetThemeId) {
        throw new ApiException({
            ...HTTP_ERRORS.VALIDATION_ERROR,
            message: "Theme ID is required",
        })
    }

    const inUse = await prisma.ebook.findFirst({
        where: {
            ebookThemeId: targetThemeId,
        },
        select: {
            id: true,
        },
    })

    if (inUse) {
        throw new ApiException({
            ...HTTP_ERRORS.VALIDATION_ERROR,
            fields: {
                themeId: ["THEME_IN_USE"],
            },
            message: "Cannot delete theme currently in use by ebooks",
        })
    }

    const existingTheme = await prisma.ebookTheme.findUnique({
        where: {
            id: targetThemeId,
        },
    })

    if (!existingTheme) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    await prisma.ebookTheme.delete({
        where: {
            id: targetThemeId,
        },
    })

    return NextResponse.json<DeleteEbookThemeResponseAPI>({ success: true }, { status: 200 })
})
