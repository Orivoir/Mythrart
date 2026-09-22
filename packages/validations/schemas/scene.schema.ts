import { z } from "zod"

export const SceneSchema = z.object({
    chapterId: z.string().min(1, { message: "CHAPTER_ID_REQUIRED" }),
    title: z.string().min(1, { message: "SCENE_TITLE_REQUIRED" }),
    objective: z.string().nullable().optional(),
    order: z.number().int().min(0).nullable().optional(),
})

export type Scene = z.infer<typeof SceneSchema>

export const CreateSceneSchema = SceneSchema

export type CreateScene = z.infer<typeof CreateSceneSchema>

export const UpdateSceneSchema = z.object({
    title: z.string().min(1, { message: "SCENE_TITLE_REQUIRED" }).optional(),
    objective: z.string().nullable().optional(),
    order: z.number().int().min(0).nullable().optional(),
    chapterId: z.string().min(1, { message: "CHAPTER_ID_REQUIRED" }).optional(),
}).superRefine((value, context) => {
    if (
        value.title === undefined &&
        value.objective === undefined &&
        value.order === undefined &&
        value.chapterId === undefined
    ) {
        context.addIssue({
            code: "custom",
            path: ["root"],
            message: "NO_UPDATE_FIELDS",
        })
    }
})

export type UpdateScene = z.infer<typeof UpdateSceneSchema>
