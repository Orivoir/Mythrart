import type { ApiErrorResponse } from "@/lib/errors"
import type { EbookEntityType } from "@mythrart/database"

export interface EbookEntityResponseAPI {
    id: string
    ebookId: string
    name: string
    slug: string
    type: EbookEntityType
    description: string | null
    createdAt: number
    updatedAt: number
}

export interface PaginatedEbookEntitiesAPI {
    items: EbookEntityResponseAPI[]
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
}

export interface CreateEbookEntityRequestAPI {
    name: string
    slug?: string
    type: EbookEntityType
    description?: string | null
}

export interface CreateEbookEntityResponseAPI extends EbookEntityResponseAPI {}

export interface UpdateEbookEntityRequestAPI {
    name?: string
    slug?: string
    type?: EbookEntityType
    description?: string | null
}

export interface UpdateEbookEntityResponseAPI extends EbookEntityResponseAPI {}

export interface DeleteEbookEntityResponseAPI {
    success: boolean
}

export type ResponseErrorAPI = ApiErrorResponse
