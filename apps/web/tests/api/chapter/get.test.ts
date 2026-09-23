import { afterAll, beforeEach, expect, test } from "vitest"
import { NextRequest } from "next/server"

import { GET } from "@/app/api/chapters/[id]/route"
import type {
    ChapterContentResponseAPI,
} from "@/app/types/api/chapter"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"

import {
    type ChapterFixture,
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

test("GET /api/chapters/:id returns the selected chapter for an owner", async () => {
    const request = new NextRequest(
        `http://localhost:3000/api/chapters/${fixture.chapterId}?locale=en`,
        {
            method: "GET",
            headers: {
                "x-auth-user-id": fixture.ownerId,
            },
        },
    )

    const response = await GET(
        request,
        routeContext(fixture.chapterId),
    )

    const body = await response.json() as ChapterContentResponseAPI

    expect(response.status).toBe(200)
    expect(body.id).toBe(fixture.chapterId)
    expect(body.ebookId).toBeTruthy()
    expect(body.title).toBe("Original chapter")
    expect(body.locale).toBe("en")
    expect(body.content).toEqual({
        blocks: ["original"],
    })
    expect(typeof body.createdAt).toBe("number")
    expect(typeof body.updatedAt).toBe("number")
})

test("GET /api/chapters/:id falls back to the chapter when the requested locale does not exist", async () => {
    const request = new NextRequest(
        `http://localhost:3000/api/chapters/${fixture.chapterId}?locale=de`,
        {
            method: "GET",
            headers: {
                "x-auth-user-id": fixture.ownerId,
            },
        },
    )

    const response = await GET(
        request,
        routeContext(fixture.chapterId),
    )

    const body = await response.json() as ChapterContentResponseAPI

    expect(response.status).toBe(200)
    expect(body.id).toBe(fixture.chapterId)
    expect(body.ebookId).toBeTruthy()
    expect(typeof body.position).toBe("number")

    expect(body.locale).toBe("de")
    expect(body.title).toBe("Original chapter")
    expect(body.content).toEqual({})

    expect(typeof body.createdAt).toBe("number")
    expect(typeof body.updatedAt).toBe("number")
})

test("GET /api/chapters/:id denies a collaborator without read permission", async () => {
    const request = new NextRequest(
        `http://localhost:3000/api/chapters/${fixture.chapterId}`,
        {
            method: "GET",
            headers: {
                "x-auth-user-id": "abc-def-123",
            },
        },
    )

    const response = await GET(
        request,
        routeContext(fixture.chapterId),
    )

    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
})