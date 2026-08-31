import { HTTP_ERRORS } from "@/lib/constants/http-code"

import { ApiException } from "./api-exception"

/**
 * @description Converts a string error message, from upload into the API's public error shape.
 * @param error
 * @throw {ApiException}
 */
export function apiUploadException(error: string): ApiException {
    return new ApiException({
        ...HTTP_ERRORS.VALIDATION_ERROR,
        fields: {error: [error]},
    })
}
