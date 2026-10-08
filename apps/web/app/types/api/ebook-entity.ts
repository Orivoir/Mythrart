import type { ApiErrorResponse } from "@/lib/errors"

import type { EbookEntityRelationType, EbookEntityType } from "@mythrart/database"

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

export interface EbookEntityRelationStateSummaryAPI {

    type: EbookEntityRelationType

    chapterId: string | null

    sceneId: string | null

}

export interface EbookEntityRelationSummaryAPI {

    id: string

    states: EbookEntityRelationStateSummaryAPI[]

    direction: "from" | "to"

    relatedEntity: {

        id: string

        name: string

        slug: string

        type: EbookEntityType

    }

    createdAt: number

    updatedAt: number

}

export interface EbookEntityWithRelationsResponseAPI extends EbookEntityResponseAPI {

    relations: EbookEntityRelationSummaryAPI[]

}

export interface PaginatedEbookEntitiesAPI {

    items: EbookEntityWithRelationsResponseAPI[]

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