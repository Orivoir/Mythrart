import { NextRequest } from "next/server"

import { CollaborationRole } from "@mythrart/database"
import prisma from "../../helpers/prisma"
import { createUserFixture } from "../../helpers/factories"
import resetDb from "../../helpers/reset-db"

export type ChapterFixture = {
    ownerId: string
    authorCollaboratorId: string
    proofreaderCollaboratorId: string
    chapterId: string
    secondChapterId: string
    otherChapterId: string
}

export function routeContext(id: string) {
    return { params: Promise.resolve({ id }) }
}

export function chapterRequest(options: {
    chapterId: string
    method: "PUT" | "DELETE"
    body?: string
    authenticated?: boolean
    authUserId?: string
    defaultOwnerId: string
}): NextRequest {
    return new NextRequest(`http://localhost:3000/api/chapters/${options.chapterId}`, {
        method: options.method,
        headers: {
            ...(options.body ? { "content-type": "application/json" } : {}),
            ...((options.authenticated ?? true)
                ? { "x-auth-user-id": options.authUserId ?? options.defaultOwnerId }
                : {}),
        },
        ...(options.body ? { body: options.body } : {}),
    })
}

export async function setupChapterFixture(): Promise<ChapterFixture> {
    await resetDb()

    const owner = await createUserFixture()
    const otherOwner = await prisma.user.create({
        data: {
            email: `other-${owner.id}@example.com`,
            name: "Other Fixture User",
            emailVerified: new Date(),
            stripeCustomerId: `cus_other_${owner.id}`,
        },
    })

    const authorCollaborator = await prisma.user.create({
        data: {
            email: `author-${owner.id}@example.com`,
            name: "Author Collaborator",
            emailVerified: new Date(),
            stripeCustomerId: `cus_author_${owner.id}`,
        },
    })

    const proofreaderCollaborator = await prisma.user.create({
        data: {
            email: `proofreader-${owner.id}@example.com`,
            name: "Proofreader Collaborator",
            emailVerified: new Date(),
            stripeCustomerId: `cus_proofreader_${owner.id}`,
        },
    })

    const ebook = await prisma.ebook.create({
        data: {
            title: "Owner ebook",
            ownerId: owner.id,
        },
    })

    const otherEbook = await prisma.ebook.create({
        data: {
            title: "Other owner ebook",
            ownerId: otherOwner.id,
        },
    })

    const chapter = await prisma.chapter.create({
        data: {
            title: "Original chapter",
            ebookId: ebook.id,
            position: 0,
            locales: {
                create: {
                    locale: "en",
                    title: "Original chapter",
                    content: { blocks: ["original"] },
                },
            },
        },
    })

    const secondChapter = await prisma.chapter.create({
        data: {
            title: "Second chapter",
            ebookId: ebook.id,
            position: 1,
            locales: {
                create: {
                    locale: "en",
                    title: "Second chapter",
                    content: { blocks: ["second"] },
                },
            },
        },
    })

    const otherChapter = await prisma.chapter.create({
        data: {
            title: "Other chapter",
            ebookId: otherEbook.id,
            position: 0,
            locales: {
                create: {
                    locale: "en",
                    title: "Other chapter",
                    content: {},
                },
            },
        },
    })

    await prisma.ebookCollaborator.create({
        data: {
            ebookId: ebook.id,
            userId: authorCollaborator.id,
            role: CollaborationRole.AUTHOR,
            allChaptersAccess: false,
            chapterAccess: {
                create: {
                    chapterId: chapter.id,
                },
            },
        },
    })

    await prisma.ebookCollaborator.create({
        data: {
            ebookId: ebook.id,
            userId: proofreaderCollaborator.id,
            role: CollaborationRole.PROOFREADER,
            allChaptersAccess: true,
        },
    })

    return {
        ownerId: owner.id,
        authorCollaboratorId: authorCollaborator.id,
        proofreaderCollaboratorId: proofreaderCollaborator.id,
        chapterId: chapter.id,
        secondChapterId: secondChapter.id,
        otherChapterId: otherChapter.id,
    }
}

export async function teardownChapterFixture() {
    await resetDb()
}
