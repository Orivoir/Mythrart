import type { EbookTypeResponseAPI, ResponseErrorAPI } from "@/app/types/api/ebook-type"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { prisma } from "@mythrart/database"

import { mapTypeToResponse } from "../utils"

export const GET = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } },
): Promise<NextResponse<EbookTypeResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params

    const ebookType = await prisma.ebookType.findUnique({
        where: {
            id,
        },
    })

    if (!ebookType) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    return NextResponse.json<EbookTypeResponseAPI>(mapTypeToResponse(ebookType))
})
