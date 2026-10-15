
import { NextRequest, NextResponse } from "next/server"

import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { mapBullMqState } from "@/lib/map-bull-mq-state"
import { getJobById } from "@/lib/queues/job-lookup"

export const GET = withApiHandler(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const userId = getAuthenticatedUserIdFromHeaders(req.headers)

    if (!userId) {
      throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const { id: jobId } = await params
    const job = await getJobById(jobId)

    if (!job) {
      throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const state = await job.getState()

    return NextResponse.json({
      id: job.id,
      status: mapBullMqState(state),
      result: state === "completed" ? job.returnvalue : null,
      error:
        state === "failed"
          ? job.failedReason ?? "Unknown error"
          : null,
    })
  },
)
