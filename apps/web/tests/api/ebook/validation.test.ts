import { afterAll, beforeEach, expect, test } from "vitest"
import { NextRequest } from "next/server"

import { POST } from "@/app/api/ebooks/routes"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import { MAX_LENGTH } from "@/lib/constants/limits"

import { setupEbookFixture, teardownEbookFixture } from "./shared"

let userId = ""

beforeEach(async () => {
    const user = await setupEbookFixture()
    userId = user.id
})

afterAll(async () => {
    await teardownEbookFixture()
})

test.each([
    [
        "title is missing",
        {
            subtitle: "Subtitle",
            shortDescription: "A valid description",
        },
        "title",
        "TITLE_REQUIRED",
    ],
    [
        "title is too long",
        {
            title: "a".repeat(MAX_LENGTH.TITLE_EBOOK + 1),
            subtitle: "Subtitle",
            shortDescription: "A valid description",
        },
        "title",
        "TITLE_TOO_LONG",
    ],
    [
        "subtitle is too short",
        {
            title: "Valid title",
            subtitle: "",
            shortDescription: "A valid description",
        },
        "subtitle",
        "SUBTITLE_TOO_SHORT",
    ],
    [
        "subtitle is too long",
        {
            title: "Valid title",
            subtitle: "a".repeat(MAX_LENGTH.SUBTITLE_EBOOK + 1),
            shortDescription: "A valid description",
        },
        "subtitle",
        "SUBTITLE_TOO_LONG",
    ],
    [
        "short description is too short",
        {
            title: "Valid title",
            subtitle: "Subtitle",
            shortDescription: "Short",
        },
        "shortDescription",
        "SHORT_DESCRIPTION_TOO_SHORT",
    ],
    [
        "short description is too long",
        {
            title: "Valid title",
            subtitle: "Subtitle",
            shortDescription: "a".repeat(MAX_LENGTH.SHORT_DESCRIPTION_EBOOK + 1),
        },
        "shortDescription",
        "SHORT_DESCRIPTION_TOO_LONG",
    ],
])("POST /api/ebooks returns a validation error when %s", async (_description, requestBody, field, errorCode) => {
    const request = new NextRequest("http://localhost:3000/api/ebooks", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-auth-user-id": userId,
        },
        body: JSON.stringify(requestBody),
    })

    const response = await POST(request)
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(400)
    expect(body.code).toBe("VALIDATION_ERROR")
    expect(body.message).toBe("Request validation failed")
    expect(body.fields?.[field]).toContain(errorCode)
})

test("POST /api/ebooks returns INVALID_JSON for malformed JSON", async () => {
    const request = new NextRequest("http://localhost:3000/api/ebooks", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-auth-user-id": userId,
        },
        body: "{invalid-json",
    })

    const response = await POST(request)
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(400)
    expect(body.code).toBe("INVALID_JSON")
    expect(body.message).toBe("Request body must be valid JSON")
})
