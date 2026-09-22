import { z } from "zod"

export const EbookThemeSchema = z.object({
    name: z.string().min(1, { message: "THEME_NAME_REQUIRED" }),
    slug: z.string().min(1, { message: "THEME_SLUG_REQUIRED" }).optional(),
    description: z.string().nullable().optional(),
    backgroundColor: z.string().min(1, { message: "THEME_BACKGROUND_COLOR_REQUIRED" }),
    textColor: z.string().min(1, { message: "THEME_TEXT_COLOR_REQUIRED" }),
    textFont: z.string().min(1, { message: "THEME_TEXT_FONT_REQUIRED" }),
    titleFont: z.string().min(1, { message: "THEME_TITLE_FONT_REQUIRED" }),
    subtitleFont: z.string().nullable().optional(),
    headingColor: z.string().nullable().optional(),
    fontSize: z.string().nullable().optional(),
    lineHeight: z.string().nullable().optional(),
    paragraphSpacing: z.string().nullable().optional(),
    headingSpacing: z.string().nullable().optional(),
})

export type EbookThemeInput = z.infer<typeof EbookThemeSchema>

export const CreateEbookThemeSchema = EbookThemeSchema

export type CreateEbookTheme = z.infer<typeof CreateEbookThemeSchema>

export const UpdateEbookThemeSchema = EbookThemeSchema.partial().extend({
    themeId: z.string().min(1, { message: "THEME_ID_REQUIRED" }).optional(),
    id: z.string().min(1, { message: "THEME_ID_REQUIRED" }).optional(),
}).superRefine((value, context) => {
    if (!value.themeId && !value.id) {
        context.addIssue({
            code: "custom",
            path: ["themeId"],
            message: "THEME_ID_REQUIRED",
        })
    }
})

export type UpdateEbookTheme = z.infer<typeof UpdateEbookThemeSchema>

export const DeleteEbookThemeSchema = z.object({
    themeId: z.string().min(1, { message: "THEME_ID_REQUIRED" }).optional(),
    id: z.string().min(1, { message: "THEME_ID_REQUIRED" }).optional(),
}).superRefine((value, context) => {
    if (!value.themeId && !value.id) {
        context.addIssue({
            code: "custom",
            path: ["themeId"],
            message: "THEME_ID_REQUIRED",
        })
    }
})

export type DeleteEbookTheme = z.infer<typeof DeleteEbookThemeSchema>
