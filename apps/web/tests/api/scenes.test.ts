import { afterAll, beforeEach, expect, test } from "vitest"
import { NextRequest } from "next/server"

import { POST } from "@/app/api/scenes/routes"
import { DELETE, GET, PUT } from "@/app/api/scenes/[id]/routes"
import type {
    CreateSceneResponseAPI,
    DeleteSceneResponseAPI,
    SceneResponseAPI,
    UpdateSceneResponseAPI,
} from "@/app/types/api/scene"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"
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
let otherChapterId = ""
let sceneId = ""

function routeContext(id: string) {
    return { params: Promise.resolve({ id }) }
}

function createRequest(options: {
    method?: string
    userId?: string
    url?: string
    body?: Record<string, unknown>
}): NextRequest {
    const url = options.url || `http://localhost:3000/api/scenes`
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
            title: "Ebook for scene tests",
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

    const secondChapter = await prisma.chapter.create({
        data: {
            ebookId: ebook.id,
            title: "Chapter 2",
            position: 1,
        },
    })
    otherChapterId = secondChapter.id

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
            chapterId,
            title: "Initial Scene",
            objective: "Set up the world",
            order: 0,
        },
    })
    sceneId = scene.id
})

afterAll(async () => {
    await resetDb()
})

test("All /api/scenes routes return 401 UNAUTHORIZED when not logged in", async () => {
    const getRes = await GET(
        createRequest({ method: "GET", url: `http://localhost:3000/api/scenes/${sceneId}` }),
        routeContext(sceneId),
    )
    expect(getRes.status).toBe(401)

    const postRes = await POST(
        createRequest({
            method: "POST",
            body: {
                chapterId,
                title: "New Scene",
            },
        }),
    )
    expect(postRes.status).toBe(401)

    const putRes = await PUT(
        createRequest({
            method: "PUT",
            url: `http://localhost:3000/api/scenes/${sceneId}`,
            body: {
                title: "Updated Scene",
            },
        }),
        routeContext(sceneId),
    )
    expect(putRes.status).toBe(401)

    const deleteRes = await DELETE(
        createRequest({ method: "DELETE", url: `http://localhost:3000/api/scenes/${sceneId}` }),
        routeContext(sceneId),
    )
    expect(deleteRes.status).toBe(401)
})

test("POST /api/scenes returns 404 when user lacks permission on chapter", async () => {
    const response = await POST(
        createRequest({
            method: "POST",
            userId: unauthorizedUserId,
            body: {
                chapterId,
                title: "Unauthorized Scene",
            },
        }),
    )

    expect(response.status).toBe(404)
})

test("POST /api/scenes creates scene for owner", async () => {
    const response = await POST(
        createRequest({
            method: "POST",
            userId: ownerId,
            body: {
                chapterId,
                title: "Climax Scene",
                objective: "The battle",
                order: 1,
            },
        }),
    )

    expect(response.status).toBe(201)
    const body = (await response.json()) as CreateSceneResponseAPI
    expect(body.title).toBe("Climax Scene")
    expect(body.chapterId).toBe(chapterId)
    expect(body.objective).toBe("The battle")
    expect(body.order).toBe(1)
    expect(typeof body.createdAt).toBe("number")
    expect(typeof body.updatedAt).toBe("number")
})

test("POST /api/scenes creates scene for authorized collaborator", async () => {
    const response = await POST(
        createRequest({
            method: "POST",
            userId: authorCollaboratorId,
            body: {
                chapterId,
                title: "Collaborator Scene",
            },
        }),
    )

    expect(response.status).toBe(201)
    const body = (await response.json()) as CreateSceneResponseAPI
    expect(body.title).toBe("Collaborator Scene")
    expect(body.chapterId).toBe(chapterId)
})

test("GET /api/scenes/:id returns 404 for non-existent scene or unauthorized user", async () => {
    const notFoundRes = await GET(
        createRequest({
            method: "GET",
            userId: ownerId,
            url: "http://localhost:3000/api/scenes/non-existent-id",
        }),
        routeContext("non-existent-id"),
    )
    expect(notFoundRes.status).toBe(404)

    const unauthorizedRes = await GET(
        createRequest({
            method: "GET",
            userId: unauthorizedUserId,
            url: `http://localhost:3000/api/scenes/${sceneId}`,
        }),
        routeContext(sceneId),
    )
    expect(unauthorizedRes.status).toBe(404)
})

test("GET /api/scenes/:id returns scene details for owner", async () => {
    const response = await GET(
        createRequest({
            method: "GET",
            userId: ownerId,
            url: `http://localhost:3000/api/scenes/${sceneId}`,
        }),
        routeContext(sceneId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as SceneResponseAPI
    expect(body.id).toBe(sceneId)
    expect(body.title).toBe("Initial Scene")
    expect(body.objective).toBe("Set up the world")
    expect(typeof body.createdAt).toBe("number")
    expect(typeof body.updatedAt).toBe("number")
})

test("PUT /api/scenes/:id updates scene title, objective, and moves chapter", async () => {
    const response = await PUT(
        createRequest({
            method: "PUT",
            userId: ownerId,
            url: `http://localhost:3000/api/scenes/${sceneId}`,
            body: {
                title: "Renamed Scene",
                objective: "Updated objective",
                chapterId: otherChapterId,
                order: 5,
            },
        }),
        routeContext(sceneId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as UpdateSceneResponseAPI
    expect(body.id).toBe(sceneId)
    expect(body.title).toBe("Renamed Scene")
    expect(body.objective).toBe("Updated objective")
    expect(body.chapterId).toBe(otherChapterId)
    expect(body.order).toBe(5)
})

test("DELETE /api/scenes/:id deletes scene", async () => {
    const response = await DELETE(
        createRequest({
            method: "DELETE",
            userId: ownerId,
            url: `http://localhost:3000/api/scenes/${sceneId}`,
        }),
        routeContext(sceneId),
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as DeleteSceneResponseAPI
    expect(body.success).toBe(true)

    const inDb = await prisma.scene.findUnique({
        where: { id: sceneId },
    })
    expect(inDb).toBeNull()
})
