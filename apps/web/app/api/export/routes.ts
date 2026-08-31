import { CollaborationPermission } from "@mythrart/database"
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { hasEbookPermissionForUser } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, parseApiJsonObject, withApiHandler } from "@/lib/errors"
import { enqueueExportJob } from "@/lib/queues/export-queue"
import { createExportJobRequestSchema } from "@mythrart/validations"
import type { JobCreatedResponse } from "@/app/types/api/job"

export const POST = withApiHandler(async (
    request: NextRequest,
): Promise<NextResponse<JobCreatedResponse>> => {

  const userId = getAuthenticatedUserIdFromHeaders(request.headers)

  if (!userId) {
      throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
  }

  const requestBody = await parseApiJsonObject(request)
  const { ebookId, format } = createExportJobRequestSchema.parse(requestBody)

  const canCreateExport = await hasEbookPermissionForUser({
    ebookId,
    userId,
    // Export is allowed if the user has read access to the ebook
    permission: CollaborationPermission.EBOOK_READ,
  })

  if (!canCreateExport) {
    throw new ApiException(HTTP_ERRORS.NOT_FOUND)
  }

  const exportJobId = await enqueueExportJob({ ebookId, format })

  return NextResponse.json({ jobId: exportJobId }, { status: 202 })
})