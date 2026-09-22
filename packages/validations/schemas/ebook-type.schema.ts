import { z } from "zod"

export const EbookTypeSchema = z.object({
    name: z.string().min(1, { message: "TYPE_NAME_REQUIRED" }),
    slug: z.string().min(1, { message: "TYPE_SLUG_REQUIRED" }).optional(),
    description: z.string().nullable().optional(),
})

export type EbookTypeInput = z.infer<typeof EbookTypeSchema>
