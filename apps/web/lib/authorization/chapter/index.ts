import { type PlanType, PLANS } from "@/lib/constants/plan"
import { prisma, CollaborationPermission, type Chapter } from "@mythrart/database"

import { collaboratorCanAccessChapter, collaboratorHasPermission, getEbookCollaboratorForUser } from "../collaborations"

export interface ChapterCreateAuthorizationResult {
  canCreate: boolean
  ebookId: string | null
  limitReached: boolean
}

function toPlanType(value: string): PlanType {
  return value.toUpperCase() as PlanType
}

export async function canCreateChapterForEbook(options: {
  ebookId: string
  userId: string
}): Promise<ChapterCreateAuthorizationResult> {
  const { ebookId, userId } = options

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
      _count: {
        select: {
          chapters: true,
        },
      },
    },
  })

  if (!ebook) {
    return {
      canCreate: false,
      ebookId: null,
      limitReached: false,
    }
  }

  const chaptersLimit = PLANS[toPlanType(ebook.owner.plan)].limits.chaptersPerProject
  const limitReached = ebook._count.chapters >= chaptersLimit

  if (limitReached) {
    return {
      canCreate: false,
      ebookId: ebook.id,
      limitReached: true,
    }
  }

  if (ebook.ownerId === userId) {
    return {
      canCreate: true,
      ebookId: ebook.id,
      limitReached: false,
    }
  }

  const collaborator = await getEbookCollaboratorForUser(ebook.id, userId)

  if (!collaborator) {
    return {
      canCreate: false,
      ebookId: ebook.id,
      limitReached: false,
    }
  }

  return {
    canCreate: collaboratorHasPermission(collaborator, CollaborationPermission.CHAPTER_CREATE),
    ebookId: ebook.id,
    limitReached: false,
  }
}

export async function canManageChapterByPermission(options: {
  chapterId: string
  userId: string
  permission: CollaborationPermission
}): Promise<Chapter | null> {
  const { chapterId, userId, permission } = options

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
    },
  })

  if (!chapter) {
    return null
  }

  const ebook = await prisma.ebook.findUnique({
    where: {
      id: chapter.ebookId,
    },
    select: {
      id: true,
      ownerId: true,
    },
  })

  if (!ebook) {
    return null
  }

  if (ebook.ownerId === userId) {
    return chapter
  }

  const collaborator = await getEbookCollaboratorForUser(ebook.id, userId)

  if (!collaborator) {
    return null
  }

  if (!collaboratorHasPermission(collaborator, permission)) {
    return null
  }

  if (!collaboratorCanAccessChapter(collaborator, chapter.id)) {
    return null
  }

  return chapter
}