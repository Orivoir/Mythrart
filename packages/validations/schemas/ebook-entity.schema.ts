import { z } from "zod"
import { EbookEntityType } from "@mythrart/constants"

const EbookEntityTypeSchema = z.enum(EbookEntityType)

export const EbookEntitySchema = z.object({
    name: z.string().min(1, { message: "ENTITY_NAME_REQUIRED" }),
    slug: z.string().min(1, { message: "ENTITY_SLUG_REQUIRED" }).optional(),
    type: EbookEntityTypeSchema,
    description: z.string().nullable().optional(),
})

export type EbookEntityInput = z.infer<typeof EbookEntitySchema>

export const CreateEbookEntitySchema = EbookEntitySchema

export type CreateEbookEntity = z.infer<typeof CreateEbookEntitySchema>

export const UpdateEbookEntitySchema = z.object({
    name: z.string().min(1, { message: "ENTITY_NAME_REQUIRED" }).optional(),
    slug: z.string().min(1, { message: "ENTITY_SLUG_REQUIRED" }).optional(),
    type: EbookEntityTypeSchema.optional(),
    description: z.string().nullable().optional(),
}).superRefine((value, context) => {
    if (
        value.name === undefined &&
        value.slug === undefined &&
        value.type === undefined &&
        value.description === undefined
    ) {
        context.addIssue({
            code: "custom",
            path: ["root"],
            message: "NO_UPDATE_FIELDS",
        })
    }
})

export type UpdateEbookEntity = z.infer<typeof UpdateEbookEntitySchema>
