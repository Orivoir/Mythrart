import type { CreateEbookThemeResponseAPI, ResponseErrorAPI } from "@/app/types/api/theme"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { normalizeStringValue } from "@/lib/normalize-string-value"
import { CollaborationPermission, prisma } from "@mythrart/database"
import { CreateEbookThemeSchema } from "@mythrart/validations"
import slugify from "slugify"
import { ensureEbookPermission, mapThemeToResponse } from "./utils"

export const POST = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<CreateEbookThemeResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params
    await ensureEbookPermission(id, userId, CollaborationPermission.EBOOK_UPDATE_METADATA)

    const requestBody = await parseApiJsonObject(request)
    const parsed = CreateEbookThemeSchema.parse({
        name: typeof requestBody.name === "string" ? normalizeStringValue(requestBody.name) ?? "" : requestBody.name,
        slug: typeof requestBody.slug === "string" ? normalizeStringValue(requestBody.slug) ?? undefined : requestBody.slug,
        description: typeof requestBody.description === "string" ? normalizeStringValue(requestBody.description) : requestBody.description,
        backgroundColor: typeof requestBody.backgroundColor === "string" ? normalizeStringValue(requestBody.backgroundColor) ?? "" : requestBody.backgroundColor,
        textColor: typeof requestBody.textColor === "string" ? normalizeStringValue(requestBody.textColor) ?? "" : requestBody.textColor,
        textFont: typeof requestBody.textFont === "string" ? normalizeStringValue(requestBody.textFont) ?? "" : requestBody.textFont,
        titleFont: typeof requestBody.titleFont === "string" ? normalizeStringValue(requestBody.titleFont) ?? "" : requestBody.titleFont,
        subtitleFont: typeof requestBody.subtitleFont === "string" ? normalizeStringValue(requestBody.subtitleFont) : requestBody.subtitleFont,
        headingColor: typeof requestBody.headingColor === "string" ? normalizeStringValue(requestBody.headingColor) : requestBody.headingColor,
        fontSize: typeof requestBody.fontSize === "string" ? normalizeStringValue(requestBody.fontSize) : requestBody.fontSize,
        lineHeight: typeof requestBody.lineHeight === "string" ? normalizeStringValue(requestBody.lineHeight) : requestBody.lineHeight,
        paragraphSpacing: typeof requestBody.paragraphSpacing === "string" ? normalizeStringValue(requestBody.paragraphSpacing) : requestBody.paragraphSpacing,
        headingSpacing: typeof requestBody.headingSpacing === "string" ? normalizeStringValue(requestBody.headingSpacing) : requestBody.headingSpacing,
    })

    const createSlug = (from: string) => (
      slugify(from, { lower: true, strict: true })
    )

    const baseSlug = parsed.slug ? createSlug(parsed.slug) : createSlug(parsed.name)
    let slug = baseSlug
    const existingSlug = await prisma.ebookTheme.findUnique({
        where: {
            slug,
        },
    })
    if (existingSlug) {
        slug = `${baseSlug}-${Date.now()}`
    }

    const newTheme = await prisma.ebookTheme.create({
        data: {
            name: parsed.name,
            slug,
            description: parsed.description ?? null,
            backgroundColor: parsed.backgroundColor,
            textColor: parsed.textColor,
            textFont: parsed.textFont,
            titleFont: parsed.titleFont,
            subtitleFont: parsed.subtitleFont ?? null,
            headingColor: parsed.headingColor ?? null,
            fontSize: parsed.fontSize ?? null,
            lineHeight: parsed.lineHeight ?? null,
            paragraphSpacing: parsed.paragraphSpacing ?? null,
            headingSpacing: parsed.headingSpacing ?? null,
        },
    })

    return NextResponse.json<CreateEbookThemeResponseAPI>(mapThemeToResponse(newTheme), { status: 201 })
})
