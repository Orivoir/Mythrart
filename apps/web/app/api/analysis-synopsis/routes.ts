import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@mythrart/database"
import { createAnalysisSynopsisJobRequestSchema } from "@mythrart/validations"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import {
  ApiException,
  parseApiJsonObject,
  withApiHandler,
} from "@/lib/errors"
import { enqueueAnalysisSynopsisJob } from "@/lib/queues/analysis-synopsis-queue"

import type { JobCreatedResponse } from "@/app/types/api/job"

export const POST = withApiHandler(async (
  request: NextRequest,
): Promise<NextResponse<JobCreatedResponse>> => {

  const userId = getAuthenticatedUserIdFromHeaders(request.headers)

  if (!userId) {
    throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
  }

  const requestBody = await parseApiJsonObject(request)

  const { assetId } =
    createAnalysisSynopsisJobRequestSchema.parse(requestBody)

  const asset = await prisma.asset.findUnique({
    where: {
      id: assetId,
      ownerId: userId,
    },
  })

  if (!asset) {
    throw new ApiException(HTTP_ERRORS.NOT_FOUND)
  }

  const jobId = await enqueueAnalysisSynopsisJob({
    assetId,
  })

  return NextResponse.json(
    { jobId },
    { status: 202 },
  )
})