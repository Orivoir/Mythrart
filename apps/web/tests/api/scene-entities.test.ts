import { afterAll, beforeEach, expect, test } from "vitest"
import { NextRequest } from "next/server"

import { GET, POST } from "@/app/api/scenes/[id]/entities/routes"
import { DELETE } from "@/app/api/scenes/[id]/entities/[entityId]/routes"
import type {
    CreateSceneEntityResponseAPI,
    DeleteSceneEntityResponseAPI,
    PaginatedSceneEntitiesAPI,
} from "@/app/types/api/scene-entity"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import { CollaborationRole, EbookEntityType } from "@mythrart/database"
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
let sceneId = ""
let entityId = ""
let otherEntityId = ""

function routeContext(sceneId: string): { params: Promise<{ sceneId: string; id: string }> }
function routeContext(sceneId: string, entityId: string): { params: Promise<{ sceneId: string; id: string; entityId: string }> }
function routeContext(sceneId: string, entityId?: string) {
    return {
        params: Promise.resolve(
            entityId
                ? { sceneId, id: sceneId, entityId }
                : { sceneId, id: sceneId },
        ),
    }
}

function createRequest(options: {
    method?: string
    userId?: string
    url?: string
    body?: Record<string, unknown>
}): NextRequest {
    const url = options.url || `http://localhost:3000/api/scenes/${sceneId}/entities`
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
            title: "Ebook for scene entity tests",
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

    await prisma.ebookCollaborator.create({
        data: {
            ebookId: ebook.id,
            userId: authorCollaboratorId,
            role: CollaborationRole.AUTHOR,
            allChaptersAccess: true,
        },
    })

    const scene = await prisma.scene.create({
        data: {
            chapterId: chapter.id,
            title: "Battle at Camelot",
            objective: "Showdown",
            order: 0,
        },
    })
    sceneId = scene.id

    const entity1 = await prisma.ebookEntity.create({
        data: {
            ebookId: ebook.id,
            name: "King Arthur",
            slug: "king-arthur",
            type: EbookEntityType.CHARACTER,
        },
    })
    entityId = entity1.id

    const entity2 = await prisma.ebookEntity.create({
        data: {
            ebookId: ebook.id,
            name: "Excalibur",
            slug: "excalibur",
            type: EbookEntityType.OBJECT,
        },
    })
    otherEntityId = entity2.id

    await prisma.sceneEntity.create({
        data: {
            sceneId,
            entityId,
        },
    })
})

afterAll(async () => {
    await resetDb()
})

test("All /api/scenes/:sceneId/entities routes return 401 UNAUTHORIZED when not logged in", async () => {
    const getRes = await GET(createRequest({ method: "GET" }), routeContext(sceneId))
    expect(getRes.status).toBe(401)

    const postRes = await POST(
        createRequest({
            method: "POST",
            body: { entityId: otherEntityId },
        }),
        routeContext(sceneId),
    )
    expect(postRes.status).toBe(401)

    const deleteRes = await DELETE(
        createRequest({
            method: "DELETE",
            url: `http://localhost:3000/api/scenes/${sceneId}/entities/${entityId}`,
        }),
        routeContext(sceneId, entityId),
    )
    expect(deleteRes.status).toBe(401)
})

test("All /api/scenes/:sceneId/entities routes return 404 for unauthorized user", async () => {
    const getRes = await GET(
        createRequest({ method: "GET", userId: unauthorizedUserId }),
        routeContext(sceneId),
    )
    expect(getRes.status).toBe(404)

    const postRes = await POST(
        createRequest({
            method: "POST",
            userId: unauthorizedUserId,
            body: { entityId: otherEntityId },
        }),
        routeContext(sceneId),
    )
    expect(postRes.status).toBe(404)
})

test("GET /api/scenes/:sceneId/entities returns paginated scene entities with entity details", async () => {
    const response = await GET(
        createRequest({
            method: "GET",
            userId: ownerId,
            url: `http://localhost:3000/api/scenes/${sceneId}/entities?page=1&pageSize=10`,
        }),
        routeContext(sceneId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as PaginatedSceneEntitiesAPI
    expect(body.page).toBe(1)
    expect(body.pageSize).toBe(10)
    expect(body.totalItems).toBe(1)
    expect(body.items).toHaveLength(1)
    expect(body.items[0].sceneId).toBe(sceneId)
    expect(body.items[0].entityId).toBe(entityId)
    expect(body.items[0].entity?.name).toBe("King Arthur")
    expect(typeof body.items[0].createdAt).toBe("number")
})

test("POST /api/scenes/:sceneId/entities adds an entity reference to a scene", async () => {
    const response = await POST(
        createRequest({
            method: "POST",
            userId: ownerId,
            body: { entityId: otherEntityId },
        }),
        routeContext(sceneId),
    )

    expect(response.status).toBe(201)
    const body = (await response.json()) as CreateSceneEntityResponseAPI
    expect(body.sceneId).toBe(sceneId)
    expect(body.entityId).toBe(otherEntityId)
    expect(body.entity?.name).toBe("Excalibur")

    const inDb = await prisma.sceneEntity.findUnique({
        where: {
            sceneId_entityId: {
                sceneId,
                entityId: otherEntityId,
            },
        },
    })
    expect(inDb).not.toBeNull()
})

test("DELETE /api/scenes/:sceneId/entities/:entityId removes entity reference from scene", async () => {
    const response = await DELETE(
        createRequest({
            method: "DELETE",
            userId: ownerId,
            url: `http://localhost:3000/api/scenes/${sceneId}/entities/${entityId}`,
        }),
        routeContext(sceneId, entityId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as DeleteSceneEntityResponseAPI
    expect(body.success).toBe(true)

    const inDb = await prisma.sceneEntity.findUnique({
        where: {
            sceneId_entityId: {
                sceneId,
                entityId,
            },
        },
    })
    expect(inDb).toBeNull()

    // Ensure actual EbookEntity was not deleted
    const entityInDb = await prisma.ebookEntity.findUnique({
        where: { id: entityId },
    })
    expect(entityInDb).not.toBeNull()
})
