import type { ApiErrorResponse } from "@/lib/errors"

export interface EbookThemeResponseAPI {
    id: string
    name: string
    slug: string
    description: string | null
    backgroundColor: string
    textColor: string
    textFont: string
    titleFont: string
    subtitleFont: string | null
    headingColor: string | null
    fontSize: string | null
    lineHeight: string | null
    paragraphSpacing: string | null
    headingSpacing: string | null
    createdAt: number
    updatedAt: number
}

export interface PaginatedEbookThemesAPI {
    items: EbookThemeResponseAPI[]
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
}

export interface CreateEbookThemeRequestAPI {
    name: string
    slug?: string
    description?: string | null
    backgroundColor: string
    textColor: string
    textFont: string
    titleFont: string
    subtitleFont?: string | null
    headingColor?: string | null
    fontSize?: string | null
    lineHeight?: string | null
    paragraphSpacing?: string | null
    headingSpacing?: string | null
}

export interface CreateEbookThemeResponseAPI extends EbookThemeResponseAPI {}

export interface UpdateEbookThemeRequestAPI extends Partial<CreateEbookThemeRequestAPI> {
    themeId?: string
    id?: string
}

export interface UpdateEbookThemeResponseAPI extends EbookThemeResponseAPI {}

export interface DeleteEbookThemeRequestAPI {
    themeId?: string
    id?: string
}

export interface DeleteEbookThemeResponseAPI {
    success: boolean
}

export type ResponseErrorAPI = ApiErrorResponse
