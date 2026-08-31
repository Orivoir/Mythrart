import { afterAll, beforeEach, expect, test } from "vitest"

import { CollaborationPermission } from "@mythrart/database"
import { DELETE as DELETE_ROLE, POST as POST_ROLE, PUT as PUT_ROLE } from "@/app/api/collaborations/roles/[ebookId]/route"
import type {
    CustomRoleResponseAPI,
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

test("POST /api/collaborations/roles/:ebookId creates custom role for pro plan", async () => {
    const request = collaborationRequest({
        method: "POST",
        userId: fixture.ownerProId,
        path: `/api/collaborations/roles/${fixture.ebookProId}`,
        body: {
            name: "Reviewer Plus",
            permissions: [
                CollaborationPermission.CHAPTER_READ,
                CollaborationPermission.CHAPTER_UPDATE,
            ],
        },
    })

    const response = await POST_ROLE(request, routeContext(fixture.ebookProId))
    const body = await response.json() as CustomRoleResponseAPI

    expect(response.status).toBe(201)
    expect(body.name).toBe("Reviewer Plus")
    expect(body.permissions).toEqual([
        CollaborationPermission.CHAPTER_READ,
        CollaborationPermission.CHAPTER_UPDATE,
    ])
})

test("PUT /api/collaborations/roles/:ebookId updates custom role", async () => {
    const role = await prisma.ebookCustomRole.create({
        data: {
            ebookId: fixture.ebookProId,
            name: "Role v1",
            permissions: [CollaborationPermission.CHAPTER_READ],
            createdByUserId: fixture.ownerProId,
        },
    })

    const request = collaborationRequest({
        method: "PUT",
        userId: fixture.ownerProId,
        path: `/api/collaborations/roles/${fixture.ebookProId}`,
        body: {
            roleId: role.id,
            name: "Role v2",
            permissions: [
                CollaborationPermission.CHAPTER_READ,
                CollaborationPermission.CHAPTER_UPDATE,
            ],
        },
    })

    const response = await PUT_ROLE(request, routeContext(fixture.ebookProId))
    const body = await response.json() as CustomRoleResponseAPI

    expect(response.status).toBe(200)
    expect(body.id).toBe(role.id)
    expect(body.name).toBe("Role v2")
    expect(body.permissions).toEqual([
        CollaborationPermission.CHAPTER_READ,
        CollaborationPermission.CHAPTER_UPDATE,
    ])
})

test("DELETE /api/collaborations/roles/:ebookId blocks deletion when role is in use", async () => {
    const role = await prisma.ebookCustomRole.create({
        data: {
            ebookId: fixture.ebookProId,
            name: "Used role",
            permissions: [CollaborationPermission.CHAPTER_READ],
            createdByUserId: fixture.ownerProId,
        },
    })

    await prisma.ebookCollaborator.create({
        data: {
            ebookId: fixture.ebookProId,
            userId: fixture.collaboratorTargetId,
            role: null,
            customRoleId: role.id,
            allChaptersAccess: true,
        },
    })

    const request = collaborationRequest({
        method: "DELETE",
        userId: fixture.ownerProId,
        path: `/api/collaborations/roles/${fixture.ebookProId}`,
        body: {
            roleId: role.id,
        },
    })

    const response = await DELETE_ROLE(request, routeContext(fixture.ebookProId))
    const body = await response.json() as ResponseErrorAPI

    expect(response.status).toBe(400)
    expect(body.code).toBe("VALIDATION_ERROR")
    expect(body.fields?.roleId).toContain("CUSTOM_ROLE_IN_USE")
})
