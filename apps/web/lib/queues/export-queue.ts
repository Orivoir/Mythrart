import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException } from "@/lib/errors"
import type { ExportJobData } from "@mythrart/validations"
import {getRedisConnection, Queue} from "@mythrart/redis"

export const EXPORT_QUEUE_NAME = "export"
export const EXPORT_JOB_NAME = "export.process"

let exportQueue: Queue<ExportJobData> | null = null


export async function getExportQueue(): Promise<Queue<ExportJobData>> {
  if (exportQueue) {
    return exportQueue
  }

  const connection = getRedisConnection()

  if (connection.status === "wait") {
    await connection.connect()
  }

  exportQueue = new Queue<ExportJobData>(EXPORT_QUEUE_NAME, {
    connection,
  })

  return exportQueue
}

export async function enqueueExportJob(data: ExportJobData): Promise<string> {
  const queue = await getExportQueue()
  const job = await queue.add(EXPORT_JOB_NAME, data)

  if (!job.id) {
    throw new ApiException(HTTP_ERRORS.INTERNAL_ERROR)
  }

  return String(job.id)
}
