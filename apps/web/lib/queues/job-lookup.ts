import type { Job } from "@mythrart/redis"

import { getSnapshotQueue } from "./snapshot-queue"
import { getExportQueue } from "./export-queue"
import { getAnalysisSynopsisQueue } from "./analysis-synopsis-queue"

export async function getJobById(jobId: string): Promise<Job | null> {
  const queues = [
    getSnapshotQueue,
    getExportQueue,
    getAnalysisSynopsisQueue,
  ]

  for (const getQueue of queues) {
    const queue = await getQueue()
    const job = await queue.getJob(jobId)

    if (job) {
      return job
    }
  }

  return null
}
