import { afterAll, beforeEach, expect, test } from "vitest"
import { NextRequest } from "next/server"

import { GET } from "@/app/api/chapters/[id]/scenes/routes"
import type { PaginatedScenesAPI, ResponseErrorAPI } from "@/app/types/api/scene"
import { CollaborationRole } from "@mythrart/database"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import {
    createEbookThemeFixture,
    createEbookTypeFixture,
    createUserFixture,
} from "../helpers/factories"
import prisma from "../helpers/prisma"
import resetDb from "../helpers/reset-db"

let ownerId = ""
let authorCollaboratorId = ""
let unauthorizedUserId = ""
let chapterId = ""

function routeContext(id: string) {
    return { params: Promise.resolve({ id }) }
}

function createRequest(options: {
    userId?: string
    url?: string
}): NextRequest {
    const url = options.url || `http://localhost:3000/api/chapters/${chapterId}/scenes`
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

    const owner = await createUserFixture()
    const authorCollaborator = await createUserFixture()
    const unauthorizedUser = await createUserFixture()

    ownerId = owner.id
    authorCollaboratorId = authorCollaborator.id
    unauthorizedUserId = unauthorizedUser.id

    const ebookType = await createEbookTypeFixture()
    const ebookTheme = await createEbookThemeFixture()

    const ebook = await prisma.ebook.create({
        data: {
            title: "Ebook with chapters and scenes",
            ownerId,
            ebookTypeId: ebookType.id,
            ebookThemeId: ebookTheme.id,
        },
    })

    const chapter = await prisma.chapter.create({
        data: {
            ebookId: ebook.id,
            title: "Chapter 1",
            position: 0,
        },
    })
    chapterId = chapter.id

    await prisma.ebookCollaborator.create({
        data: {
            ebookId: ebook.id,
            userId: authorCollaboratorId,
            role: CollaborationRole.AUTHOR,
            allChaptersAccess: true,
        },
    })

    // Create 3 scenes for this chapter
    await prisma.scene.createMany({
        data: [
            {
                chapterId,
                title: "Opening Scene",
                objective: "Introduce protagonist",
                order: 0,
            },
            {
                chapterId,
                title: "Inciting Incident",
                objective: "Disrupt normal life",
                order: 1,
            },
            {
                chapterId,
                title: "Rising Action",
                objective: "Face first challenge",
                order: 2,
            },
        ],
    })
})

afterAll(async () => {
    await resetDb()
})

test("GET /api/chapters/:id/scenes returns 401 UNAUTHORIZED when user is not logged in", async () => {
    const response = await GET(
        createRequest({}),
        routeContext(chapterId),
    )

    expect(response.status).toBe(401)
    const body = (await response.json()) as ResponseErrorAPI
    expect(body.code).toBe(HTTP_ERRORS.UNAUTHORIZED.code)
})

test("GET /api/chapters/:id/scenes returns 404 NOT_FOUND for non-existent chapter", async () => {
    const response = await GET(
        createRequest({ userId: ownerId }),
        routeContext("non-existent-chapter-id"),
    )

    expect(response.status).toBe(404)
    const body = (await response.json()) as ResponseErrorAPI
    expect(body.code).toBe(HTTP_ERRORS.NOT_FOUND.code)
})

test("GET /api/chapters/:id/scenes returns 404 NOT_FOUND when user does not have permission", async () => {
    const response = await GET(
        createRequest({ userId: unauthorizedUserId }),
        routeContext(chapterId),
    )

    expect(response.status).toBe(404)
    const body = (await response.json()) as ResponseErrorAPI
    expect(body.code).toBe(HTTP_ERRORS.NOT_FOUND.code)
})

test("GET /api/chapters/:id/scenes returns paginated scenes for owner", async () => {
    const response = await GET(
        createRequest({
            userId: ownerId,
            url: `http://localhost:3000/api/chapters/${chapterId}/scenes?page=1&pageSize=2`,
        }),
        routeContext(chapterId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as PaginatedScenesAPI
    expect(body.page).toBe(1)
    expect(body.pageSize).toBe(2)
    expect(body.totalItems).toBe(3)
    expect(body.totalPages).toBe(2)
    expect(body.items).toHaveLength(2)
    expect(body.items[0].title).toBe("Opening Scene")
    expect(body.items[0].chapterId).toBe(chapterId)
    expect(body.items[0].objective).toBe("Introduce protagonist")
    expect(typeof body.items[0].createdAt).toBe("number")
    expect(typeof body.items[0].updatedAt).toBe("number")
    expect(body.items[1].title).toBe("Inciting Incident")
})

test("GET /api/chapters/:id/scenes returns scenes for authorized collaborator", async () => {
    const response = await GET(
        createRequest({
            userId: authorCollaboratorId,
            url: `http://localhost:3000/api/chapters/${chapterId}/scenes?page=1&pageSize=10`,
        }),
        routeContext(chapterId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as PaginatedScenesAPI
    expect(body.totalItems).toBe(3)
    expect(body.items).toHaveLength(3)
})
