import { afterAll, beforeEach, expect, test, vi } from "vitest"

import { GET } from "@/app/api/job/[id]/routes"
import { JobStatus, type JobGenerateSnapshotResult, type JobResponse } from "@/app/types/api/job"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import * as snapshotQueue from "@/lib/queues/snapshot-queue"

import {
    createJobRequest,
    jobRouteContext,
    setupSnapshotFixture,
    teardownSnapshotFixture,
    type SnapshotFixture,
} from "../snapshot/shared"

let fixture: SnapshotFixture

beforeEach(async () => {
    vi.restoreAllMocks()
    fixture = await setupSnapshotFixture()
})

afterAll(async () => {
    await teardownSnapshotFixture()
})

test("GET /api/job/:id returns COMPLETED with result payload", async () => {
    const fakeJob = {
        id: "job-completed-1",
        getState: vi.fn().mockResolvedValue("completed"),
        returnvalue: {
            snapshotId: "snapshot-1",
        } satisfies JobGenerateSnapshotResult,
        failedReason: null,
    }

    const getJobSpy = vi.fn().mockResolvedValue(fakeJob)

    vi.spyOn(snapshotQueue, "getSnapshotQueue").mockResolvedValue({
        getJob: getJobSpy,
    } as never)

    const response = await GET(
        createJobRequest("job-completed-1", fixture.ownerId),
        jobRouteContext("job-completed-1"),
    )
    const body = await response.json() as JobResponse<JobGenerateSnapshotResult>

    expect(response.status).toBe(200)
    expect(body.id).toBe("job-completed-1")
    expect(body.status).toBe(JobStatus.COMPLETED)
    expect(body.result).toEqual({ snapshotId: "snapshot-1" })
    expect(body.error).toBeNull()
    expect(getJobSpy).toHaveBeenCalledWith("job-completed-1")
})

test("GET /api/job/:id returns FAILED with failed reason", async () => {
    const fakeJob = {
        id: "job-failed-1",
        getState: vi.fn().mockResolvedValue("failed"),
        returnvalue: null,
        failedReason: "worker crashed",
    }

    vi.spyOn(snapshotQueue, "getSnapshotQueue").mockResolvedValue({
        getJob: vi.fn().mockResolvedValue(fakeJob),
    } as never)

    const response = await GET(
        createJobRequest("job-failed-1", fixture.ownerId),
        jobRouteContext("job-failed-1"),
    )
    const body = await response.json() as JobResponse<JobGenerateSnapshotResult>

    expect(response.status).toBe(200)
    expect(body.id).toBe("job-failed-1")
    expect(body.status).toBe(JobStatus.FAILED)
    expect(body.result).toBeNull()
    expect(body.error).toBe("worker crashed")
})

test("GET /api/job/:id returns PENDING for waiting state", async () => {
    const fakeJob = {
        id: "job-waiting-1",
        getState: vi.fn().mockResolvedValue("waiting"),
        returnvalue: null,
        failedReason: null,
    }

    vi.spyOn(snapshotQueue, "getSnapshotQueue").mockResolvedValue({
        getJob: vi.fn().mockResolvedValue(fakeJob),
    } as never)

    const response = await GET(
        createJobRequest("job-waiting-1", fixture.ownerId),
        jobRouteContext("job-waiting-1"),
    )
    const body = await response.json() as JobResponse<JobGenerateSnapshotResult>

    expect(response.status).toBe(200)
    expect(body.status).toBe(JobStatus.PENDING)
    expect(body.result).toBeNull()
    expect(body.error).toBeNull()
})

test("GET /api/job/:id returns NOT_FOUND when job does not exist", async () => {
    vi.spyOn(snapshotQueue, "getSnapshotQueue").mockResolvedValue({
        getJob: vi.fn().mockResolvedValue(null),
    } as never)

    const response = await GET(
        createJobRequest("job-missing", fixture.ownerId),
        jobRouteContext("job-missing"),
    )
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
})

test("GET /api/job/:id returns UNAUTHORIZED without authentication", async () => {
    const response = await GET(
        createJobRequest("job-any"),
        jobRouteContext("job-any"),
    )
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(401)
    expect(body.code).toBe("UNAUTHORIZED")
})
