import { afterAll, beforeEach, expect, test } from "vitest"
import { NextRequest } from "next/server"

import { GET as GET_ALL, POST } from "@/app/api/ebooks/[id]/entities/routes"
import { DELETE, GET as GET_BY_ID, PUT } from "@/app/api/ebooks/[id]/entities/[entityId]/routes"
import type {
    CreateEbookEntityResponseAPI,
    DeleteEbookEntityResponseAPI,
    EbookEntityResponseAPI,
    PaginatedEbookEntitiesAPI,
    UpdateEbookEntityResponseAPI,
} from "@/app/types/api/ebook-entity"
import { CollaborationRole, EbookEntityType } from "@mythrart/database"
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
let ebookId = ""
let createdEntityId = ""

function routeContext(id: string): { params: Promise<{ id: string; ebookId: string }> }
function routeContext(id: string, entityId: string): { params: Promise<{ id: string; ebookId: string; entityId: string }> }
function routeContext(id: string, entityId?: string) {
    return {
        params: Promise.resolve(
            entityId
                ? { id, ebookId: id, entityId }
                : { id, ebookId: id },
        ),
    }
}

function createRequest(options: {
    method?: string
    userId?: string
    url?: string
    body?: Record<string, unknown>
}): NextRequest {
    const url = options.url || `http://localhost:3000/api/ebooks/${ebookId}/entities`
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
    const authorCollaborator = await createUserFixture()
    const unauthorizedUser = await createUserFixture()

    ownerId = owner.id
    authorCollaboratorId = authorCollaborator.id
    unauthorizedUserId = unauthorizedUser.id

    const ebookType = await createEbookTypeFixture()
    const ebookTheme = await createEbookThemeFixture()

    const ebook = await prisma.ebook.create({
        data: {
            title: "Ebook for entity tests",
            ownerId,
            ebookTypeId: ebookType.id,
            ebookThemeId: ebookTheme.id,
        },
    })
    ebookId = ebook.id

    await prisma.ebookCollaborator.create({
        data: {
            ebookId,
            userId: authorCollaboratorId,
            role: CollaborationRole.AUTHOR,
            allChaptersAccess: true,
        },
    })

    const entity = await prisma.ebookEntity.create({
        data: {
            ebookId,
            name: "Arthur Pendragon",
            slug: "arthur-pendragon",
            type: EbookEntityType.CHARACTER,
            description: "Legendary king",
        },
    })
    createdEntityId = entity.id

    await prisma.ebookEntity.create({
        data: {
            ebookId,
            name: "Camelot",
            slug: "camelot",
            type: EbookEntityType.LOCATION,
            description: "The capital fortress",
        },
    })
})

afterAll(async () => {
    await resetDb()
})

test("All /api/ebooks/:id/entities routes return 401 UNAUTHORIZED when not logged in", async () => {
    const getRes = await GET_ALL(
        createRequest({ method: "GET" }),
        routeContext(ebookId),
    )
    expect(getRes.status).toBe(401)

    const postRes = await POST(
        createRequest({
            method: "POST",
            body: {
                name: "Merlin",
                type: EbookEntityType.CHARACTER,
            },
        }),
        routeContext(ebookId),
    )
    expect(postRes.status).toBe(401)

    const getByIdRes = await GET_BY_ID(
        createRequest({
            method: "GET",
            url: `http://localhost:3000/api/ebooks/${ebookId}/entities/${createdEntityId}`,
        }),
        routeContext(ebookId, createdEntityId),
    )
    expect(getByIdRes.status).toBe(401)

    const putRes = await PUT(
        createRequest({
            method: "PUT",
            url: `http://localhost:3000/api/ebooks/${ebookId}/entities/${createdEntityId}`,
            body: { name: "King Arthur" },
        }),
        routeContext(ebookId, createdEntityId),
    )
    expect(putRes.status).toBe(401)

    const deleteRes = await DELETE(
        createRequest({
            method: "DELETE",
            url: `http://localhost:3000/api/ebooks/${ebookId}/entities/${createdEntityId}`,
        }),
        routeContext(ebookId, createdEntityId),
    )
    expect(deleteRes.status).toBe(401)
})

test("All /api/ebooks/:id/entities routes return 404 for unauthorized user", async () => {
    const getRes = await GET_ALL(
        createRequest({ method: "GET", userId: unauthorizedUserId }),
        routeContext(ebookId),
    )
    expect(getRes.status).toBe(404)

    const postRes = await POST(
        createRequest({
            method: "POST",
            userId: unauthorizedUserId,
            body: {
                name: "Unauthorized Entity",
                type: EbookEntityType.CHARACTER,
            },
        }),
        routeContext(ebookId),
    )
    expect(postRes.status).toBe(404)
})

test("GET /api/ebooks/:id/entities returns paginated entities", async () => {
    const response = await GET_ALL(
        createRequest({
            method: "GET",
            userId: ownerId,
            url: `http://localhost:3000/api/ebooks/${ebookId}/entities?page=1&pageSize=10`,
        }),
        routeContext(ebookId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as PaginatedEbookEntitiesAPI
    expect(body.page).toBe(1)
    expect(body.pageSize).toBe(10)
    expect(body.totalItems).toBe(2)
    expect(body.items).toHaveLength(2)
    expect(body.items[0]).toHaveProperty("id")
    expect(body.items[0]).toHaveProperty("name")
    expect(body.items[0]).toHaveProperty("type")
    expect(typeof body.items[0].createdAt).toBe("number")
    expect(typeof body.items[0].updatedAt).toBe("number")
})

test("GET /api/ebooks/:id/entities filters by type", async () => {
    const response = await GET_ALL(
        createRequest({
            method: "GET",
            userId: ownerId,
            url: `http://localhost:3000/api/ebooks/${ebookId}/entities?type=LOCATION`,
        }),
        routeContext(ebookId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as PaginatedEbookEntitiesAPI
    expect(body.totalItems).toBe(1)
    expect(body.items[0].name).toBe("Camelot")
    expect(body.items[0].type).toBe(EbookEntityType.LOCATION)
})

test("POST /api/ebooks/:id/entities creates a new entity", async () => {
    const response = await POST(
        createRequest({
            method: "POST",
            userId: ownerId,
            body: {
                name: "Excalibur",
                type: EbookEntityType.OBJECT,
                description: "Sword of the King",
            },
        }),
        routeContext(ebookId),
    )

    expect(response.status).toBe(201)
    const body = (await response.json()) as CreateEbookEntityResponseAPI
    expect(body.name).toBe("Excalibur")
    expect(body.slug).toBe("excalibur")
    expect(body.type).toBe(EbookEntityType.OBJECT)
    expect(body.description).toBe("Sword of the King")
    expect(body.ebookId).toBe(ebookId)
    expect(typeof body.createdAt).toBe("number")
    expect(typeof body.updatedAt).toBe("number")
})

test("GET /api/ebooks/:id/entities/:entityId returns entity details", async () => {
    const response = await GET_BY_ID(
        createRequest({
            method: "GET",
            userId: authorCollaboratorId,
            url: `http://localhost:3000/api/ebooks/${ebookId}/entities/${createdEntityId}`,
        }),
        routeContext(ebookId, createdEntityId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as EbookEntityResponseAPI
    expect(body.id).toBe(createdEntityId)
    expect(body.name).toBe("Arthur Pendragon")
    expect(body.type).toBe(EbookEntityType.CHARACTER)
})

test("PUT /api/ebooks/:id/entities/:entityId updates entity", async () => {
    const response = await PUT(
        createRequest({
            method: "PUT",
            userId: ownerId,
            url: `http://localhost:3000/api/ebooks/${ebookId}/entities/${createdEntityId}`,
            body: {
                name: "King Arthur Pendragon",
                description: "Once and Future King",
            },
        }),
        routeContext(ebookId, createdEntityId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as UpdateEbookEntityResponseAPI
    expect(body.id).toBe(createdEntityId)
    expect(body.name).toBe("King Arthur Pendragon")
    expect(body.description).toBe("Once and Future King")
})

test("DELETE /api/ebooks/:id/entities/:entityId deletes entity", async () => {
    const response = await DELETE(
        createRequest({
            method: "DELETE",
            userId: ownerId,
            url: `http://localhost:3000/api/ebooks/${ebookId}/entities/${createdEntityId}`,
        }),
        routeContext(ebookId, createdEntityId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as DeleteEbookEntityResponseAPI
    expect(body.success).toBe(true)

    const inDb = await prisma.ebookEntity.findUnique({
        where: { id: createdEntityId },
    })
    expect(inDb).toBeNull()
})
