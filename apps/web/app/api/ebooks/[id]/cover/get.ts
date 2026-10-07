import type { EbookCoverResponseAPI, ResponseErrorAPI } from "@/app/types/api/ebook"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { CollaborationPermission, prisma } from "@mythrart/database"
import { GetObjectCommand, getSignedUrl, s3 } from "@mythrart/s3"

import { ensureEbookPermission } from "../entities/utils"
import { buildPlaceholderCoverUrl, COVER_SIGNED_URL_TTL_SECONDS, resolveCoverDimensions } from "./shared"

export const GET = withApiHandler(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<EbookCoverResponseAPI | ResponseErrorAPI>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id } = await params
    const { width, height } = resolveCoverDimensions(request.nextUrl.searchParams)

    const ebook = await ensureEbookPermission(id, userId, CollaborationPermission.EBOOK_READ)

    const coverAsset = ebook.coverAssetId
        ? await prisma.asset.findUnique({ where: { id: ebook.coverAssetId } })
        : null

    if (!coverAsset) {
        return NextResponse.json<EbookCoverResponseAPI>({
            url: buildPlaceholderCoverUrl(width, height, ebook.title),
            isDefault: true,
            width,
            height,
        })
    }

    const url = await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: coverAsset.bucket, Key: coverAsset.key }),
        { expiresIn: COVER_SIGNED_URL_TTL_SECONDS },
    )

    return NextResponse.json<EbookCoverResponseAPI>({ url, isDefault: false, width, height })
})
