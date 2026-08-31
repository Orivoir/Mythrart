import { z } from "zod"

import { MAX_LENGTH, MIN_LENGTH, VALIDATION_ERRORS } from "@mythrart/constants"

export const UserSchema = z.object({
    username: z
        .string({
            message: VALIDATION_ERRORS.USERNAME_REQUIRED,
        })
        .min(MIN_LENGTH.USERNAME, {
            message: VALIDATION_ERRORS.USERNAME_TOO_SHORT,
        })
        .max(MAX_LENGTH.USERNAME, {
            message: VALIDATION_ERRORS.USERNAME_TOO_LONG,
        }),
    email: z
        .email({
            message: VALIDATION_ERRORS.INVALID_EMAIL,
        }),
})

export type User = z.infer<typeof UserSchema>