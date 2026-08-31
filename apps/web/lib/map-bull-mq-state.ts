import { JobStatus } from "@/app/types/api/job"

export function mapBullMqState(state: string): JobStatus {
  switch (state) {
    case "waiting":
    case "delayed":
    case "paused":
      return JobStatus.PENDING

    case "active":
      return JobStatus.RUNNING

    case "completed":
      return JobStatus.COMPLETED

    case "failed":
      return JobStatus.FAILED

    default:
      return JobStatus.PENDING
  }
}