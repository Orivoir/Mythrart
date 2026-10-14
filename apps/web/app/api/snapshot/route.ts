import { CollaborationPermission } from "@mythrart/database"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { hasEbookPermissionForUser } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { enqueueSnapshotJob } from "@/lib/queues/snapshot-queue"
import { createSnapshotJobRequestSchema } from "@mythrart/validations"
import type { JobCreatedResponse } from "@/app/types/api/job"

export const POST = withApiHandler(async (
    request: NextRequest,
): Promise<NextResponse<JobCreatedResponse>> => {

  const userId = getAuthenticatedUserIdFromHeaders(request.headers)

  if (!userId) {
      throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
  }

  const requestBody = await parseApiJsonObject(request)
  const { ebookId } = createSnapshotJobRequestSchema.parse(requestBody)

  const canCreateSnapshot = await hasEbookPermissionForUser({
    ebookId,
    userId,
    permission: CollaborationPermission.SNAPSHOT_CREATE,
  })

  if (!canCreateSnapshot) {
    throw new ApiException(HTTP_ERRORS.NOT_FOUND)
  }

  const snapshotJobId = await enqueueSnapshotJob({ ebookId })

  return NextResponse.json({ jobId: snapshotJobId }, { status: 202 })
})