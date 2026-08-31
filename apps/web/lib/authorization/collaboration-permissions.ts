import { CollaborationPermission, CollaborationRole, type EbookCollaborator } from "@mythrart/database"

export type EbookCollaboratorWithAccess = EbookCollaborator & {
    customRole: {
        permissions: CollaborationPermission[]
    } | null
    chapterAccess: Array<{
        chapterId: string
    }>
}

export const ALL_COLLABORATION_PERMISSIONS = Object.values(CollaborationPermission) as CollaborationPermission[]

export const COLLABORATION_ROLE_PERMISSIONS: Record<CollaborationRole, readonly CollaborationPermission[]> = {
    OWNER: ALL_COLLABORATION_PERMISSIONS,
    AUTHOR: [
        CollaborationPermission.EBOOK_READ,
        CollaborationPermission.EBOOK_UPDATE_METADATA,
        CollaborationPermission.CHAPTER_READ,
        CollaborationPermission.CHAPTER_CREATE,
        CollaborationPermission.CHAPTER_UPDATE,
        CollaborationPermission.CHAPTER_DELETE,
        CollaborationPermission.SNAPSHOT_READ,
        CollaborationPermission.SNAPSHOT_CREATE,
        CollaborationPermission.ASSET_UPLOAD,
        CollaborationPermission.ASSET_DELETE,
        CollaborationPermission.COVER_UPDATE,
        CollaborationPermission.COLLABORATOR_INVITE,
    ],
    TRANSLATOR: [
        CollaborationPermission.EBOOK_READ,
        CollaborationPermission.CHAPTER_READ,
        CollaborationPermission.CHAPTER_UPDATE,
    ],
    PROOFREADER: [
        CollaborationPermission.EBOOK_READ,
        CollaborationPermission.CHAPTER_READ,
    ],
    EDITOR: [
        CollaborationPermission.EBOOK_READ,
        CollaborationPermission.CHAPTER_READ,
        CollaborationPermission.CHAPTER_UPDATE,
        CollaborationPermission.SNAPSHOT_READ,
    ],
}

function hasChapterPermission(permission: CollaborationPermission): boolean {
    return permission === CollaborationPermission.CHAPTER_READ
        || permission === CollaborationPermission.CHAPTER_CREATE
        || permission === CollaborationPermission.CHAPTER_UPDATE
        || permission === CollaborationPermission.CHAPTER_DELETE
}

function resolveCollaboratorPermissions(collaborator: EbookCollaboratorWithAccess): Set<CollaborationPermission> {
    if (collaborator.customRole) {
        return new Set(collaborator.customRole.permissions)
    }

    if (!collaborator.role) {
        return new Set<CollaborationPermission>()
    }

    return new Set(COLLABORATION_ROLE_PERMISSIONS[collaborator.role])
}

export function collaboratorCanAccessChapter(collaborator: EbookCollaboratorWithAccess, chapterId: string): boolean {
    if (collaborator.allChaptersAccess) {
        return true
    }

    return collaborator.chapterAccess.some((entry) => entry.chapterId === chapterId)
}

export function collaboratorHasPermission(
    collaborator: EbookCollaboratorWithAccess,
    permission: CollaborationPermission,
): boolean {
    const permissions = resolveCollaboratorPermissions(collaborator)
    return permissions.has(permission)
}

export function collaborationPermissionAppliesToChapter(permission: CollaborationPermission): boolean {
    return hasChapterPermission(permission)
}