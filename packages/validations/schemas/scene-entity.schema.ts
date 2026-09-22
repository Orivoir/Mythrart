import { z } from "zod"

export const SceneEntityCreateSchema = z.object({
    entityId: z.string().min(1, { message: "ENTITY_ID_REQUIRED" }),
})

export type SceneEntityCreate = z.infer<typeof SceneEntityCreateSchema>
