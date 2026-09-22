import { afterAll, beforeEach, expect, test, vi } from "vitest"

import { POST } from "@/app/api/analysis-synopsis/routes"
import type { JobCreatedResponse } from "@/app/types/api/job"

import {
    analysisSynopsisRequest,
    setupAnalysisSynopsisFixture,
    teardownAnalysisSynopsisFixture,
} from "./shared"

let userId = ""
let outsiderId = ""
let assetId = ""

vi.mock("@/lib/queues/analysis-synopsis-queue", () => ({
    enqueueAnalysisSynopsisJob: vi.fn(),
}))

import { enqueueAnalysisSynopsisJob } from "@/lib/queues/analysis-synopsis-queue"

beforeEach(async () => {
    vi.clearAllMocks()

    const fixture = await setupAnalysisSynopsisFixture()

    userId = fixture.userId
    outsiderId = fixture.outsiderId
    assetId = fixture.assetId

    vi.mocked(enqueueAnalysisSynopsisJob).mockResolvedValue("job-123")
})

afterAll(async () => {
    await teardownAnalysisSynopsisFixture()
})

test("POST /api/analysis-synopsis creates a job for an owned asset", async () => {
    const response = await POST(
        analysisSynopsisRequest({
            userId,
            body: {
                assetId,
            },
        }),
    )

    const body = (await response.json()) as JobCreatedResponse

    expect(response.status).toBe(202)
    expect(body).toEqual({
        jobId: "job-123",
    })

    expect(enqueueAnalysisSynopsisJob).toHaveBeenCalledWith({
        assetId,
    })
})

test("POST /api/analysis-synopsis returns UNAUTHORIZED without auth", async () => {
    const response = await POST(
        analysisSynopsisRequest({
            body: {
                assetId,
            },
        }),
    )

    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.code).toBe("UNAUTHORIZED")

    expect(enqueueAnalysisSynopsisJob).not.toHaveBeenCalled()
})

test("POST /api/analysis-synopsis returns NOT_FOUND when asset belongs to another user", async () => {
    const response = await POST(
        analysisSynopsisRequest({
            userId: outsiderId,
            body: {
                assetId,
            },
        }),
    )

    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")

    expect(enqueueAnalysisSynopsisJob).not.toHaveBeenCalled()
})

test("POST /api/analysis-synopsis returns NOT_FOUND for an unknown asset", async () => {
    const response = await POST(
        analysisSynopsisRequest({
            userId,
            body: {
                assetId: "non-existent-asset",
            },
        }),
    )

    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")

    expect(enqueueAnalysisSynopsisJob).not.toHaveBeenCalled()
})