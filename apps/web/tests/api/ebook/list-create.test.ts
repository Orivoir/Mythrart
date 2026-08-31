import { afterAll, beforeEach, expect, test } from "vitest"

import { GET, POST } from "@/app/api/ebooks/routes"
import type { CreateEbookResponseAPI, PaginatedEbooksAPI } from "@/app/types/api/ebook"
import { createEbooksFixture } from "../../helpers/factories"

import { authorizedRequest, setupEbookFixture, teardownEbookFixture } from "./shared"

let userId = ""

beforeEach(async () => {
    const user = await setupEbookFixture()
    userId = user.id
})

afterAll(async () => {
    await teardownEbookFixture()
})

test("GET /api/ebooks should return a empty list paginated result", async () => {
    const response = await GET(authorizedRequest("http://localhost:3000/api/ebooks", userId))
    const body = await response.json() as PaginatedEbooksAPI

    expect(response.status).toBe(200)
    expect(body.items).toEqual([])
    expect(body.page).toBe(1)
    expect(body.pageSize).toBe(10)
    expect(body.totalItems).toBe(0)
    expect(body.totalPages).toBe(1)
})

test("GET /api/ebooks should return many ebooks", async () => {
    const ebooksToCreate = [
        {
            title: "Ebook One",
            subtitle: "Sub One",
            shortDescription: "First",
        },
        {
            title: "Ebook Two",
            subtitle: "Sub Two",
            shortDescription: "Second",
        },
        {
            title: "Ebook Three",
            subtitle: "Sub Three",
            shortDescription: "Third",
        },
    ]

    const createdCount = await createEbooksFixture(userId, ebooksToCreate)
    expect(createdCount).toBe(3)

    const response = await GET(authorizedRequest("http://localhost:3000/api/ebooks?page=1&pageSize=10", userId))
    const body = await response.json() as PaginatedEbooksAPI

    expect(response.status).toBe(200)
    expect(body.items).toHaveLength(3)
    expect(body.totalItems).toBe(3)
    expect(body.page).toBe(1)
    expect(body.pageSize).toBe(10)
    expect(body.totalPages).toBe(1)
    expect(body.items.map((item) => item.title)).toEqual(
        expect.arrayContaining(["Ebook One", "Ebook Two", "Ebook Three"]),
    )
})

test("POST /api/ebooks should create a new ebook and return 201", async () => {
    const response = await POST(authorizedRequest("http://localhost:3000/api/ebooks", userId, {
        method: "POST",
        body: {
            title: "Created From POST",
            subtitle: "API",
            shortDescription: "Created in integration test",
        },
    }))
    const body = await response.json() as CreateEbookResponseAPI

    expect(response.status).toBe(201)
    expect(body.id).toBeDefined()
    expect(body.title).toBe("Created From POST")
    expect(body.subtitle).toBe("API")
    expect(body.shortDescription).toBe("Created in integration test")
    expect(typeof body.createdAt).toBe("number")
    expect(typeof body.updatedAt).toBe("number")
})
