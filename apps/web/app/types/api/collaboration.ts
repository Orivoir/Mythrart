import type { CollaborationPermission, CollaborationRole } from "@mythrart/database"
import type { ApiErrorResponse } from "@/lib/errors"

export interface CollaboratorResponseAPI {
    id: string
    ebookId: string
    userId: string
    role: CollaborationRole | null
    customRoleId: string | null
    allChaptersAccess: boolean
    chapterIds: string[]
    createdAt: number
    updatedAt: number
}

export interface CollaboratorDeleteResponseAPI {
    success: boolean
}

export interface CustomRoleResponseAPI {
    id: string
    ebookId: string
    name: string
    permissions: CollaborationPermission[]
    createdByUserId: string
    createdAt: number
    updatedAt: number
}

export interface CustomRoleDeleteResponseAPI {
    success: boolean
}

export type ResponseErrorAPI = ApiErrorResponse
