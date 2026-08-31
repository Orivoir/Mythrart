import { z } from "zod"

import { MAX_LENGTH, MIN_LENGTH, VALIDATION_ERRORS } from "@mythrart/constants"

export const EbookSchema = z.object({
    title: z
        .string({
            message: VALIDATION_ERRORS.TITLE_REQUIRED,
        })
        .min(MIN_LENGTH.TITLE_EBOOK, {
            message: VALIDATION_ERRORS.TITLE_TOO_SHORT,
        })
        .max(MAX_LENGTH.TITLE_EBOOK, {
            message: VALIDATION_ERRORS.TITLE_TOO_LONG,
        }),
    subtitle: z
        .string({
            message: VALIDATION_ERRORS.SUBTITLE_TOO_SHORT,
        })
        .min(MIN_LENGTH.SUBTITLE_EBOOK, {
            message: VALIDATION_ERRORS.SUBTITLE_TOO_SHORT,
        })
        .max(MAX_LENGTH.SUBTITLE_EBOOK, {
            message: VALIDATION_ERRORS.SUBTITLE_TOO_LONG,
        })
        .optional(),
    shortDescription: z
        .string({
            message: VALIDATION_ERRORS.SHORT_DESCRIPTION_TOO_SHORT,
        })
        .min(MIN_LENGTH.SHORT_DESCRIPTION_EBOOK, {
            message: VALIDATION_ERRORS.SHORT_DESCRIPTION_TOO_SHORT,
        })
        .max(MAX_LENGTH.SHORT_DESCRIPTION_EBOOK, {
            message: VALIDATION_ERRORS.SHORT_DESCRIPTION_TOO_LONG,
        })
        .optional(),
})

export type Ebook = z.infer<typeof EbookSchema>