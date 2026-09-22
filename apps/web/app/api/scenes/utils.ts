import type { SceneResponseAPI } from "@/app/types/api/scene"
import { mapModelTimestamps } from "@/lib/map-date-fields-to-timestamps"
import type { Scene } from "@mythrart/database"

export function mapSceneToResponse(scene: Scene): SceneResponseAPI {
    const mapped = mapModelTimestamps(scene)

    return {
        id: mapped.id,
        chapterId: mapped.chapterId,
        title: mapped.title,
        objective: mapped.objective,
        order: mapped.order,
        createdAt: mapped.createdAt,
        updatedAt: mapped.updatedAt,
    }
}
