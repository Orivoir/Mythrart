import { NextRequest } from "next/server"

import { PlanType } from "@mythrart/database"

import prisma from "../../helpers/prisma"
import { createUserFixture } from "../../helpers/factories"
import resetDb from "../../helpers/reset-db"

export type CollaborationFixture = {
    ownerId: string
    ownerProId: string
    outsiderId: string
    collaboratorTargetId: string
    ebookId: string
    ebookProId: string
    chapterOneId: string
    chapterTwoId: string
}

export function routeContext(ebookId: string) {
    return { params: Promise.resolve({ ebookId }) }
}

export function collaborationRequest(options: {
    method: "POST" | "PUT" | "DELETE"
    userId?: string
    path: string
    body?: Record<string, unknown>
}): NextRequest {
    const { method, userId, path, body } = options

    return new NextRequest(`http://localhost:3000${path}`, {
        method,
        headers: {
            ...(body ? { "content-type": "application/json" } : {}),
            ...(userId ? { "x-auth-user-id": userId } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    })
}

export async function setupCollaborationFixture(): Promise<CollaborationFixture> {
    await resetDb()

    const owner = await createUserFixture({ plan: PlanType.free })
    const ownerPro = await createUserFixture({ plan: PlanType.pro })
    const outsider = await createUserFixture({ plan: PlanType.free })
    const collaboratorTarget = await createUserFixture({ plan: PlanType.free })

    const ebook = await prisma.ebook.create({
        data: {
            title: "Owner Ebook",
            ownerId: owner.id,
        },
    })

    const ebookPro = await prisma.ebook.create({
        data: {
            title: "Pro Owner Ebook",
            ownerId: ownerPro.id,
        },
    })

    const chapterOne = await prisma.chapter.create({
        data: {
            ebookId: ebook.id,
            title: "Chapter 1",
            position: 0,
            locales: {
                create: {
                    locale: "en",
                    title: "Chapter 1",
                    content: {},
                },
            },
        },
    })

    const chapterTwo = await prisma.chapter.create({
        data: {
            ebookId: ebook.id,
            title: "Chapter 2",
            position: 1,
            locales: {
                create: {
                    locale: "en",
                    title: "Chapter 2",
                    content: {},
                },
            },
        },
    })

    return {
        ownerId: owner.id,
        ownerProId: ownerPro.id,
        outsiderId: outsider.id,
        collaboratorTargetId: collaboratorTarget.id,
        ebookId: ebook.id,
        ebookProId: ebookPro.id,
        chapterOneId: chapterOne.id,
        chapterTwoId: chapterTwo.id,
    }
}

export async function teardownCollaborationFixture() {
    await resetDb()
}
