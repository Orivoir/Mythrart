import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { CollaborationPermission } from "@mythrart/database"

import { ensureEbookPermission } from "../entities/utils"
import { getEbookMetadata } from "./shared"
import type { EbookMetadataResponseAPI } from "./types"

export const GET = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<EbookMetadataResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params

    await ensureEbookPermission(id, userId, CollaborationPermission.EBOOK_READ)

    return NextResponse.json<EbookMetadataResponseAPI>(
        await getEbookMetadata(id, userId),
    )
})
