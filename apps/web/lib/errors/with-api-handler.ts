import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { apiErrorResponse, type ApiErrorResponse } from "./api-error-response"
import { apiValidationException } from "./api-validation-exception"

type AsyncRouteHandler<TArgs extends unknown[], TResponse extends NextResponse> = (
    ...args: TArgs
) => Promise<TResponse>

/**
 * Wraps a route handler with consistent API error handling.
 */
export function withApiHandler<TArgs extends unknown[], TResponse extends NextResponse>(
    handler: AsyncRouteHandler<TArgs, TResponse>,
): (...args: TArgs) => Promise<TResponse | NextResponse<ApiErrorResponse>> {
    return async (...args: TArgs): Promise<TResponse | NextResponse<ApiErrorResponse>> => {
        try {
            return await handler(...args)
        } catch (error) {
            if (error instanceof ZodError) {
                return apiErrorResponse(apiValidationException(error))
            }

            return apiErrorResponse(error)
        }
    }
}