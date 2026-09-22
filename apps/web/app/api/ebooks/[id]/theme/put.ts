import type { ResponseErrorAPI, UpdateEbookThemeResponseAPI } from "@/app/types/api/theme"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { normalizeStringValue } from "@/lib/normalize-string-value"
import { CollaborationPermission, prisma } from "@mythrart/database"
import { UpdateEbookThemeSchema } from "@mythrart/validations"

import { ensureEbookPermission, generateSlug, mapThemeToResponse } from "./utils"

export const PUT = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<UpdateEbookThemeResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params
    await ensureEbookPermission(id, userId, CollaborationPermission.EBOOK_UPDATE_METADATA)

    const requestBody = await parseApiJsonObject(request)
    const targetThemeId = (typeof requestBody.themeId === "string" ? requestBody.themeId : undefined)
        || (typeof requestBody.id === "string" ? requestBody.id : undefined)
        || request.nextUrl.searchParams.get("themeId")
        || request.nextUrl.searchParams.get("id")
        || undefined

    const parsed = UpdateEbookThemeSchema.parse({
        ...requestBody,
        themeId: targetThemeId,
        name: typeof requestBody.name === "string" ? normalizeStringValue(requestBody.name) ?? undefined : requestBody.name,
        slug: typeof requestBody.slug === "string" ? normalizeStringValue(requestBody.slug) ?? undefined : requestBody.slug,
        description: typeof requestBody.description === "string" ? normalizeStringValue(requestBody.description) : requestBody.description,
        backgroundColor: typeof requestBody.backgroundColor === "string" ? normalizeStringValue(requestBody.backgroundColor) ?? undefined : requestBody.backgroundColor,
        textColor: typeof requestBody.textColor === "string" ? normalizeStringValue(requestBody.textColor) ?? undefined : requestBody.textColor,
        textFont: typeof requestBody.textFont === "string" ? normalizeStringValue(requestBody.textFont) ?? undefined : requestBody.textFont,
        titleFont: typeof requestBody.titleFont === "string" ? normalizeStringValue(requestBody.titleFont) ?? undefined : requestBody.titleFont,
        subtitleFont: typeof requestBody.subtitleFont === "string" ? normalizeStringValue(requestBody.subtitleFont) : requestBody.subtitleFont,
        headingColor: typeof requestBody.headingColor === "string" ? normalizeStringValue(requestBody.headingColor) : requestBody.headingColor,
        fontSize: typeof requestBody.fontSize === "string" ? normalizeStringValue(requestBody.fontSize) : requestBody.fontSize,
        lineHeight: typeof requestBody.lineHeight === "string" ? normalizeStringValue(requestBody.lineHeight) : requestBody.lineHeight,
        paragraphSpacing: typeof requestBody.paragraphSpacing === "string" ? normalizeStringValue(requestBody.paragraphSpacing) : requestBody.paragraphSpacing,
        headingSpacing: typeof requestBody.headingSpacing === "string" ? normalizeStringValue(requestBody.headingSpacing) : requestBody.headingSpacing,
    })

    const themeId = parsed.themeId || parsed.id || targetThemeId
    if (!themeId) {
        throw new ApiException({
            ...HTTP_ERRORS.VALIDATION_ERROR,
            message: "Theme ID is required",
        })
    }

    const existingTheme = await prisma.ebookTheme.findUnique({
        where: {
            id: themeId,
        },
    })

    if (!existingTheme) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    let slug = parsed.slug ? generateSlug(parsed.slug) : undefined
    if (slug && slug !== existingTheme.slug) {
        const existingSlug = await prisma.ebookTheme.findUnique({
            where: {
                slug,
            },
        })
        if (existingSlug && existingSlug.id !== themeId) {
            slug = `${slug}-${Date.now()}`
        }
    }

    const updatedTheme = await prisma.ebookTheme.update({
        where: {
            id: themeId,
        },
        data: {
            ...(parsed.name !== undefined ? { name: parsed.name } : {}),
            ...(slug !== undefined ? { slug } : {}),
            ...(parsed.description !== undefined ? { description: parsed.description } : {}),
            ...(parsed.backgroundColor !== undefined ? { backgroundColor: parsed.backgroundColor } : {}),
            ...(parsed.textColor !== undefined ? { textColor: parsed.textColor } : {}),
            ...(parsed.textFont !== undefined ? { textFont: parsed.textFont } : {}),
            ...(parsed.titleFont !== undefined ? { titleFont: parsed.titleFont } : {}),
            ...(parsed.subtitleFont !== undefined ? { subtitleFont: parsed.subtitleFont } : {}),
            ...(parsed.headingColor !== undefined ? { headingColor: parsed.headingColor } : {}),
            ...(parsed.fontSize !== undefined ? { fontSize: parsed.fontSize } : {}),
            ...(parsed.lineHeight !== undefined ? { lineHeight: parsed.lineHeight } : {}),
            ...(parsed.paragraphSpacing !== undefined ? { paragraphSpacing: parsed.paragraphSpacing } : {}),
            ...(parsed.headingSpacing !== undefined ? { headingSpacing: parsed.headingSpacing } : {}),
        },
    })

    return NextResponse.json<UpdateEbookThemeResponseAPI>(mapThemeToResponse(updatedTheme), { status: 200 })
})
