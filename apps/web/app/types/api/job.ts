export interface JobCreatedResponse {
  jobId: string;
}

export enum JobStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface JobResponse<T = unknown> {
  id: string;
  status: JobStatus;

  // currently progress is not implemented by the worker
  // but it is a good idea to have it in the future
  // progress: number;
  // step?: string;

  result: T | null;

  error: string | null;
}

export interface JobGenerateSnapshotResult {
  snapshotId: string;
}