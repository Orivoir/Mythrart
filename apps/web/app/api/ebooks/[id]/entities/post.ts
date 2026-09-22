import type { CreateEbookEntityResponseAPI, ResponseErrorAPI } from "@/app/types/api/ebook-entity"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { normalizeStringValue } from "@/lib/normalize-string-value"
import { CollaborationPermission, prisma } from "@mythrart/database"
import { CreateEbookEntitySchema } from "@mythrart/validations"

import { ensureEbookPermission, generateUniqueEntitySlug, mapEntityToResponse } from "./utils"

export const POST = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id?: string; ebookId?: string }> },
): Promise<NextResponse<CreateEbookEntityResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const resolvedParams = await params
    const ebookId = resolvedParams.ebookId || resolvedParams.id

    if (!ebookId) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    await ensureEbookPermission(ebookId, userId, CollaborationPermission.EBOOK_UPDATE_METADATA)

    const requestBody = await parseApiJsonObject(request)
    const parsed = CreateEbookEntitySchema.parse({
        name: typeof requestBody.name === "string" ? normalizeStringValue(requestBody.name) ?? "" : requestBody.name,
        slug: typeof requestBody.slug === "string" ? normalizeStringValue(requestBody.slug) ?? undefined : requestBody.slug,
        type: requestBody.type,
        description: typeof requestBody.description === "string" ? normalizeStringValue(requestBody.description) : requestBody.description,
    })

    const slug = await generateUniqueEntitySlug(ebookId, parsed.name, parsed.slug)

    const newEntity = await prisma.ebookEntity.create({
        data: {
            ebookId,
            name: parsed.name,
            slug,
            type: parsed.type,
            description: parsed.description ?? null,
        },
    })

    return NextResponse.json<CreateEbookEntityResponseAPI>(mapEntityToResponse(newEntity), { status: 201 })
})
