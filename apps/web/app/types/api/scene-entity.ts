import type { ApiErrorResponse } from "@/lib/errors"
import type { EbookEntityResponseAPI } from "./ebook-entity"

export interface SceneEntityResponseAPI {
    sceneId: string
    entityId: string
    createdAt: number
    entity?: EbookEntityResponseAPI
}

export interface PaginatedSceneEntitiesAPI {
    items: SceneEntityResponseAPI[]
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
}

export interface CreateSceneEntityRequestAPI {
    entityId: string
}

export interface CreateSceneEntityResponseAPI extends SceneEntityResponseAPI {}

export interface DeleteSceneEntityResponseAPI {
    success: boolean
}

export type ResponseErrorAPI = ApiErrorResponse
