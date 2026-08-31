import { prisma, CollaborationPermission } from "@mythrart/database"
import { NextRequest, NextResponse } from "next/server"
import type { SnapshotResponseAPI } from "@/app/types/api/snapshot"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { hasEbookPermissionForUser } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { s3, GetObjectCommand, getSignedUrl } from "@mythrart/s3"

/**
 * @description handles the retrieval of a snapshot by its ID. It checks if the user is authenticated and has the necessary permissions to view the snapshot. If the snapshot exists and the user has access, it generates a signed URL for downloading the snapshot file and returns the snapshot details along with the download URL.
 */
export const GET = withApiHandler(async (
    request: NextRequest,
    { params }: { params: { id: string } },
): Promise<NextResponse<SnapshotResponseAPI | ApiException>> => {
    const userId = getAuthenticatedUserIdFromHeaders(request.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const snapshotId = params.id

    const snapshot = await prisma.snapshot.findUnique({
        where: { id: snapshotId },
        include: {
          file: {
            select: {
              id: true,
              key: true,
              bucket: true,
            }
          },
          currentForEbook: {
              select: {
                id: true
              }
          },
        },
    })

    if(!snapshot ||  !snapshot.file) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const canViewSnapshot = await hasEbookPermissionForUser({
        ebookId: snapshot.ebookId,
        userId,
        permission: CollaborationPermission.EBOOK_READ,
    })

    if (!canViewSnapshot) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const command = new GetObjectCommand({
      Bucket: snapshot.file.bucket,
      Key: snapshot.file.key,
    })

    const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 2 })

    const isCurrentSnapshot = snapshot.currentForEbook?.id === snapshot.id

    return NextResponse.json({
      snapshot: {
        id: snapshot.id,
        ebookId: snapshot.ebookId,
        version: snapshot.version,
        createdAt: snapshot.createdAt.getTime(),
        isCurrentSnapshot,
      },
      downloadUrl
    })
})
