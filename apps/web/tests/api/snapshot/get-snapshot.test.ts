import { afterAll, beforeEach, expect, test, vi } from "vitest"
import { getSignedUrl } from "@mythrart/s3"

import { GET } from "@/app/api/snapshot/[id]/routes"
import type { SnapshotResponseAPI } from "@/app/types/api/snapshot"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"

import {
    createGetSnapshotRequest,
    createSnapshotRecordFixture,
    setupSnapshotFixture,
    snapshotRouteContext,
    teardownSnapshotFixture,
    type SnapshotFixture,
} from "./shared"

vi.mock("@mythrart/s3", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@mythrart/s3")>()

    return {
        ...actual,
        s3: {} as object,
        getSignedUrl: vi.fn(),
    }
})

let fixture: SnapshotFixture

beforeEach(async () => {
    vi.restoreAllMocks()
    fixture = await setupSnapshotFixture()
})

afterAll(async () => {
    await teardownSnapshotFixture()
})

test("GET /api/snapshot/{id} with permission as owner ebook should 200", async () => {
    const snapshotRecord = await createSnapshotRecordFixture({
        ebookId: fixture.ebookId,
        setAsCurrent: true,
    })

    vi.mocked(getSignedUrl).mockResolvedValue("https://example.test/download/current")

    const response = await GET(
        createGetSnapshotRequest(snapshotRecord.snapshotId, fixture.ownerId),
        snapshotRouteContext(snapshotRecord.snapshotId),
    )
    const body = await response.json() as SnapshotResponseAPI

    expect(response.status).toBe(200)
    expect(body.snapshot.id).toBe(snapshotRecord.snapshotId)
    expect(body.snapshot.ebookId).toBe(fixture.ebookId)
    expect(body.snapshot.version).toBe(snapshotRecord.version)
    expect(typeof body.snapshot.isCurrentSnapshot).toBe("boolean")
    expect(typeof body.snapshot.createdAt).toBe("number")
    expect(body.downloadUrl).toBe("https://example.test/download/current")

})

test("GET /api/snapshot/{id} with permission as collaborator should 200", async () => {
    const snapshotRecord = await createSnapshotRecordFixture({
        ebookId: fixture.ebookId,
        setAsCurrent: true,
    })

    vi.mocked(getSignedUrl).mockResolvedValue("https://example.test/download/collaborator")

    const response = await GET(
        createGetSnapshotRequest(snapshotRecord.snapshotId, fixture.authorCollaboratorId),
        snapshotRouteContext(snapshotRecord.snapshotId),
    )
    const body = await response.json() as SnapshotResponseAPI

    expect(response.status).toBe(200)
    expect(body.snapshot.id).toBe(snapshotRecord.snapshotId)
    expect(body.snapshot.ebookId).toBe(fixture.ebookId)
    expect(typeof body.snapshot.isCurrentSnapshot).toBe("boolean")
    expect(body.downloadUrl).toBe("https://example.test/download/collaborator")
})

test("GET /api/snapshot/{id} without permission should 404", async () => {
    const snapshotRecord = await createSnapshotRecordFixture({
        ebookId: fixture.ebookId,
    })

    const response = await GET(
        createGetSnapshotRequest(snapshotRecord.snapshotId, fixture.outsiderId),
        snapshotRouteContext(snapshotRecord.snapshotId),
    )
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
})

test("GET /api/snapshot/{id} without authentication should 401", async () => {
    const snapshotRecord = await createSnapshotRecordFixture({
        ebookId: fixture.ebookId,
    })

    const response = await GET(
        createGetSnapshotRequest(snapshotRecord.snapshotId),
        snapshotRouteContext(snapshotRecord.snapshotId),
    )
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(401)
    expect(body.code).toBe("UNAUTHORIZED")
})

test("GET  /api/snapshot/{id} with invalid snapshot id should 404", async () => {
    const response = await GET(
        createGetSnapshotRequest("snapshot-missing", fixture.ownerId),
        snapshotRouteContext("snapshot-missing"),
    )
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")

})
