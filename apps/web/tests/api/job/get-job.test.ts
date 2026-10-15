
import { beforeEach, describe, expect, test, vi } from "vitest"

import { GET } from "@/app/api/job/[id]/routes"
import {
  JobStatus,
  type JobGenerateSnapshotResult,
  type JobResponse,
} from "@/app/types/api/job"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import * as jobLookup from "@/lib/queues/job-lookup"

import { createJobRequest, jobRouteContext } from "./shared"

beforeEach(() => {
  vi.restoreAllMocks()
})

describe("GET /api/job/:id", () => {
  test("returns COMPLETED with snapshot result", async () => {
    const result = {
      snapshotId: "snapshot-1",
    } satisfies JobGenerateSnapshotResult

    const getJobSpy = vi
      .spyOn(jobLookup, "getJobById")
      .mockResolvedValue({
        id: "snapshot-job-1",
        getState: vi.fn().mockResolvedValue("completed"),
        returnvalue: result,
        failedReason: null,
      } as never)

    const response = await GET(
      createJobRequest("snapshot-job-1", "user-1"),
      jobRouteContext("snapshot-job-1"),
    )

    const body =
      (await response.json()) as JobResponse<JobGenerateSnapshotResult>

    expect(response.status).toBe(200)
    expect(body.id).toBe("snapshot-job-1")
    expect(body.status).toBe(JobStatus.COMPLETED)
    expect(body.result).toEqual(result)
    expect(body.error).toBeNull()
    expect(getJobSpy).toHaveBeenCalledWith("snapshot-job-1")
  })

  test("returns COMPLETED with export result", async () => {
    const result = {
      export: {
        id: "export-1",
        ebookId: "ebook-1",
        format: "pdf",
        status: "completed",
        createdAt: 1792000000000,
        file: {
          id: "file-1",
          key: "exports/ebook-1/document.pdf",
          bucket: "mythrart",
          sizeBytes: 245760,
          mimeType: "application/pdf",
          createdAt: 1792000000000,
        },
      },
    }

    const getJobSpy = vi
      .spyOn(jobLookup, "getJobById")
      .mockResolvedValue({
        id: "export-job-1",
        getState: vi.fn().mockResolvedValue("completed"),
        returnvalue: result,
        failedReason: null,
      } as never)

    const response = await GET(
      createJobRequest("export-job-1", "user-1"),
      jobRouteContext("export-job-1"),
    )

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.id).toBe("export-job-1")
    expect(body.status).toBe(JobStatus.COMPLETED)
    expect(body.result).toEqual(result)
    expect(body.result.export.file.key).toBe(
      "exports/ebook-1/document.pdf",
    )
    expect(body.error).toBeNull()
    expect(getJobSpy).toHaveBeenCalledWith("export-job-1")
  })

  test("returns COMPLETED with analysis synopsis result", async () => {
    // Payload représentatif : remplacer par le type et la structure
    // réels du résultat d'analyse synopsis lorsqu'ils sont définis.
    const result = {
      synopsis: "A test synopsis",
    }

    const getJobSpy = vi
      .spyOn(jobLookup, "getJobById")
      .mockResolvedValue({
        id: "analysis-synopsis-job-1",
        getState: vi.fn().mockResolvedValue("completed"),
        returnvalue: result,
        failedReason: null,
      } as never)

    const response = await GET(
      createJobRequest("analysis-synopsis-job-1", "user-1"),
      jobRouteContext("analysis-synopsis-job-1"),
    )

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.id).toBe("analysis-synopsis-job-1")
    expect(body.status).toBe(JobStatus.COMPLETED)
    expect(body.result).toEqual(result)
    expect(body.error).toBeNull()
    expect(getJobSpy).toHaveBeenCalledWith("analysis-synopsis-job-1")
  })

  test("returns FAILED with failed reason", async () => {
    vi.spyOn(jobLookup, "getJobById").mockResolvedValue({
      id: "job-failed-1",
      getState: vi.fn().mockResolvedValue("failed"),
      returnvalue: null,
      failedReason: "worker crashed",
    } as never)

    const response = await GET(
      createJobRequest("job-failed-1", "user-1"),
      jobRouteContext("job-failed-1"),
    )

    const body =
      (await response.json()) as JobResponse<JobGenerateSnapshotResult>

    expect(response.status).toBe(200)
    expect(body.id).toBe("job-failed-1")
    expect(body.status).toBe(JobStatus.FAILED)
    expect(body.result).toBeNull()
    expect(body.error).toBe("worker crashed")
  })

  test("returns PENDING for waiting state", async () => {
    vi.spyOn(jobLookup, "getJobById").mockResolvedValue({
      id: "job-waiting-1",
      getState: vi.fn().mockResolvedValue("waiting"),
      returnvalue: null,
      failedReason: null,
    } as never)

    const response = await GET(
      createJobRequest("job-waiting-1", "user-1"),
      jobRouteContext("job-waiting-1"),
    )

    const body =
      (await response.json()) as JobResponse<JobGenerateSnapshotResult>

    expect(response.status).toBe(200)
    expect(body.status).toBe(JobStatus.PENDING)
    expect(body.result).toBeNull()
    expect(body.error).toBeNull()
  })

  test("returns NOT_FOUND when job does not exist", async () => {
    const getJobSpy = vi
      .spyOn(jobLookup, "getJobById")
      .mockResolvedValue(null)

    const response = await GET(
      createJobRequest("job-missing", "user-1"),
      jobRouteContext("job-missing"),
    )

    const body = (await response.json()) as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
    expect(getJobSpy).toHaveBeenCalledWith("job-missing")
  })

  test("returns UNAUTHORIZED without authentication", async () => {
    const getJobSpy = vi.spyOn(jobLookup, "getJobById")

    const response = await GET(
      createJobRequest("job-any"),
      jobRouteContext("job-any"),
    )

    const body = (await response.json()) as ResponseErrorAPI

    expect(response.status).toBe(401)
    expect(body.code).toBe("UNAUTHORIZED")
    expect(getJobSpy).not.toHaveBeenCalled()
  })
})
