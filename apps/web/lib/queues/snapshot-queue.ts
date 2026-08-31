import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException } from "@/lib/errors"
import type { SnapshotJobData } from "@mythrart/validations"
import { getRedisConnection, Queue } from "@mythrart/redis"

export const SNAPSHOT_QUEUE_NAME = "snapshot"
export const SNAPSHOT_JOB_NAME = "snapshot.process"

let snapshotQueue: Queue<SnapshotJobData> | null = null

export async function getSnapshotQueue(): Promise<Queue<SnapshotJobData>> {
  if (snapshotQueue) {
    return snapshotQueue
  }

  const connection = getRedisConnection()

  if (connection.status === "wait") {
    await connection.connect()
  }

  snapshotQueue = new Queue<SnapshotJobData>(SNAPSHOT_QUEUE_NAME, {
    connection,
  })

  return snapshotQueue
}

export async function enqueueSnapshotJob(data: SnapshotJobData): Promise<string> {
  const queue = await getSnapshotQueue()
  const job = await queue.add(SNAPSHOT_JOB_NAME, data)

  if (!job.id) {
    throw new ApiException(HTTP_ERRORS.INTERNAL_ERROR)
  }

  return String(job.id)
}
