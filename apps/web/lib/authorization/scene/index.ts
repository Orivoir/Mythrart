import { prisma, CollaborationPermission, type Chapter, type Scene } from "@mythrart/database"

import { canManageChapterByPermission } from "../chapter"

export async function canManageSceneByPermission(options: {
  sceneId: string
  userId: string
  permission: CollaborationPermission
}): Promise<{ scene: Scene; chapter: Chapter } | null> {
  const { sceneId, userId, permission } = options

  const scene = await prisma.scene.findUnique({
    where: {
      id: sceneId,
    },
  })

  if (!scene || !scene.chapterId) {
    return null
  }

  const chapter = await canManageChapterByPermission({
    chapterId: scene.chapterId,
    userId,
    permission,
  })

  if (!chapter) {
    return null
  }

  return { scene, chapter }
}
