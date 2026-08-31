import { prisma, CollaborationPermission } from "@mythrart/database"
import { type PlanFeatures, type PlanType, PLANS } from "@/lib/constants/plan"

import {
  collaborationPermissionAppliesToChapter,
  collaboratorCanAccessChapter as canAccessChapter,
  collaboratorHasPermission as hasPermission,
  type EbookCollaboratorWithAccess,
} from "../collaboration-permissions"

export interface CanAddCollaboratorToEbookOptions {
  userId: string
  ebookId: string
  isCustomRole: boolean
}

function toPlanType(value: string): PlanType {
  return value.toUpperCase() as PlanType
}

export async function canAddCollaboratorToEbook(options: CanAddCollaboratorToEbookOptions): Promise<boolean> {
  const { userId, ebookId, isCustomRole } = options

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      plan: true,
    },
  })

  if (!user) {
    return false
  }

  const planUser = toPlanType(user.plan)
  const { collaborators } = PLANS[planUser].limits
  const collaborationPlan = PLANS[planUser].features.collaboration as PlanFeatures["collaboration"]

  const currentCollaboratorsCount = await countCollaboratorsForEbook(ebookId)

  if (isCustomRole && !collaborationPlan.advancedRoles) {
    return false
  } else if (currentCollaboratorsCount >= collaborators) {
    return false
  }

  return true
}

export async function countCollaboratorsForEbook(ebookId: string): Promise<number> {
  const collaboratorsCount = await prisma.ebookCollaborator.count({
    where: {
      ebookId,
    },
  })

  return collaboratorsCount
}

// @TODO: this file should be define only about authorization, this function is a getter access should be moved at others helpers file
export async function getEbookCollaboratorForUser(ebookId: string, userId: string): Promise<EbookCollaboratorWithAccess | null> {
  return prisma.ebookCollaborator.findUnique({
    where: {
      ebookId_userId: {
        ebookId,
        userId,
      },
    },
    include: {
      customRole: {
        select: {
          permissions: true,
        },
      },
      chapterAccess: {
        select: {
          chapterId: true,
        },
      },
    },
  })
}

export function collaboratorCanAccessChapter(collaborator: EbookCollaboratorWithAccess, chapterId: string): boolean {
  return canAccessChapter(collaborator, chapterId)
}

export function collaboratorHasPermission(
  collaborator: EbookCollaboratorWithAccess,
  permission: CollaborationPermission,
): boolean {
  return hasPermission(collaborator, permission)
}

export async function hasEbookPermissionForUser(options: {
  ebookId: string
  userId: string
  permission: CollaborationPermission
  chapterId?: string
}): Promise<boolean> {
  const { ebookId, userId, permission, chapterId } = options

  const ownerRecord = await prisma.ebook.findFirst({
    where: {
      id: ebookId,
      ownerId: userId,
    },
    select: {
      id: true,
    },
  })

  if (ownerRecord) {
    return true
  }

  const collaborator = await getEbookCollaboratorForUser(ebookId, userId)

  if (!collaborator || !collaboratorHasPermission(collaborator, permission)) {
    return false
  }

  if (chapterId && collaborationPermissionAppliesToChapter(permission)) {
    return collaboratorCanAccessChapter(collaborator, chapterId)
  }

  return true
}