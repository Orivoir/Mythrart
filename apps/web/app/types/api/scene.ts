import type { ApiErrorResponse } from "@/lib/errors"

export interface SceneResponseAPI {
    id: string
    chapterId: string | null
    title: string
    objective: string | null
    order: number | null
    createdAt: number
    updatedAt: number
}

export interface PaginatedScenesAPI {
    items: SceneResponseAPI[]
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
}

export interface CreateSceneRequestAPI {
    chapterId: string
    title: string
    objective?: string | null
    order?: number | null
}

export interface CreateSceneResponseAPI extends SceneResponseAPI {}

export interface UpdateSceneRequestAPI {
    title?: string
    objective?: string | null
    order?: number | null
    chapterId?: string
}

export interface UpdateSceneResponseAPI extends SceneResponseAPI {}

export interface DeleteSceneResponseAPI {
    success: boolean
}

export type ResponseErrorAPI = ApiErrorResponse
