import { z } from "zod"

import { MAX_LENGTH, MIN_LENGTH, VALIDATION_ERRORS } from "@mythrart/constants"

export const ChapterSchema = z.object({
    title: z
        .string({
            message: VALIDATION_ERRORS.CHAPTER_TITLE_REQUIRED,
        })
        .min(MIN_LENGTH.TITLE_CHAPTER, {
            message: VALIDATION_ERRORS.CHAPTER_TITLE_TOO_SHORT,
        })
        .max(MAX_LENGTH.TITLE_CHAPTER, {
            message: VALIDATION_ERRORS.CHAPTER_TITLE_TOO_LONG,
        }),
})

export type Chapter = z.infer<typeof ChapterSchema>

export const UpdateChapterSchema = ChapterSchema.pick({ title: true })
    .partial()
    .extend({
        content: z.unknown().optional(),
    })

export type UpdateChapter = z.infer<typeof UpdateChapterSchema>