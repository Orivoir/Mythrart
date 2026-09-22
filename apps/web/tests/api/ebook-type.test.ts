import { afterAll, beforeEach, expect, test } from "vitest"
import { NextRequest } from "next/server"

import { GET as GET_ALL } from "@/app/api/ebook-types/routes"
import { GET as GET_BY_ID } from "@/app/api/ebook-types/[id]/routes"
import type {
    EbookTypeResponseAPI,
    PaginatedEbookTypesAPI,
    ResponseErrorAPI,
} from "@/app/types/api/ebook-type"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import {
    createEbookTypeFixture,
    createUserFixture,
} from "../helpers/factories"
import prisma from "../helpers/prisma"
import resetDb from "../helpers/reset-db"

let userId = ""
let createdTypeId = ""

function routeContext(id: string) {
    return { params: Promise.resolve({ id }) }
}

function createRequest(options: {
    userId?: string
    url?: string
}): NextRequest {
    const url = options.url || "http://localhost:3000/api/ebook-types"
    return new NextRequest(url, {
        method: "GET",
        headers: {
            "content-type": "application/json",
            ...(options.userId ? { "x-auth-user-id": options.userId } : {}),
        },
    })
}

beforeEach(async () => {
    await resetDb()

    const user = await createUserFixture()
    userId = user.id

    const ebookType = await createEbookTypeFixture()
    createdTypeId = ebookType.id
})

afterAll(async () => {
    await resetDb()
})

test("GET /api/ebook-types returns 401 UNAUTHORIZED when user is not logged in", async () => {
    const response = await GET_ALL(createRequest({}))
    expect(response.status).toBe(401)
    const body = (await response.json()) as ResponseErrorAPI
    expect(body.code).toBe(HTTP_ERRORS.UNAUTHORIZED.code)
})

test("GET /api/ebook-types/[id] returns 401 UNAUTHORIZED when user is not logged in", async () => {
    const response = await GET_BY_ID(
        createRequest({ url: `http://localhost:3000/api/ebook-types/${createdTypeId}` }),
        routeContext(createdTypeId),
    )
    expect(response.status).toBe(401)
    const body = (await response.json()) as ResponseErrorAPI
    expect(body.code).toBe(HTTP_ERRORS.UNAUTHORIZED.code)
})

test("GET /api/ebook-types returns paginated list of ebook types for logged-in user", async () => {
    const response = await GET_ALL(
        createRequest({
            userId,
            url: "http://localhost:3000/api/ebook-types?page=1&pageSize=10",
        }),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as PaginatedEbookTypesAPI
    expect(body.page).toBe(1)
    expect(body.pageSize).toBe(10)
    expect(body.totalItems).toBeGreaterThanOrEqual(1)
    expect(body.items.length).toBeGreaterThanOrEqual(1)
    expect(body.items[0]).toHaveProperty("id")
    expect(body.items[0]).toHaveProperty("name")
    expect(body.items[0]).toHaveProperty("slug")
    expect(typeof body.items[0].createdAt).toBe("number")
    expect(typeof body.items[0].updatedAt).toBe("number")
})

test("GET /api/ebook-types/[id] returns 404 NOT_FOUND for non-existent ebook type", async () => {
    const response = await GET_BY_ID(
        createRequest({
            userId,
            url: "http://localhost:3000/api/ebook-types/non-existent-id",
        }),
        routeContext("non-existent-id"),
    )

    expect(response.status).toBe(404)
    const body = (await response.json()) as ResponseErrorAPI
    expect(body.code).toBe(HTTP_ERRORS.NOT_FOUND.code)
})

test("GET /api/ebook-types/[id] returns the ebook type details for logged-in user", async () => {
    const response = await GET_BY_ID(
        createRequest({
            userId,
            url: `http://localhost:3000/api/ebook-types/${createdTypeId}`,
        }),
        routeContext(createdTypeId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as EbookTypeResponseAPI
    expect(body.id).toBe(createdTypeId)
    expect(body.name).toBe("Roman")
    expect(body.slug).toMatch(/^roman-integration-test-/)
    expect(typeof body.createdAt).toBe("number")
    expect(typeof body.updatedAt).toBe("number")
})
