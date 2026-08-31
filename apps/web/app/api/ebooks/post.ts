import type {
    CreateEbookRequestAPI,
    CreateEbookResponseAPI,
    ResponseErrorAPI,
} from "@/app/types/api/ebook"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { normalizeStringValue } from "@/lib/normalize-string-value"
import { prisma } from "@mythrart/database"
import { EbookSchema } from "@mythrart/validations"

import { mapEbookToResponse } from "./utils"

export const POST = withApiHandler(async (request: NextRequest): Promise<NextResponse<CreateEbookResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const body = await parseApiJsonObject(request) as Partial<CreateEbookRequestAPI>
    const parsed = EbookSchema.parse({
        title: normalizeStringValue(body.title) ?? undefined,
        subtitle: body.subtitle === undefined ? undefined : normalizeStringValue(body.subtitle) ?? "",
        shortDescription: body.shortDescription === undefined ? undefined : normalizeStringValue(body.shortDescription) ?? "",
    })

    const ebook = await prisma.ebook.create({
        data: {
            ...parsed,
            ownerId: userId,
        },
    })

    return NextResponse.json<CreateEbookResponseAPI>(mapEbookToResponse(ebook), { status: 201 })
})