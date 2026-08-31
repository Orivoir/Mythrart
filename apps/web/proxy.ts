import { NextResponse, type NextRequest } from "next/server"

import { hasEbookPermissionForUser } from "@/lib/authorization"
import { AUTH_USER_ID_HEADER, getAuthenticatedUserId } from "@/lib/auth"
import { prisma, CollaborationPermission } from "@mythrart/database"
import { HTTP_ERRORS } from "./lib/constants/http-code"
import { ApiException, apiErrorResponse } from "./lib/errors"

const METHODS_REQUIRING_ACCESS_CHECK = new Set(["GET", "PUT", "PATCH", "DELETE", "POST"])

type ResourceId = {
    resource: "ebooks" | "chapters" | "collaboration-ebooks" | "collaboration-roles"
    id: string
}

type RequiredPermission = {
    ebookPermission: CollaborationPermission
    chapterPermission?: CollaborationPermission
}

function getResourceIdFromRoute(pathname: string): ResourceId | null {
    const collaborationEbookMatch = pathname.match(/^\/api\/collaborations\/ebooks\/([^/]+)(?:\/.*)?$/)

    if (collaborationEbookMatch?.[1]) {
        return {
            resource: "collaboration-ebooks",
            id: collaborationEbookMatch[1],
        }
    }

    const collaborationRolesMatch = pathname.match(/^\/api\/collaborations\/roles\/([^/]+)(?:\/.*)?$/)

    if (collaborationRolesMatch?.[1]) {
        return {
            resource: "collaboration-roles",
            id: collaborationRolesMatch[1],
        }
    }

    const ebookMatch = pathname.match(/^\/api\/ebooks\/([^/]+)(?:\/.*)?$/)

    if (ebookMatch?.[1]) {
        return {
            resource: "ebooks",
            id: ebookMatch[1],
        }
    }

    const chapterMatch = pathname.match(/^\/api\/chapters\/([^/]+)(?:\/.*)?$/)

    if (chapterMatch?.[1]) {
        return {
            resource: "chapters",
            id: chapterMatch[1],
        }
    }

    return null
}

function isValidResourceId(id: string): boolean {
    return id.trim().length > 0
}

function getRequiredPermission(pathname: string, method: string, resource: ResourceId["resource"]): RequiredPermission | null {
    if (resource === "collaboration-roles") {
        if (method === "POST" || method === "PUT" || method === "DELETE") {
            return {
                ebookPermission: CollaborationPermission.ROLE_ASSIGN,
            }
        }

        return null
    }

    if (resource === "collaboration-ebooks") {
        if (method === "POST") {
            return {
                ebookPermission: CollaborationPermission.COLLABORATOR_INVITE,
            }
        }

        if (method === "PUT") {
            return {
                ebookPermission: CollaborationPermission.ROLE_ASSIGN,
            }
        }

        if (method === "DELETE") {
            return {
                ebookPermission: CollaborationPermission.COLLABORATOR_REMOVE,
            }
        }

        return null
    }

    if (resource === "ebooks") {
        if (/^\/api\/ebooks\/[^/]+\/chapters(?:\/.*)?$/.test(pathname)) {
            if (method === "GET") {
                return {
                    ebookPermission: CollaborationPermission.CHAPTER_READ,
                }
            }

            if (method === "POST") {
                return {
                    ebookPermission: CollaborationPermission.CHAPTER_CREATE,
                }
            }

            return null
        }

        if (method === "PUT") {
            return {
                ebookPermission: CollaborationPermission.EBOOK_UPDATE_METADATA,
            }
        }

        if (method === "DELETE") {
            return {
                ebookPermission: CollaborationPermission.EBOOK_DELETE,
            }
        }

        return null
    }

    if (resource === "chapters") {
        if (method === "PUT") {
            return {
                ebookPermission: CollaborationPermission.CHAPTER_UPDATE,
                chapterPermission: CollaborationPermission.CHAPTER_UPDATE,
            }
        }

        if (method === "DELETE") {
            return {
                ebookPermission: CollaborationPermission.CHAPTER_DELETE,
                chapterPermission: CollaborationPermission.CHAPTER_DELETE,
            }
        }

        return null
    }

    return null
}

async function ensureAuthorizedResource(request: NextRequest, resourceId: ResourceId, userId: string): Promise<boolean> {
    const permission = getRequiredPermission(request.nextUrl.pathname, request.method, resourceId.resource)

    if (!permission) {
        return true
    }

    if (resourceId.resource === "chapters") {
        const chapter = await prisma.chapter.findFirst({
            where: {
                id: resourceId.id,
            },
            select: {
                id: true,
                ebookId: true,
            },
        })

        if (!chapter) {
            return false
        }

        return hasEbookPermissionForUser({
            ebookId: chapter.ebookId,
            userId,
            permission: permission.ebookPermission,
            chapterId: chapter.id,
        })
    }

    return hasEbookPermissionForUser({
        ebookId: resourceId.id,
        userId,
        permission: permission.ebookPermission,
    })
}

async function ensureResourceExists(resourceId: ResourceId): Promise<boolean> {
    if (resourceId.resource === "chapters") {
        const chapter = await prisma.chapter.findFirst({
            where: {
                id: resourceId.id,
            },
            select: {
                id: true,
            },
        })

        return Boolean(chapter)
    }

    const ebook = await prisma.ebook.findFirst({
        where: {
            id: resourceId.id,
        },
        select: {
            id: true,
        },
    })

    return Boolean(ebook)
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
    const userId = await getAuthenticatedUserId(request)

    if (!userId) {
        return apiErrorResponse(new ApiException(HTTP_ERRORS.UNAUTHORIZED))
    }

    const resourceId = getResourceIdFromRoute(request.nextUrl.pathname)

    if (resourceId && METHODS_REQUIRING_ACCESS_CHECK.has(request.method)) {
        if (!isValidResourceId(resourceId.id)) {
            return apiErrorResponse(new ApiException(HTTP_ERRORS.BAD_REQUEST))
        }

        const resourceExists = await ensureResourceExists(resourceId)

        if (!resourceExists) {
            return apiErrorResponse(new ApiException(HTTP_ERRORS.NOT_FOUND))
        }

        const hasAccessToResource = await ensureAuthorizedResource(request, resourceId, userId)

        if (!hasAccessToResource) {
            return apiErrorResponse(new ApiException(HTTP_ERRORS.NOT_FOUND))
        }
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(AUTH_USER_ID_HEADER, userId)

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: ["/api/ebooks/:path*", "/api/chapters/:path*", "/api/collaborations/:path*", "/api/snapshot/:path*"],
}
