import type { ApiErrorResponse } from "@/lib/errors"

import type { EbookTypeResponseAPI } from "./ebook-type"
import type { EbookThemeResponseAPI } from "./theme"

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
    ebookTypeId?: string;
    ebookThemeId?: string;
}

export interface CreateEbookResponseAPI extends EbookResponseAPI {
    createdAt: number;
    updatedAt: number;
}

export interface GetEbookResponseAPI extends EbookResponseAPI {
    type: EbookTypeResponseAPI;
    theme: EbookThemeResponseAPI;
}

export type UpdateEbookRequestAPI = CreateEbookRequestAPI

export interface UpdateEbookResponseAPI extends EbookResponseAPI {}

export type DeleteEbookRequestAPI = Record<string, never>

export interface DeleteEbookResponseAPI {
    success: boolean;
}

export interface EbookCoverResponseAPI {
    url: string
    isDefault: boolean
    width: number
    height: number
}

export type ResponseErrorAPI = ApiErrorResponse
