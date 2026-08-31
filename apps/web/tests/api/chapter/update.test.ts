import { afterAll, beforeEach, expect, test } from "vitest"

import { PUT } from "@/app/api/chapters/[id]/routes"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import type { UpdateChapterResponseAPI } from "@/app/types/api/chapter"
import { MAX_LENGTH } from "@/lib/constants/limits"

import {
    type ChapterFixture,
    chapterRequest,
    routeContext,
    setupChapterFixture,
    teardownChapterFixture,
} from "./shared"

let fixture: ChapterFixture

beforeEach(async () => {
    fixture = await setupChapterFixture()
})

afterAll(async () => {
    await teardownChapterFixture()
})

test("PUT /api/chapters/:id updates an owned chapter title and content", async () => {
    const request = chapterRequest({
        chapterId: fixture.chapterId,
        method: "PUT",
        body: JSON.stringify({
            title: "Updated chapter",
            content: { blocks: ["updated"] },
        }),
        defaultOwnerId: fixture.ownerId,
    })

    const response = await PUT(request, routeContext(fixture.chapterId))
    const body = await response.json() as UpdateChapterResponseAPI

    expect(response.status).toBe(200)
    expect(body.id).toBe(fixture.chapterId)
    expect(body.position).toBe(0)
    expect(body.title).toBe("Updated chapter")
    expect(body.content).toEqual({ blocks: ["updated"] })
    expect(typeof body.createdAt).toBe("number")
    expect(typeof body.updatedAt).toBe("number")
})

test("PUT /api/chapters/:id updates content without changing the title", async () => {
    const request = chapterRequest({
        chapterId: fixture.chapterId,
        method: "PUT",
        body: JSON.stringify({ content: { blocks: ["content only"] } }),
        defaultOwnerId: fixture.ownerId,
    })

    const response = await PUT(request, routeContext(fixture.chapterId))
    const body = await response.json() as UpdateChapterResponseAPI

    expect(response.status).toBe(200)
    expect(body.position).toBe(0)
    expect(body.title).toBe("Original chapter")
    expect(body.content).toEqual({ blocks: ["content only"] })
})

test("PUT /api/chapters/:id allows an author collaborator with scoped chapter access", async () => {
    const request = chapterRequest({
        chapterId: fixture.chapterId,
        method: "PUT",
        body: JSON.stringify({ title: "Collaborator update" }),
        authUserId: fixture.authorCollaboratorId,
        defaultOwnerId: fixture.ownerId,
    })

    const response = await PUT(request, routeContext(fixture.chapterId))
    const body = await response.json() as UpdateChapterResponseAPI

    expect(response.status).toBe(200)
    expect(body.title).toBe("Collaborator update")
})

test("PUT /api/chapters/:id denies a proofreader collaborator without update permission", async () => {
    const request = chapterRequest({
        chapterId: fixture.chapterId,
        method: "PUT",
        body: JSON.stringify({ title: "Should fail" }),
        authUserId: fixture.proofreaderCollaboratorId,
        defaultOwnerId: fixture.ownerId,
    })

    const response = await PUT(request, routeContext(fixture.chapterId))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
})

test("PUT /api/chapters/:id denies collaborator outside scoped chapter access", async () => {
    const request = chapterRequest({
        chapterId: fixture.secondChapterId,
        method: "PUT",
        body: JSON.stringify({ title: "Should fail for scope" }),
        authUserId: fixture.authorCollaboratorId,
        defaultOwnerId: fixture.ownerId,
    })

    const response = await PUT(request, routeContext(fixture.secondChapterId))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
})

test("PUT /api/chapters/:id ignores body.id and uses the route param id", async () => {
    const request = chapterRequest({
        chapterId: fixture.chapterId,
        method: "PUT",
        body: JSON.stringify({
            id: "123456",
            title: "Updated from route id",
        }),
        defaultOwnerId: fixture.ownerId,
    })

    const response = await PUT(request, routeContext(fixture.chapterId))
    const body = await response.json() as UpdateChapterResponseAPI

    expect(response.status).toBe(200)
    expect(body.id).toBe(fixture.chapterId)
    expect(body.title).toBe("Updated from route id")
})

test.each([
    ["too short", "", "CHAPTER_TITLE_TOO_SHORT"],
    ["too long", "a".repeat(MAX_LENGTH.TITLE_CHAPTER + 1), "CHAPTER_TITLE_TOO_LONG"],
])("PUT /api/chapters/:id returns a validation error when the title is %s", async (_description, title, fieldCode) => {
    const request = chapterRequest({
        chapterId: fixture.chapterId,
        method: "PUT",
        body: JSON.stringify({ title }),
        defaultOwnerId: fixture.ownerId,
    })

    const response = await PUT(request, routeContext(fixture.chapterId))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(400)
    expect(body.code).toBe("VALIDATION_ERROR")
    expect(body.fields?.title).toContain(fieldCode)
})

test("PUT /api/chapters/:id returns INVALID_JSON for malformed JSON", async () => {
    const response = await PUT(chapterRequest({
        chapterId: fixture.chapterId,
        method: "PUT",
        body: "{invalid-json",
        defaultOwnerId: fixture.ownerId,
    }), routeContext(fixture.chapterId))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(400)
    expect(body.code).toBe("INVALID_JSON")
})

test("PUT /api/chapters/:id rejects a non-object request body", async () => {
    const response = await PUT(chapterRequest({
        chapterId: fixture.chapterId,
        method: "PUT",
        body: "[]",
        defaultOwnerId: fixture.ownerId,
    }), routeContext(fixture.chapterId))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(400)
    expect(body.code).toBe("VALIDATION_ERROR")
    expect(body.fields?.root).toContain("INVALID_REQUEST_BODY")
})

test.each([
    ["is unauthenticated", false, "current", "UNAUTHORIZED", 401],
    ["does not exist", true, "missing", "NOT_FOUND", 404],
    ["belongs to another user", true, "other", "NOT_FOUND", 404],
])("PUT /api/chapters/:id returns an error when it %s", async (_description, authenticated, target, code, status) => {
    const id = target === "current"
        ? fixture.chapterId
        : target === "other"
            ? fixture.otherChapterId
            : "missing-chapter"

    const request = chapterRequest({
        chapterId: fixture.chapterId,
        method: "PUT",
        body: JSON.stringify({ title: "Updated" }),
        authenticated,
        defaultOwnerId: fixture.ownerId,
    })
    const response = await PUT(request, routeContext(id))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(status)
    expect(body.code).toBe(code)
})
