import { NextRequest, NextResponse } from "next/server"
import {getSnapshotQueue} from "@/lib/queues/snapshot-queue"
import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException, withApiHandler } from "@/lib/errors"
import { type JobResponse, type JobGenerateSnapshotResult } from "@/app/types/api/job"
import {mapBullMqState} from "@/lib/map-bull-mq-state"

export const GET = withApiHandler(async (
  req: NextRequest,
  {params}: { params: { id: string } }
): Promise<NextResponse<JobResponse<JobGenerateSnapshotResult>>> => {
    const userId = getAuthenticatedUserIdFromHeaders(req.headers)

    if (!userId) {
        throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
    }

    const jobId = params.id

    const snapshotQueue = await getSnapshotQueue()

    const job = await snapshotQueue.getJob(jobId)
    
    if (!job) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const state = await job.getState()

    return NextResponse.json({
      id: job.id!,
      status: mapBullMqState(state),

      result:
        state === "completed"
          ? (job.returnvalue as JobGenerateSnapshotResult)
          : null,

      error:
        state === "failed"
          ? job.failedReason ?? "Unknown error"
          : null,
    })

})
