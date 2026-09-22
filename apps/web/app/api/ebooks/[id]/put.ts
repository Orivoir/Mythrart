import { NextRequest, NextResponse } from "next/server"
import type {
    ResponseErrorAPI,
    UpdateEbookRequestAPI,
    UpdateEbookResponseAPI,
} from "@/app/types/api/ebook"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { normalizeStringValue } from "@/lib/normalize-string-value"
import { prisma } from "@mythrart/database"
import { UpdateEbookSchema } from "@mythrart/validations"

import { mapEbookToResponse } from "../utils"

export const PUT = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<UpdateEbookResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params
    const body = await parseApiJsonObject(request) as Partial<UpdateEbookRequestAPI>
    const parsed = UpdateEbookSchema.parse({
        title: normalizeStringValue(body.title) ?? undefined,
        subtitle: body.subtitle === undefined ? undefined : normalizeStringValue(body.subtitle) ?? "",
        shortDescription: body.shortDescription === undefined ? undefined : normalizeStringValue(body.shortDescription) ?? "",
        ebookTypeId: body.ebookTypeId === undefined ? undefined : normalizeStringValue(body.ebookTypeId) ?? "",
        ebookThemeId: body.ebookThemeId === undefined ? undefined : normalizeStringValue(body.ebookThemeId) ?? ""
    })

    const updateResult = await prisma.ebook.updateMany({
        where: {
            id,
            ownerId: userId,
        },
        data: parsed,
    })

    if (updateResult.count === 0) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const ebook = await prisma.ebook.findFirst({
        where: {
            id,
            ownerId: userId,
        },
    })

    if (!ebook) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    return NextResponse.json<UpdateEbookResponseAPI>(mapEbookToResponse(ebook))
})