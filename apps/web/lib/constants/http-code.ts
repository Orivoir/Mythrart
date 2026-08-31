/**
 * Public HTTP errors shared by all REST endpoints.
 *
 * `code` is stable for client logic and translations; `message` is a
 * human-readable fallback for clients that do not translate error codes.
 */
export const HTTP_ERRORS = {
    INVALID_JSON: {
        status: 400,
        code: "INVALID_JSON",
        message: "Request body must be valid JSON",
    },
    VALIDATION_ERROR: {
        status: 400,
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
    },
    BAD_REQUEST: {
        status: 400,
        code: "BAD_REQUEST",
        message: "Bad request",
    },
    UNAUTHORIZED: {
        status: 401,
        code: "UNAUTHORIZED",
        message: "Unauthorized",
    },
    NOT_FOUND: {
        status: 404,
        code: "NOT_FOUND",
        message: "Not found",
    },
    INTERNAL_ERROR: {
        status: 500,
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
    },
    PAYMENT_REQUIRED: {
        status: 402,
        code: "PAYMENT_REQUIRED",
        message: "Payment required",
    },
} as const

export const HTTP_ERROR_BAD_REQUEST = HTTP_ERRORS.VALIDATION_ERROR.code
export const HTTP_ERROR_UNAUTHORIZED = HTTP_ERRORS.UNAUTHORIZED.code
export const HTTP_ERROR_NOT_FOUND = HTTP_ERRORS.NOT_FOUND.code
export const HTTP_ERROR_INTERNAL = HTTP_ERRORS.INTERNAL_ERROR.code

export const HTTP_BAD_REQUEST = HTTP_ERRORS.VALIDATION_ERROR.message
export const HTTP_UNAUTHORIZED = HTTP_ERRORS.UNAUTHORIZED.message
export const HTTP_NOT_FOUND = HTTP_ERRORS.NOT_FOUND.message
export const HTTP_INTERNAL_ERROR = HTTP_ERRORS.INTERNAL_ERROR.message
