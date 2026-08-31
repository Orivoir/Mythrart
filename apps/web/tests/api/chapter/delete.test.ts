import { afterAll, beforeEach, expect, test } from "vitest"

import { DELETE } from "@/app/api/chapters/[id]/routes"
import type { DeleteChapterResponseAPI } from "@/app/types/api/chapter"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import prisma from "../../helpers/prisma"

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

test("DELETE /api/chapters/:id deletes an owned chapter", async () => {
    const response = await DELETE(chapterRequest({
        chapterId: fixture.chapterId,
        method: "DELETE",
        defaultOwnerId: fixture.ownerId,
    }), routeContext(fixture.chapterId))
    const body = await response.json() as DeleteChapterResponseAPI

    expect(response.status).toBe(200)
    expect(body).toEqual({ success: true })
    expect(await prisma.chapter.findUnique({ where: { id: fixture.chapterId } })).toBeNull()
})

test("DELETE /api/chapters/:id allows author collaborator to delete permitted chapter", async () => {
    const response = await DELETE(chapterRequest({
        chapterId: fixture.chapterId,
        method: "DELETE",
        authUserId: fixture.authorCollaboratorId,
        defaultOwnerId: fixture.ownerId,
    }), routeContext(fixture.chapterId))
    const body = await response.json() as DeleteChapterResponseAPI

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(await prisma.chapter.findUnique({ where: { id: fixture.chapterId } })).toBeNull()
})

test("DELETE /api/chapters/:id denies proofreader collaborator without delete permission", async () => {
    const response = await DELETE(chapterRequest({
        chapterId: fixture.chapterId,
        method: "DELETE",
        authUserId: fixture.proofreaderCollaboratorId,
        defaultOwnerId: fixture.ownerId,
    }), routeContext(fixture.chapterId))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
})

test.each([
    ["is unauthenticated", false, "current", "UNAUTHORIZED", 401],
    ["does not exist", true, "missing", "NOT_FOUND", 404],
    ["belongs to another user", true, "other", "NOT_FOUND", 404],
])("DELETE /api/chapters/:id returns an error when it %s", async (_description, authenticated, target, code, status) => {
    const id = target === "current"
        ? fixture.chapterId
        : target === "other"
            ? fixture.otherChapterId
            : "missing-chapter"

    const request = chapterRequest({
        chapterId: fixture.chapterId,
        method: "DELETE",
        authenticated,
        defaultOwnerId: fixture.ownerId,
    })
    const response = await DELETE(request, routeContext(id))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(status)
    expect(body.code).toBe(code)
})
