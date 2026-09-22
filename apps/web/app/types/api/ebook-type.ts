import type { ApiErrorResponse } from "@/lib/errors"

export interface EbookTypeResponseAPI {
    id: string
    name: string
    slug: string
    description: string | null
    createdAt: number
    updatedAt: number
}

export interface PaginatedEbookTypesAPI {
    items: EbookTypeResponseAPI[]
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
}

export type ResponseErrorAPI = ApiErrorResponse
