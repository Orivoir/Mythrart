import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException } from "@/lib/errors"
import type { AnalysisSynopsisJobData } from "@mythrart/validations"
import { getRedisConnection, Queue } from "@mythrart/redis"

export const ANALYSIS_SYNOPSIS_QUEUE_NAME = "analysis-synopsis"
export const ANALYSIS_SYNOPSIS_JOB_NAME = "analysis.synopsis"

let analysisSynopsisQueue: Queue<AnalysisSynopsisJobData> | null = null

export async function getAnalysisSynopsisQueue(): Promise<
  Queue<AnalysisSynopsisJobData>
> {
  if (analysisSynopsisQueue) {
    return analysisSynopsisQueue
  }

  const connection = getRedisConnection()

  if (connection.status === "wait") {
    await connection.connect()
  }

  analysisSynopsisQueue = new Queue<AnalysisSynopsisJobData>(
    ANALYSIS_SYNOPSIS_QUEUE_NAME,
    {
      connection,
    },
  )

  return analysisSynopsisQueue
}

export async function enqueueAnalysisSynopsisJob(
  data: AnalysisSynopsisJobData,
): Promise<string> {
  const queue = await getAnalysisSynopsisQueue()
  const job = await queue.add(
    ANALYSIS_SYNOPSIS_JOB_NAME,
    data,
    {
      jobId: `analysis-synopsis-${data.assetId}`
    }
  )

  if (!job.id) {
    throw new ApiException(HTTP_ERRORS.INTERNAL_ERROR)
  }

  return String(job.id)
}