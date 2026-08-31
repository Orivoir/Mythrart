import { afterAll, beforeEach, expect, test } from "vitest"

import { CollaborationRole } from "@mythrart/database"
import { DELETE as DELETE_COLLABORATOR, POST as POST_COLLABORATOR, PUT as PUT_COLLABORATOR } from "@/app/api/collaborations/ebooks/[ebookId]/route"
import type {
    CollaboratorDeleteResponseAPI,
    CollaboratorResponseAPI,
    ResponseErrorAPI,
} from "@/app/types/api/collaboration"
import prisma from "../../helpers/prisma"

import {
    type CollaborationFixture,
    collaborationRequest,
    routeContext,
    setupCollaborationFixture,
    teardownCollaborationFixture,
} from "./shared"

let fixture: CollaborationFixture

beforeEach(async () => {
    fixture = await setupCollaborationFixture()
})

afterAll(async () => {
    await teardownCollaborationFixture()
})

test("POST /api/collaborations/ebooks/:ebookId creates a collaborator with chapter-scoped access", async () => {
    const request = collaborationRequest({
        method: "POST",
        userId: fixture.ownerId,
        path: `/api/collaborations/ebooks/${fixture.ebookId}`,
        body: {
            collaboratorUserId: fixture.collaboratorTargetId,
            role: CollaborationRole.AUTHOR,
            allChaptersAccess: false,
            chapterIds: [fixture.chapterOneId],
        },
    })

    const response = await POST_COLLABORATOR(request, routeContext(fixture.ebookId))
    const body = await response.json() as CollaboratorResponseAPI

    expect(response.status).toBe(201)
    expect(body.userId).toBe(fixture.collaboratorTargetId)
    expect(body.role).toBe(CollaborationRole.AUTHOR)
    expect(body.allChaptersAccess).toBe(false)
    expect(body.chapterIds).toEqual([fixture.chapterOneId])
})

test("POST /api/collaborations/ebooks/:ebookId returns PAYMENT_REQUIRED for custom role on free plan", async () => {
    const request = collaborationRequest({
        method: "POST",
        userId: fixture.ownerId,
        path: `/api/collaborations/ebooks/${fixture.ebookId}`,
        body: {
            collaboratorUserId: fixture.collaboratorTargetId,
            customRoleId: "role_any",
        },
    })

    const response = await POST_COLLABORATOR(request, routeContext(fixture.ebookId))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(402)
    expect(body.code).toBe("PAYMENT_REQUIRED")
})

test("PUT /api/collaborations/ebooks/:ebookId updates collaborator role and chapter access", async () => {
    await prisma.ebookCollaborator.create({
        data: {
            ebookId: fixture.ebookId,
            userId: fixture.collaboratorTargetId,
            role: CollaborationRole.PROOFREADER,
            allChaptersAccess: true,
        },
    })

    const request = collaborationRequest({
        method: "PUT",
        userId: fixture.ownerId,
        path: `/api/collaborations/ebooks/${fixture.ebookId}`,
        body: {
            collaboratorUserId: fixture.collaboratorTargetId,
            role: CollaborationRole.EDITOR,
            allChaptersAccess: false,
            chapterIds: [fixture.chapterTwoId],
        },
    })

    const response = await PUT_COLLABORATOR(request, routeContext(fixture.ebookId))
    const body = await response.json() as CollaboratorResponseAPI

    expect(response.status).toBe(200)
    expect(body.role).toBe(CollaborationRole.EDITOR)
    expect(body.allChaptersAccess).toBe(false)
    expect(body.chapterIds).toEqual([fixture.chapterTwoId])
})

test("DELETE /api/collaborations/ebooks/:ebookId removes collaborator", async () => {
    await prisma.ebookCollaborator.create({
        data: {
            ebookId: fixture.ebookId,
            userId: fixture.collaboratorTargetId,
            role: CollaborationRole.AUTHOR,
            allChaptersAccess: true,
        },
    })

    const request = collaborationRequest({
        method: "DELETE",
        userId: fixture.ownerId,
        path: `/api/collaborations/ebooks/${fixture.ebookId}`,
        body: {
            collaboratorUserId: fixture.collaboratorTargetId,
        },
    })

    const response = await DELETE_COLLABORATOR(request, routeContext(fixture.ebookId))
    const body = await response.json() as CollaboratorDeleteResponseAPI

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(await prisma.ebookCollaborator.findUnique({
        where: {
            ebookId_userId: {
                ebookId: fixture.ebookId,
                userId: fixture.collaboratorTargetId,
            },
        },
    })).toBeNull()
})

test("POST /api/collaborations/ebooks/:ebookId returns NOT_FOUND for unauthorized user", async () => {
    const request = collaborationRequest({
        method: "POST",
        userId: fixture.outsiderId,
        path: `/api/collaborations/ebooks/${fixture.ebookId}`,
        body: {
            collaboratorUserId: fixture.collaboratorTargetId,
            role: CollaborationRole.AUTHOR,
        },
    })

    const response = await POST_COLLABORATOR(request, routeContext(fixture.ebookId))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(404)
    expect(body.code).toBe("NOT_FOUND")
})

test("POST /api/collaborations/ebooks/:ebookId returns UNAUTHORIZED without auth header", async () => {
    const request = collaborationRequest({
        method: "POST",
        path: `/api/collaborations/ebooks/${fixture.ebookId}`,
        body: {
            collaboratorUserId: fixture.collaboratorTargetId,
            role: CollaborationRole.AUTHOR,
        },
    })

    const response = await POST_COLLABORATOR(request, routeContext(fixture.ebookId))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(401)
    expect(body.code).toBe("UNAUTHORIZED")
})
