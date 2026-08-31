import { afterAll, beforeEach, expect, test } from "vitest"

import { DELETE, PUT } from "@/app/api/ebooks/[id]/routes"
import type { CreateEbookResponseAPI, ResponseErrorAPI } from "@/app/types/api/ebook"
import prisma from "../../helpers/prisma"
import { createUserFixture } from "../../helpers/factories"

import { authorizedRequest, setupEbookFixture, teardownEbookFixture } from "./shared"

let userId = ""

beforeEach(async () => {
    const user = await setupEbookFixture()
    userId = user.id
})

afterAll(async () => {
    await teardownEbookFixture()
})

test("PUT /api/ebooks/:id updates an owned ebook without requiring body.id", async () => {
    const created = await prisma.ebook.create({
        data: {
            title: "Original title",
            subtitle: "Original subtitle",
            shortDescription: "Original description",
            ownerId: userId,
        },
    })

    const response = await PUT(authorizedRequest(`http://localhost:3000/api/ebooks/${created.id}`, userId, {
        method: "PUT",
        body: {
            id: "999999",
            title: "Updated title",
            subtitle: "Updated subtitle",
            shortDescription: "Updated description",
        },
    }), { params: Promise.resolve({ id: created.id }) })
    const body = await response.json() as CreateEbookResponseAPI

    expect(response.status).toBe(200)
    expect(body.id).toBe(created.id)
    expect(body.title).toBe("Updated title")
    expect(body.subtitle).toBe("Updated subtitle")
    expect(body.shortDescription).toBe("Updated description")
})

test("DELETE /api/ebooks/:id deletes an owned ebook without requiring body.id", async () => {
    const created = await prisma.ebook.create({
        data: {
            title: "Ebook to delete",
            ownerId: userId,
        },
    })

    const response = await DELETE(authorizedRequest(`http://localhost:3000/api/ebooks/${created.id}`, userId, {
        method: "DELETE",
    }), { params: Promise.resolve({ id: created.id }) })
    const body = await response.json() as { success: boolean }

    expect(response.status).toBe(200)
    expect(body).toEqual({ success: true })
    expect(await prisma.ebook.findUnique({ where: { id: created.id } })).toBeNull()
})

test("PUT /api/ebooks/:id returns NOT_FOUND when the ebook belongs to another user", async () => {
    const otherOwner = await createUserFixture()
    const created = await prisma.ebook.create({
        data: {
            title: "Other owner's ebook",
            ownerId: otherOwner.id,
        },
    })

    const response = await PUT(authorizedRequest(`http://localhost:3000/api/ebooks/${created.id}`, userId, {
        method: "PUT",
        body: {
            title: "Should fail",
        },
    }), { params: Promise.resolve({ id: created.id }) })
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
})
