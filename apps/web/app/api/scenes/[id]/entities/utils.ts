import type { SceneEntityResponseAPI } from "@/app/types/api/scene-entity"
import { mapModelTimestamps } from "@/lib/map-date-fields-to-timestamps"
import type { EbookEntity, SceneEntity } from "@mythrart/database"

export function mapSceneEntityToResponse(
    sceneEntity: SceneEntity & { entity?: EbookEntity },
): SceneEntityResponseAPI {
    return {
        sceneId: sceneEntity.sceneId,
        entityId: sceneEntity.entityId,
        createdAt: sceneEntity.createdAt.getTime(),
        ...(sceneEntity.entity
            ? {
                entity: {
                    id: sceneEntity.entity.id,
                    ebookId: sceneEntity.entity.ebookId,
                    name: sceneEntity.entity.name,
                    slug: sceneEntity.entity.slug,
                    type: sceneEntity.entity.type,
                    description: sceneEntity.entity.description,
                    ...mapModelTimestamps({
                        createdAt: sceneEntity.entity.createdAt,
                        updatedAt: sceneEntity.entity.updatedAt,
                    }),
                },
            }
            : {}),
    }
}
