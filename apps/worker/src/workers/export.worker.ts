import { type Job, Worker } from "@mythrart/redis"

import {
  EXPORT_JOB_NAME,
  type ExportJobData,
  type ExportJobResult,
  exportJobDataSchema,
} from "../validations/export.job.js"
import { EXPORT_QUEUE_NAME } from "../queues/export.js"
import type { RegisteredWorker, WorkerDependencies } from "../types/index.js"
import { exportEbook } from "../services/index.js"

type ExportJob = Job<
  ExportJobData,
  ExportJobResult,
  string
>

export function createExportWorker({ connection, env, logger }: WorkerDependencies): RegisteredWorker {
  const worker = new Worker(
    EXPORT_QUEUE_NAME,
    async function (job: ExportJob): Promise<ExportJobResult> {
      switch (job.name) {
        case EXPORT_JOB_NAME:
          return await exportEbook(
            exportJobDataSchema.parse(job.data),
          )
        default:
          throw new Error(`Unknown job name: ${job.name}`)
      }
    },
    {
      connection,
      concurrency: env.WORKER_CONCURRENCY,
    },
  )

  worker.on("completed", (job: ExportJob) => {
    logger.info(
      {
        jobId: job.id,
        jobName: job.name,
        queue: EXPORT_QUEUE_NAME,
        ebookId: job.data?.ebookId,
        format: job.data?.format,
      },
      "Export job completed",
    )
  })

  worker.on("failed", (job: ExportJob | undefined, error: Error) => {
    logger.error(
      {
        err: error,
        jobId: job?.id,
        jobName: job?.name,
        queue: EXPORT_QUEUE_NAME,
        ebookId: job?.data?.ebookId,
        format: job?.data?.format,
      },
      "Export job failed",
    )
  })

  return {
    name: EXPORT_QUEUE_NAME,
    worker,
  }
}