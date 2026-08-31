import { NextResponse } from "next/server"

import { HTTP_ERRORS } from "@/lib/constants/http-code"

import { ApiException, type ApiErrorFields } from "./api-exception"

export interface ApiErrorResponse {
    code: string
    message: string
    fields?: ApiErrorFields
}

const INTERNAL_ERROR_RESPONSE: ApiErrorResponse = HTTP_ERRORS.INTERNAL_ERROR

/**
 * Converts a thrown error into the public JSON error contract.
 *
 * Only ApiException instances expose their message and fields. Unknown errors
 * are intentionally replaced with a generic response so implementation details
 * are not returned to clients.
 */
export function apiErrorResponse(error: unknown): NextResponse<ApiErrorResponse> {
    if (error instanceof ApiException) {
        return NextResponse.json<ApiErrorResponse>(
            {
                code: error.code,
                message: error.message,
                ...(error.fields ? { fields: error.fields } : {}),
            },
            { status: error.status },
        )
    }

    console.error("Unexpected API error", error)

    return NextResponse.json<ApiErrorResponse>(INTERNAL_ERROR_RESPONSE, {
        status: HTTP_ERRORS.INTERNAL_ERROR.status,
    })
}

/**
 * Reads a JSON request body and reports malformed JSON as an expected API error.
 */
export async function parseApiJson(request: Request): Promise<unknown> {
    try {
        return await request.json()
    } catch {
        throw new ApiException(HTTP_ERRORS.INVALID_JSON)
    }
}

/**
 * Reads a JSON object request body. Arrays, null, and primitives are invalid
 * for the REST endpoints in this application.
 */
export async function parseApiJsonObject(request: Request): Promise<Record<string, unknown>> {
    const body = await parseApiJson(request)

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        throw new ApiException({
            ...HTTP_ERRORS.VALIDATION_ERROR,
            fields: {
                root: ["INVALID_REQUEST_BODY"],
            },
        })
    }

    return body as Record<string, unknown>
}
