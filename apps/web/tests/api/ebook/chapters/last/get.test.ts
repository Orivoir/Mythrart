import { afterAll, beforeEach, expect, test } from "vitest"
import { NextRequest } from "next/server"

import { CollaborationRole } from "@mythrart/database"
import { GET } from "@/app/api/ebooks/[id]/chapters/last/get"
import type { ChapterResponseAPI } from "@/app/types/api/chapter"
import type { ResponseErrorAPI } from "@/app/types/api/ebook"
import {
    createEbookThemeFixture,
    createEbookTypeFixture,
    createUserFixture,
} from "../../../../helpers/factories"
import prisma from "../../../../helpers/prisma"
import resetDb from "../../../../helpers/reset-db"

let ownerId = ""
let collaboratorId = ""
let ebookId = ""

function routeContext(id: string) {
    return { params: Promise.resolve({ id }) }
}

function createRequest(options: {
    userId?: string
    locale?: string
} = {}): NextRequest {
    const url = new URL(`http://localhost:3000/api/ebooks/${ebookId}/chapters/last`)

    if (options.locale) {
        url.searchParams.set("locale", options.locale)
    }

    return new NextRequest(url, {
        method: "GET",
        headers: options.userId
            ? { "x-auth-user-id": options.userId }
            : undefined,
    })
}

async function createChapter(options: {
    title: string
    position: number
    locales?: Array<{ locale: string; title: string }>
}) {
    const locales = options.locales ?? [{ locale: "en", title: options.title }]

    return prisma.chapter.create({
        data: {
            ebookId,
            title: options.title,
            position: options.position,
            locales: {
                create: locales.map((locale) => ({
                    ...locale,
                    content: {},
                })),
            },
        },
    })
}

beforeEach(async () => {
    await resetDb()

    const owner = await createUserFixture()
    ownerId = owner.id
    const collaborator = await prisma.user.create({
    data: {
        email: `collaborator-${owner.id}@example.com`,
        firstName: "Chapter Access",
        lastName: "Collaborator",
        username: `collaborator-${owner.id}`,
        emailVerified: new Date(),
        termsAcceptedAt: new Date(),
        stripeCustomerId: `cus_collaborator_${owner.id}`,
    },
    })
    collaboratorId = collaborator.id

    const ebookType = await createEbookTypeFixture()
    const ebookTheme = await createEbookThemeFixture()
    const ebook = await prisma.ebook.create({
        data: {
            title: "Last chapter test ebook",
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

test("GET /api/ebooks/:id/chapters/last returns the most recently updated chapter for the owner", async () => {
    const olderChapter = await createChapter({ title: "Older chapter", position: 0 })
    const newerChapter = await createChapter({ title: "Newer chapter", position: 1 })
    const latestUpdate = new Date("2099-01-01T00:00:00.000Z")

    await prisma.chapter.update({
        where: { id: olderChapter.id },
        data: { updatedAt: latestUpdate },
    })

    const response = await GET(createRequest({ userId: ownerId }), routeContext(ebookId))
    const body = await response.json() as ChapterResponseAPI

    expect(response.status).toBe(200)
    expect(body.id).toBe(olderChapter.id)
    expect(body.id).not.toBe(newerChapter.id)
    expect(body.ebookId).toBe(ebookId)
    expect(body.title).toBe("Older chapter")
    expect(body.locale).toBe("en")
    expect(body.updatedAt).toBe(latestUpdate.getTime())
})

test("GET /api/ebooks/:id/chapters/last returns the requested localized title", async () => {
    const chapter = await createChapter({
        title: "Base title",
        position: 0,
        locales: [
            { locale: "en", title: "English title" },
            { locale: "fr", title: "Titre français" },
        ],
    })

    const response = await GET(
        createRequest({ userId: ownerId, locale: "fr" }),
        routeContext(ebookId),
    )
    const body = await response.json() as ChapterResponseAPI

    expect(response.status).toBe(200)
    expect(body.id).toBe(chapter.id)
    expect(body.title).toBe("Titre français")
    expect(body.locale).toBe("fr")
})

test("GET /api/ebooks/:id/chapters/last falls back to the base title when no localized title exists", async () => {
    const chapter = await createChapter({ title: "Base title", position: 0 })

    const response = await GET(
        createRequest({ userId: ownerId, locale: "de" }),
        routeContext(ebookId),
    )
    const body = await response.json() as ChapterResponseAPI

    expect(response.status).toBe(200)
    expect(body.id).toBe(chapter.id)
    expect(body.title).toBe("Base title")
    expect(body.locale).toBe("de")
})

test("GET /api/ebooks/:id/chapters/last only considers chapters a restricted collaborator can access", async () => {
    const accessibleChapter = await createChapter({ title: "Accessible", position: 0 })
    const inaccessibleChapter = await createChapter({ title: "Inaccessible", position: 1 })

    await prisma.chapter.update({
        where: { id: inaccessibleChapter.id },
        data: { updatedAt: new Date("2099-01-01T00:00:00.000Z") },
    })

    await prisma.ebookCollaborator.create({
        data: {
            ebookId,
            userId: collaboratorId,
            role: CollaborationRole.AUTHOR,
            allChaptersAccess: false,
            chapterAccess: {
                create: { chapterId: accessibleChapter.id },
            },
        },
    })

    const response = await GET(createRequest({ userId: collaboratorId }), routeContext(ebookId))
    const body = await response.json() as ChapterResponseAPI

    expect(response.status).toBe(200)
    expect(body.id).toBe(accessibleChapter.id)
})

test("GET /api/ebooks/:id/chapters/last returns UNAUTHORIZED without authentication", async () => {
    const response = await GET(createRequest(), routeContext(ebookId))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(401)
    expect(body.code).toBe("UNAUTHORIZED")
})

test("GET /api/ebooks/:id/chapters/last returns NOT_FOUND for a user without ebook access", async () => {
    const response = await GET(
        createRequest({ userId: "non-member-user" }),
        routeContext(ebookId),
    )
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
})

test("GET /api/ebooks/:id/chapters/last returns NOT_FOUND when the ebook has no chapters", async () => {
    const response = await GET(createRequest({ userId: ownerId }), routeContext(ebookId))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
})
