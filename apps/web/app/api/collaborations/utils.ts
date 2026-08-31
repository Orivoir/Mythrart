import { prisma, CollaborationPermission, type EbookCollaborator, type EbookCustomRole } from "@mythrart/database"

import { hasEbookPermissionForUser } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { type PlanType, PLANS } from "@/lib/constants/plan"
import { ApiException } from "@/lib/errors"

import type { CollaboratorResponseAPI, CustomRoleResponseAPI } from "@/app/types/api/collaboration"

type EbookWithOwnerPlan = {
    id: string
    ownerId: string
    owner: {
        plan: string
    }
}

function toPlanType(value: string): PlanType {
    return value.toUpperCase() as PlanType
}

export function getCollaboratorPlanFeatures(plan: string) {
    return PLANS[toPlanType(plan)].features.collaboration
}

export function assertCustomRolesEnabled(plan: string): void {
    const features = getCollaboratorPlanFeatures(plan)
    const customRolesEnabled = "customRoles" in features && Boolean(features.customRoles)

    if (!customRolesEnabled) {
        throw new ApiException(HTTP_ERRORS.PAYMENT_REQUIRED)
    }
}

export async function ensureEbookExists(ebookId: string): Promise<EbookWithOwnerPlan> {
    const ebook = await prisma.ebook.findUnique({
        where: {
            id: ebookId,
        },
        select: {
            id: true,
            ownerId: true,
            owner: {
                select: {
                    plan: true,
                },
            },
        },
    })

    if (!ebook) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    return ebook
}

export async function ensureEbookPermission(options: {
    ebookId: string
    userId: string
    permission: CollaborationPermission
}): Promise<EbookWithOwnerPlan> {
    const { ebookId, userId, permission } = options

    const ebook = await ensureEbookExists(ebookId)

    const hasPermission = await hasEbookPermissionForUser({
        ebookId,
        userId,
        permission,
    })

    if (!hasPermission) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    return ebook
}

export async function parseChapterIdsForEbook(options: {
    ebookId: string
    chapterIds?: string[]
}): Promise<string[]> {
    const chapterIds = options.chapterIds ?? []
    const uniqueChapterIds = Array.from(new Set(chapterIds))

    if (uniqueChapterIds.length === 0) {
        return []
    }

    const chaptersCount = await prisma.chapter.count({
        where: {
            ebookId: options.ebookId,
            id: {
                in: uniqueChapterIds,
            },
        },
    })

    if (chaptersCount !== uniqueChapterIds.length) {
        throw new ApiException({
            ...HTTP_ERRORS.VALIDATION_ERROR,
            fields: {
                chapterIds: ["CHAPTER_IDS_INVALID"],
            },
        })
    }

    return uniqueChapterIds
}

export function mapCollaboratorResponse(collaborator: EbookCollaborator & {
    chapterAccess: Array<{ chapterId: string }>
}): CollaboratorResponseAPI {
    return {
        id: collaborator.id,
        ebookId: collaborator.ebookId,
        userId: collaborator.userId,
        role: collaborator.role,
        customRoleId: collaborator.customRoleId,
        allChaptersAccess: collaborator.allChaptersAccess,
        chapterIds: collaborator.chapterAccess.map((entry) => entry.chapterId),
        createdAt: collaborator.createdAt.getTime(),
        updatedAt: collaborator.updatedAt.getTime(),
    }
}

export function mapCustomRoleResponse(role: EbookCustomRole): CustomRoleResponseAPI {
    return {
        id: role.id,
        ebookId: role.ebookId,
        name: role.name,
        permissions: role.permissions,
        createdByUserId: role.createdByUserId,
        createdAt: role.createdAt.getTime(),
        updatedAt: role.updatedAt.getTime(),
    }
}
