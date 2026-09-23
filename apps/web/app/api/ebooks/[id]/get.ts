import type { CreateEbookResponseAPI, ResponseErrorAPI } from "@/app/types/api/ebook"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { CollaborationPermission } from "@mythrart/database"

import { ensureEbookPermission } from "../[id]/entities/utils"
import { mapEbookToResponse } from "../utils"

export const GET = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<CreateEbookResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params

    console.log(id)

    const ebook = await ensureEbookPermission(id, userId, CollaborationPermission.EBOOK_READ)

    return NextResponse.json<CreateEbookResponseAPI>(mapEbookToResponse(ebook))
})
