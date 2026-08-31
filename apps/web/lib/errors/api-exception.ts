export type ApiErrorFields = Record<string, string[]>

export interface ApiExceptionOptions {
    status: number
    code: string
    message: string
    fields?: ApiErrorFields
}

/**
 * An expected API error that can safely be returned to a client.
 */
export class ApiException extends Error {
    readonly status: number
    readonly code: string
    readonly fields?: ApiErrorFields

    constructor({ status, code, message, fields }: ApiExceptionOptions) {
        super(message)

        this.name = "ApiException"
        this.status = status
        this.code = code
        this.fields = fields
    }
}
