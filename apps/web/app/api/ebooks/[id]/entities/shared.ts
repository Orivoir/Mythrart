import type {
  EbookEntityType,
  Prisma,
} from "@mythrart/database"

import { prisma } from "@mythrart/database"

export const ebookEntityWithRelationsInclude = {
  relationsFrom: {
    include: {
      toEntity: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
        },
      },
    },
  },
  relationsTo: {
    include: {
      fromEntity: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
        },
      },
    },
  },
} satisfies Prisma.EbookEntityInclude

export type EbookEntityWithRelations = Prisma.EbookEntityGetPayload<{
  include: typeof ebookEntityWithRelationsInclude
}>

export interface FindEbookEntitiesOptions {
  ebookId: string
  type?: EbookEntityType
  search?: string
}

export async function findEbookEntities(
  options: FindEbookEntitiesOptions,
): Promise<EbookEntityWithRelations[]> {
  const where: Prisma.EbookEntityWhereInput = {
    ebookId: options.ebookId,

    ...(options.type
      ? {
          type: options.type,
        }
      : {}),

    ...(options.search
      ? {
          OR: [
            {
              name: {
                contains: options.search,
                mode: "insensitive",
              },
            },
            {
              slug: {
                contains: options.search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  }

  return prisma.ebookEntity.findMany({
    where,
    include: ebookEntityWithRelationsInclude,
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function findSceneEntityIds(
  sceneId: string,
): Promise<string[]> {
  const sceneEntities = await prisma.sceneEntity.findMany({
    where: {
      sceneId,
    },
    select: {
      entityId: true,
    },
  })

  return sceneEntities.map(({ entityId }) => entityId)
}

export function sortEbookEntitiesByScene(
  entities: EbookEntityWithRelations[],
  sceneEntityIds: string[],
): EbookEntityWithRelations[] {
  const sceneEntityIdSet = new Set(sceneEntityIds)

  return [...entities].sort((a, b) => {
    const aInScene = sceneEntityIdSet.has(a.id)
    const bInScene = sceneEntityIdSet.has(b.id)

    if (aInScene !== bInScene) {
      return aInScene ? -1 : 1
    }

    return b.createdAt.getTime() - a.createdAt.getTime()
  })
}