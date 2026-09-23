import { afterAll, beforeEach, expect, test } from "vitest"

import { GET } from "@/app/api/ebooks/[id]/route"
import type { CreateEbookResponseAPI } from "@/app/types/api/ebook"
import prisma from "../../helpers/prisma"
import {
    createEbookThemeFixture,
    createEbookTypeFixture,
} from "../../helpers/factories"

import {
    authorizedRequest,
    setupEbookFixture,
    teardownEbookFixture,
} from "./shared"

let userId = ""

beforeEach(async () => {
    const user = await setupEbookFixture()
    userId = user.id
})

afterAll(async () => {
    await teardownEbookFixture()
})

test("GET /api/ebooks/:id returns an owned ebook", async () => {
    const ebookType = await createEbookTypeFixture()
    const ebookTheme = await createEbookThemeFixture()

    const created = await prisma.ebook.create({
        data: {
            title: "Owned ebook",
            subtitle: "A subtitle",
            shortDescription: "A description",
            ownerId: userId,
            ebookTypeId: ebookType.id,
            ebookThemeId: ebookTheme.id,
        },
    })

    const response = await GET(
        authorizedRequest(`http://localhost:3000/api/ebooks/${created.id}`, userId),
        { params: Promise.resolve({ id: created.id }) },
    )

    const body = (await response.json()) as CreateEbookResponseAPI

    expect(response.status).toBe(200)
    expect(body.id).toBe(created.id)
    expect(body.title).toBe("Owned ebook")
    expect(body.subtitle).toBe("A subtitle")
    expect(body.shortDescription).toBe("A description")
    expect(typeof body.createdAt).toBe("number")
    expect(typeof body.updatedAt).toBe("number")
})
