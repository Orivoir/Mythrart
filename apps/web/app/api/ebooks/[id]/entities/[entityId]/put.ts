import type { ResponseErrorAPI, UpdateEbookEntityResponseAPI } from "@/app/types/api/ebook-entity"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { normalizeStringValue } from "@/lib/normalize-string-value"
import { CollaborationPermission, prisma } from "@mythrart/database"
import { UpdateEbookEntitySchema } from "@mythrart/validations"

import { ensureEbookPermission, generateUniqueEntitySlug, mapEntityToResponse } from "../utils"

export const PUT = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id?: string; ebookId?: string; entityId: string }> },
): Promise<NextResponse<UpdateEbookEntityResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const resolvedParams = await params
    const ebookId = resolvedParams.ebookId || resolvedParams.id
    const { entityId } = resolvedParams

    if (!ebookId || !entityId) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    await ensureEbookPermission(ebookId, userId, CollaborationPermission.EBOOK_UPDATE_METADATA)

    const existingEntity = await prisma.ebookEntity.findFirst({
        where: {
            id: entityId,
            ebookId,
        },
    })

    if (!existingEntity) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const requestBody = await parseApiJsonObject(request)
    const parsed = UpdateEbookEntitySchema.parse({
        name: typeof requestBody.name === "string" ? normalizeStringValue(requestBody.name) ?? undefined : requestBody.name,
        slug: typeof requestBody.slug === "string" ? normalizeStringValue(requestBody.slug) ?? undefined : requestBody.slug,
        type: requestBody.type,
        description: typeof requestBody.description === "string" ? normalizeStringValue(requestBody.description) : requestBody.description,
    })

    let slug = existingEntity.slug
    if (parsed.slug) {
        slug = await generateUniqueEntitySlug(ebookId, parsed.name || existingEntity.name, parsed.slug, entityId)
    } else if (parsed.name && parsed.name !== existingEntity.name) {
        slug = await generateUniqueEntitySlug(ebookId, parsed.name, undefined, entityId)
    }

    const updatedEntity = await prisma.ebookEntity.update({
        where: {
            id: entityId,
        },
        data: {
            ...(parsed.name !== undefined ? { name: parsed.name } : {}),
            slug,
            ...(parsed.type !== undefined ? { type: parsed.type } : {}),
            ...(parsed.description !== undefined ? { description: parsed.description } : {}),
        },
    })

    return NextResponse.json<UpdateEbookEntityResponseAPI>(mapEntityToResponse(updatedEntity), { status: 200 })
})
