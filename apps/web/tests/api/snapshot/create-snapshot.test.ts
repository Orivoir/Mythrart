import { afterAll, beforeEach, expect, test, vi } from "vitest"

import { POST } from "@/app/api/snapshot/routes"
import type { JobCreatedResponse } from "@/app/types/api/job"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import * as snapshotQueue from "@/lib/queues/snapshot-queue"

import {
    createSnapshotRequest,
    setupSnapshotFixture,
    teardownSnapshotFixture,
    type SnapshotFixture,
} from "./shared"

let fixture: SnapshotFixture

beforeEach(async () => {
    vi.restoreAllMocks()
    fixture = await setupSnapshotFixture()
})

afterAll(async () => {
    await teardownSnapshotFixture()
})

test("POST /api/snapshot returns 202 and enqueues snapshot job for ebook owner", async () => {
    const enqueueSnapshotJobSpy = vi
        .spyOn(snapshotQueue, "enqueueSnapshotJob")
        .mockResolvedValue("job-owner-1")

    const response = await POST(createSnapshotRequest({
        userId: fixture.ownerId,
        body: {
            ebookId: fixture.ebookId,
        },
    }))
    const body = await response.json() as JobCreatedResponse

    expect(response.status).toBe(202)
    expect(body.jobId).toBe("job-owner-1")
    expect(enqueueSnapshotJobSpy).toHaveBeenCalledTimes(1)
    expect(enqueueSnapshotJobSpy).toHaveBeenCalledWith({ ebookId: fixture.ebookId })
})

test("POST /api/snapshot allows collaborator with SNAPSHOT_CREATE permission", async () => {
    const enqueueSnapshotJobSpy = vi
        .spyOn(snapshotQueue, "enqueueSnapshotJob")
        .mockResolvedValue("job-collaborator-1")

    const response = await POST(createSnapshotRequest({
        userId: fixture.authorCollaboratorId,
        body: {
            ebookId: fixture.ebookId,
        },
    }))
    const body = await response.json() as JobCreatedResponse

    expect(response.status).toBe(202)
    expect(body.jobId).toBe("job-collaborator-1")
    expect(enqueueSnapshotJobSpy).toHaveBeenCalledWith({ ebookId: fixture.ebookId })
})

test("POST /api/snapshot denies collaborator without SNAPSHOT_CREATE permission", async () => {
    const enqueueSnapshotJobSpy = vi.spyOn(snapshotQueue, "enqueueSnapshotJob")

    const response = await POST(createSnapshotRequest({
        userId: fixture.proofreaderCollaboratorId,
        body: {
            ebookId: fixture.ebookId,
        },
    }))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
    expect(enqueueSnapshotJobSpy).not.toHaveBeenCalled()
})

test("POST /api/snapshot returns NOT_FOUND for user without access to ebook", async () => {
    const enqueueSnapshotJobSpy = vi.spyOn(snapshotQueue, "enqueueSnapshotJob")

    const response = await POST(createSnapshotRequest({
        userId: fixture.outsiderId,
        body: {
            ebookId: fixture.ebookId,
        },
    }))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
    expect(enqueueSnapshotJobSpy).not.toHaveBeenCalled()
})

test("POST /api/snapshot returns UNAUTHORIZED without authentication", async () => {
    const response = await POST(createSnapshotRequest({
        body: {
            ebookId: fixture.ebookId,
        },
    }))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(401)
    expect(body.code).toBe("UNAUTHORIZED")
})

test("POST /api/snapshot returns INVALID_JSON for malformed request body", async () => {
    const response = await POST(createSnapshotRequest({
        userId: fixture.ownerId,
        rawBody: "{invalid-json",
    }))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(400)
    expect(body.code).toBe("INVALID_JSON")
})

test("POST /api/snapshot returns VALIDATION_ERROR for non-object request body", async () => {
    const response = await POST(createSnapshotRequest({
        userId: fixture.ownerId,
        body: [],
    }))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(400)
    expect(body.code).toBe("VALIDATION_ERROR")
    expect(body.fields?.root).toContain("INVALID_REQUEST_BODY")
})

test("POST /api/snapshot returns VALIDATION_ERROR when ebookId is blank", async () => {
    const response = await POST(createSnapshotRequest({
        userId: fixture.ownerId,
        body: {
            ebookId: "   ",
        },
    }))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(400)
    expect(body.code).toBe("VALIDATION_ERROR")
    expect(body.fields?.ebookId).toBeDefined()
})
