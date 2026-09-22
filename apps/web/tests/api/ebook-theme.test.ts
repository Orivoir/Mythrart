import { afterAll, beforeEach, expect, test } from "vitest"
import { NextRequest } from "next/server"

import { DELETE, GET, POST, PUT } from "@/app/api/ebooks/[id]/theme/routes"
import type {
    CreateEbookThemeResponseAPI,
    DeleteEbookThemeResponseAPI,
    PaginatedEbookThemesAPI,
    UpdateEbookThemeResponseAPI,
} from "@/app/types/api/theme"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import {
    createEbookThemeFixture,
    createEbookTypeFixture,
    createUserFixture,
} from "../helpers/factories"
import prisma from "../helpers/prisma"
import resetDb from "../helpers/reset-db"

let ownerId = ""
let otherUserId = ""
let ebookId = ""

function routeContext(id: string) {
    return { params: Promise.resolve({ id }) }
}

function createRequest(options: {
    method?: string
    userId?: string
    url?: string
    body?: Record<string, unknown>
}): NextRequest {
    const url = options.url || `http://localhost:3000/api/ebooks/${ebookId}/theme`
    return new NextRequest(url, {
        method: options.method || "GET",
        headers: {
            "content-type": "application/json",
            ...(options.userId ? { "x-auth-user-id": options.userId } : {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    })
}

beforeEach(async () => {
    await resetDb()

    const owner = await createUserFixture()
    const otherUser = await createUserFixture()
    ownerId = owner.id
    otherUserId = otherUser.id

    const ebookType = await createEbookTypeFixture()
    const ebookTheme = await createEbookThemeFixture()

    const ebook = await prisma.ebook.create({
        data: {
            title: "Ebook for theme test",
            ownerId,
            ebookTypeId: ebookType.id,
            ebookThemeId: ebookTheme.id,
        },
    })

    ebookId = ebook.id
})

afterAll(async () => {
    await resetDb()
})

test("All routes return 401 UNAUTHORIZED when user is not logged in", async () => {
    const getRes = await GET(createRequest({ method: "GET" }), routeContext(ebookId))
    expect(getRes.status).toBe(401)
    const getBody = (await getRes.json()) as ResponseErrorAPI
    expect(getBody.code).toBe(HTTP_ERRORS.UNAUTHORIZED.code)

    const postRes = await POST(
        createRequest({
            method: "POST",
            body: {
                name: "Theme 1",
                backgroundColor: "#fff",
                textColor: "#000",
                textFont: "Arial",
                titleFont: "Arial",
            },
        }),
        routeContext(ebookId),
    )
    expect(postRes.status).toBe(401)

    const putRes = await PUT(
        createRequest({
            method: "PUT",
            body: {
                name: "Theme 1 Updated",
            },
        }),
        routeContext(ebookId),
    )
    expect(putRes.status).toBe(401)

    const deleteRes = await DELETE(createRequest({ method: "DELETE" }), routeContext(ebookId))
    expect(deleteRes.status).toBe(401)
})

test("All routes return 404 NOT_FOUND when user does not have access to the ebook", async () => {
    const getRes = await GET(
        createRequest({ method: "GET", userId: otherUserId }),
        routeContext(ebookId),
    )
    expect(getRes.status).toBe(404)

    const postRes = await POST(
        createRequest({
            method: "POST",
            userId: otherUserId,
            body: {
                name: "Theme 1",
                backgroundColor: "#fff",
                textColor: "#000",
                textFont: "Arial",
                titleFont: "Arial",
            },
        }),
        routeContext(ebookId),
    )
    expect(postRes.status).toBe(404)
})

test("GET /api/ebooks/:id/theme returns paginated themes", async () => {
    const response = await GET(
        createRequest({
            method: "GET",
            userId: ownerId,
            url: `http://localhost:3000/api/ebooks/${ebookId}/theme?page=1&pageSize=10`,
        }),
        routeContext(ebookId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as PaginatedEbookThemesAPI
    expect(body.page).toBe(1)
    expect(body.pageSize).toBe(10)
    expect(body.totalItems).toBeGreaterThanOrEqual(1)
    expect(body.items.length).toBeGreaterThanOrEqual(1)
    expect(body.items[0]).toHaveProperty("id")
    expect(body.items[0]).toHaveProperty("name")
    expect(body.items[0]).toHaveProperty("slug")
    expect(typeof body.items[0].createdAt).toBe("number")
})

test("POST /api/ebooks/:id/theme creates a new theme", async () => {
    const response = await POST(
        createRequest({
            method: "POST",
            userId: ownerId,
            body: {
                name: "Cyberpunk Glow",
                description: "Neon aesthetic",
                backgroundColor: "#0d0d1a",
                textColor: "#00ffcc",
                textFont: "Fira Code",
                titleFont: "Orbitron",
                subtitleFont: "Fira Code",
                headingColor: "#ff007f",
                fontSize: "18px",
                lineHeight: "1.8",
                paragraphSpacing: "1.2rem",
                headingSpacing: "2rem",
            },
        }),
        routeContext(ebookId),
    )

    expect(response.status).toBe(201)
    const body = (await response.json()) as CreateEbookThemeResponseAPI
    expect(body.name).toBe("Cyberpunk Glow")
    expect(body.slug).toContain("cyberpunk-glow")
    expect(body.description).toBe("Neon aesthetic")
    expect(body.backgroundColor).toBe("#0d0d1a")
    expect(body.textColor).toBe("#00ffcc")
    expect(body.textFont).toBe("Fira Code")
    expect(body.titleFont).toBe("Orbitron")
    expect(typeof body.createdAt).toBe("number")
    expect(typeof body.updatedAt).toBe("number")
})

test("PUT /api/ebooks/:id/theme updates an existing theme", async () => {
    const theme = await prisma.ebookTheme.create({
        data: {
            name: "Vintage Papyrus",
            slug: `vintage-papyrus-${Date.now()}`,
            backgroundColor: "#fdf6e2",
            textColor: "#2b2b2b",
            textFont: "Georgia",
            titleFont: "Cinzel",
        },
    })

    const response = await PUT(
        createRequest({
            method: "PUT",
            userId: ownerId,
            body: {
                themeId: theme.id,
                name: "Vintage Parchment",
                backgroundColor: "#faf0d7",
            },
        }),
        routeContext(ebookId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as UpdateEbookThemeResponseAPI
    expect(body.id).toBe(theme.id)
    expect(body.name).toBe("Vintage Parchment")
    expect(body.backgroundColor).toBe("#faf0d7")
})

test("DELETE /api/ebooks/:id/theme blocks deletion when theme is used by an ebook", async () => {
    const ebook = await prisma.ebook.findUnique({
        where: { id: ebookId },
        select: { ebookThemeId: true },
    })

    const response = await DELETE(
        createRequest({
            method: "DELETE",
            userId: ownerId,
            url: `http://localhost:3000/api/ebooks/${ebookId}/theme?themeId=${ebook?.ebookThemeId}`,
        }),
        routeContext(ebookId),
    )

    expect(response.status).toBe(400)
    const body = (await response.json()) as ResponseErrorAPI
    expect(body.code).toBe(HTTP_ERRORS.VALIDATION_ERROR.code)
})

test("DELETE /api/ebooks/:id/theme deletes an unused theme", async () => {
    const theme = await prisma.ebookTheme.create({
        data: {
            name: "Unused Theme",
            slug: `unused-theme-${Date.now()}`,
            backgroundColor: "#111111",
            textColor: "#ffffff",
            textFont: "Roboto",
            titleFont: "Roboto",
        },
    })

    const response = await DELETE(
        createRequest({
            method: "DELETE",
            userId: ownerId,
            body: {
                themeId: theme.id,
            },
        }),
        routeContext(ebookId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as DeleteEbookThemeResponseAPI
    expect(body.success).toBe(true)

    const inDb = await prisma.ebookTheme.findUnique({
        where: { id: theme.id },
    })
    expect(inDb).toBeNull()
})
