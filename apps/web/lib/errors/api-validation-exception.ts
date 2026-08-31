import type { ZodError } from "zod"

import { HTTP_ERRORS } from "@/lib/constants/http-code"

import { ApiException, type ApiErrorFields } from "./api-exception"

function toFields(error: ZodError): ApiErrorFields {
    return error.issues.reduce<ApiErrorFields>((fields, issue) => {
        const field = issue.path.length > 0 ? issue.path.join(".") : "root"
        const messages = fields[field] ?? []

        if (!messages.includes(issue.message)) {
            messages.push(issue.message)
        }

        fields[field] = messages
        return fields
    }, {})
}

/**
 * Converts Zod's request-validation result into the API's public error shape.
 */
export function apiValidationException(error: ZodError): ApiException {
    return new ApiException({
        ...HTTP_ERRORS.VALIDATION_ERROR,
        fields: toFields(error),
    })
}
