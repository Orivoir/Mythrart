import type { ApiErrorResponse } from "@/lib/errors"

export interface EbookResponseAPI {
    id: string;
    title: string;
    subtitle?: string;
    shortDescription?: string;
    createdAt: number;
    updatedAt: number;
}

export interface PaginatedEbooksAPI {
    items: EbookResponseAPI[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

export interface CreateEbookRequestAPI {
    title: string;
    subtitle?: string;
    shortDescription?: string;
}

export interface CreateEbookResponseAPI extends EbookResponseAPI {
    createdAt: number;
    updatedAt: number;
}

export type UpdateEbookRequestAPI = CreateEbookRequestAPI

export interface UpdateEbookResponseAPI extends EbookResponseAPI {}

export type DeleteEbookRequestAPI = Record<string, never>

export interface DeleteEbookResponseAPI {
    success: boolean;
}

export type ResponseErrorAPI = ApiErrorResponse
