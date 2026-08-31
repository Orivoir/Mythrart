
import { canAddCollaboratorToEbook } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException } from "@/lib/errors"
import { prisma, CollaborationPermission } from "@mythrart/database"
import { CollaboratorCreateSchema, CollaboratorDeleteSchema, CollaboratorUpdateSchema } from "@mythrart/validations"

import { assertCustomRolesEnabled, ensureEbookPermission, parseChapterIdsForEbook } from "../../utils"

type CreateCollaboratorInput = {
    ebookId: string
    actorUserId: string
    payload: unknown
}

type UpdateCollaboratorInput = {
    ebookId: string
    actorUserId: string
    payload: unknown
}

type DeleteCollaboratorInput = {
    ebookId: string
    actorUserId: string
    payload: unknown
}

async function assertCustomRoleExists(options: { ebookId: string, customRoleId: string }) {
    const customRole = await prisma.ebookCustomRole.findFirst({
        where: {
            id: options.customRoleId,
            ebookId: options.ebookId,
        },
        select: {
            id: true,
        },
    })

    if (!customRole) {
        throw new ApiException({
            ...HTTP_ERRORS.VALIDATION_ERROR,
            fields: {
                customRoleId: ["CUSTOM_ROLE_NOT_FOUND"],
            },
        })
    }
}

export async function createEbookCollaborator(options: CreateCollaboratorInput) {
    const parsed = CollaboratorCreateSchema.parse(options.payload)

    const ebook = await ensureEbookPermission({
        ebookId: options.ebookId,
        userId: options.actorUserId,
        permission: CollaborationPermission.COLLABORATOR_INVITE,
    })

    if (parsed.collaboratorUserId === ebook.ownerId) {
        throw new ApiException({
            ...HTTP_ERRORS.VALIDATION_ERROR,
            fields: {
                collaboratorUserId: ["COLLABORATOR_CANNOT_BE_OWNER"],
            },
        })
    }

    const targetUser = await prisma.user.findUnique({
        where: {
            id: parsed.collaboratorUserId,
        },
        select: {
            id: true,
        },
    })

    if (!targetUser) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const existing = await prisma.ebookCollaborator.findUnique({
        where: {
            ebookId_userId: {
                ebookId: options.ebookId,
                userId: parsed.collaboratorUserId,
            },
        },
        select: {
            id: true,
        },
    })

    if (existing) {
        throw new ApiException({
            ...HTTP_ERRORS.VALIDATION_ERROR,
            fields: {
                collaboratorUserId: ["COLLABORATOR_ALREADY_EXISTS"],
            },
        })
    }

    if (parsed.customRoleId) {
        assertCustomRolesEnabled(ebook.owner.plan)
        await assertCustomRoleExists({
            ebookId: options.ebookId,
            customRoleId: parsed.customRoleId,
        })
    }

    const canAddCollaborator = await canAddCollaboratorToEbook({
        userId: ebook.ownerId,
        ebookId: options.ebookId,
        isCustomRole: Boolean(parsed.customRoleId),
    })

    if (!canAddCollaborator) {
        throw new ApiException(HTTP_ERRORS.PAYMENT_REQUIRED)
    }

    const allChaptersAccess = parsed.allChaptersAccess ?? true
    const chapterIds = await parseChapterIdsForEbook({
        ebookId: options.ebookId,
        chapterIds: parsed.chapterIds,
    })

    return prisma.ebookCollaborator.create({
        data: {
            ebookId: options.ebookId,
            userId: parsed.collaboratorUserId,
            role: parsed.role ?? null,
            customRoleId: parsed.customRoleId ?? null,
            allChaptersAccess,
            chapterAccess: {
                createMany: {
                    data: allChaptersAccess
                        ? []
                        : chapterIds.map((chapterId) => ({
                            chapterId,
                        })),
                },
            },
        },
        include: {
            chapterAccess: {
                select: {
                    chapterId: true,
                },
            },
        },
    })
}

export async function updateEbookCollaborator(options: UpdateCollaboratorInput) {
    const parsed = CollaboratorUpdateSchema.parse(options.payload)

    const ebook = await ensureEbookPermission({
        ebookId: options.ebookId,
        userId: options.actorUserId,
        permission: CollaborationPermission.ROLE_ASSIGN,
    })

    if (parsed.collaboratorUserId === ebook.ownerId) {
        throw new ApiException({
            ...HTTP_ERRORS.VALIDATION_ERROR,
            fields: {
                collaboratorUserId: ["COLLABORATOR_CANNOT_BE_OWNER"],
            },
        })
    }

    const collaborator = await prisma.ebookCollaborator.findUnique({
        where: {
            ebookId_userId: {
                ebookId: options.ebookId,
                userId: parsed.collaboratorUserId,
            },
        },
        select: {
            id: true,
            allChaptersAccess: true,
        },
    })

    if (!collaborator) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    if (parsed.customRoleId) {
        assertCustomRolesEnabled(ebook.owner.plan)
        await assertCustomRoleExists({
            ebookId: options.ebookId,
            customRoleId: parsed.customRoleId,
        })
    }

    const chapterIds = await parseChapterIdsForEbook({
        ebookId: options.ebookId,
        chapterIds: parsed.chapterIds,
    })

    const nextAllChaptersAccess = parsed.allChaptersAccess ?? collaborator.allChaptersAccess

    await prisma.$transaction(async (tx) => {
        await tx.ebookCollaborator.update({
            where: {
                ebookId_userId: {
                    ebookId: options.ebookId,
                    userId: parsed.collaboratorUserId,
                },
            },
            data: {
                ...(parsed.role
                    ? {
                        role: parsed.role,
                        customRoleId: null,
                    }
                    : {}),
                ...(parsed.customRoleId
                    ? {
                        role: null,
                        customRoleId: parsed.customRoleId,
                    }
                    : {}),
                ...(parsed.allChaptersAccess === undefined
                    ? {}
                    : {
                        allChaptersAccess: parsed.allChaptersAccess,
                    }),
            },
        })

        if (nextAllChaptersAccess) {
            await tx.ebookCollaboratorChapterAccess.deleteMany({
                where: {
                    collaboratorId: collaborator.id,
                },
            })
            return
        }

        if (parsed.chapterIds) {
            await tx.ebookCollaboratorChapterAccess.deleteMany({
                where: {
                    collaboratorId: collaborator.id,
                },
            })

            if (chapterIds.length > 0) {
                await tx.ebookCollaboratorChapterAccess.createMany({
                    data: chapterIds.map((chapterId) => ({
                        collaboratorId: collaborator.id,
                        chapterId,
                    })),
                })
            }
        }
    })

    const updatedCollaborator = await prisma.ebookCollaborator.findUnique({
        where: {
            ebookId_userId: {
                ebookId: options.ebookId,
                userId: parsed.collaboratorUserId,
            },
        },
        include: {
            chapterAccess: {
                select: {
                    chapterId: true,
                },
            },
        },
    })

    if (!updatedCollaborator) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    return updatedCollaborator
}

export async function deleteEbookCollaborator(options: DeleteCollaboratorInput) {
    const parsed = CollaboratorDeleteSchema.parse(options.payload)

    const ebook = await ensureEbookPermission({
        ebookId: options.ebookId,
        userId: options.actorUserId,
        permission: CollaborationPermission.COLLABORATOR_REMOVE,
    })

    if (parsed.collaboratorUserId === ebook.ownerId) {
        throw new ApiException({
            ...HTTP_ERRORS.VALIDATION_ERROR,
            fields: {
                collaboratorUserId: ["COLLABORATOR_CANNOT_BE_OWNER"],
            },
        })
    }

    const deleteResult = await prisma.ebookCollaborator.deleteMany({
        where: {
            ebookId: options.ebookId,
            userId: parsed.collaboratorUserId,
        },
    })

    if (deleteResult.count === 0) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }
}