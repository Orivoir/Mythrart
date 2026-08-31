import { afterAll, beforeEach, expect, test } from "vitest"
import { NextRequest } from "next/server"

import { CollaborationRole, PlanType } from "@mythrart/database"
import { POST } from "@/app/api/ebooks/[id]/chapters/routes"
import type { CreateChapterResponseAPI } from "@/app/types/api/chapter"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import { PLANS } from "@/lib/constants/plan"
import prisma from "../helpers/prisma"
import { createUserFixture } from "../helpers/factories"
import resetDb from "../helpers/reset-db"

let ownerId = ""
let authorCollaboratorId = ""
let proofreaderCollaboratorId = ""
let ebookId = ""

function routeContext(id: string) {
    return { params: Promise.resolve({ id }) }
}

function createChapterRequest(options: {
    userId?: string
    body: Record<string, unknown>
}): NextRequest {
    return new NextRequest(`http://localhost:3000/api/ebooks/${ebookId}/chapters`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            ...(options.userId ? { "x-auth-user-id": options.userId } : {}),
        },
        body: JSON.stringify(options.body),
    })
}

beforeEach(async () => {
    await resetDb()

    const owner = await createUserFixture({ plan: PlanType.free })
    const authorCollaborator = await createUserFixture({ plan: PlanType.free })
    const proofreaderCollaborator = await createUserFixture({ plan: PlanType.free })

    ownerId = owner.id
    authorCollaboratorId = authorCollaborator.id
    proofreaderCollaboratorId = proofreaderCollaborator.id

    const ebook = await prisma.ebook.create({
        data: {
            title: "Ebook for chapter create",
            ownerId,
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

    await prisma.ebookCollaborator.create({
        data: {
            ebookId,
            userId: proofreaderCollaboratorId,
            role: CollaborationRole.PROOFREADER,
            allChaptersAccess: true,
        },
    })
})

afterAll(async () => {
    await resetDb()
})

test("POST /api/ebooks/:id/chapters creates chapter for owner", async () => {
    const response = await POST(
        createChapterRequest({
            userId: ownerId,
            body: {
                title: "New chapter",
                content: { blocks: ["content"] },
            },
        }),
        routeContext(ebookId),
    )

    const body = await response.json() as CreateChapterResponseAPI

    expect(response.status).toBe(201)
    expect(body.title).toBe("New chapter")
    expect(body.position).toBe(0)
})

test("POST /api/ebooks/:id/chapters allows collaborator with create permission", async () => {
    const response = await POST(
        createChapterRequest({
            userId: authorCollaboratorId,
            body: {
                title: "Collaborator chapter",
            },
        }),
        routeContext(ebookId),
    )

    const body = await response.json() as CreateChapterResponseAPI

    expect(response.status).toBe(201)
    expect(body.title).toBe("Collaborator chapter")
})

test("POST /api/ebooks/:id/chapters denies collaborator without create permission", async () => {
    const response = await POST(
        createChapterRequest({
            userId: proofreaderCollaboratorId,
            body: {
                title: "Should fail",
            },
        }),
        routeContext(ebookId),
    )

    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
})

test("POST /api/ebooks/:id/chapters returns PAYMENT_REQUIRED when chapter plan limit is reached", async () => {
    const maxChapters = PLANS.FREE.limits.chaptersPerProject

    for (let index = 0; index < maxChapters; index += 1) {
        await prisma.chapter.create({
            data: {
                ebookId,
                title: `Chapter ${index}`,
                position: index,
                locales: {
                    create: {
                        locale: "en",
                        title: `Chapter ${index}`,
                        content: {},
                    },
                },
            },
        })
    }

    const response = await POST(
        createChapterRequest({
            userId: ownerId,
            body: {
                title: "One too many",
            },
        }),
        routeContext(ebookId),
    )

    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(402)
    expect(body.code).toBe("PAYMENT_REQUIRED")
})

test("POST /api/ebooks/:id/chapters returns UNAUTHORIZED without auth", async () => {
    const response = await POST(
        createChapterRequest({
            body: {
                title: "No auth",
            },
        }),
        routeContext(ebookId),
    )

    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(401)
    expect(body.code).toBe("UNAUTHORIZED")
})
