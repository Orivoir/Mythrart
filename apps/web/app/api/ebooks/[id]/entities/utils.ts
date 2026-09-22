import type { EbookEntityResponseAPI } from "@/app/types/api/ebook-entity"
import { hasEbookPermissionForUser } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException } from "@/lib/errors"
import { mapModelTimestamps } from "@/lib/map-date-fields-to-timestamps"
import { CollaborationPermission, prisma, type EbookEntity } from "@mythrart/database"

export function mapEntityToResponse(entity: EbookEntity): EbookEntityResponseAPI {
    const mapped = mapModelTimestamps(entity)

    return {
        id: mapped.id,
        ebookId: mapped.ebookId,
        name: mapped.name,
        slug: mapped.slug,
        type: mapped.type,
        description: mapped.description,
        createdAt: mapped.createdAt,
        updatedAt: mapped.updatedAt,
    }
}

export async function ensureEbookPermission(
    ebookId: string,
    userId: string,
    permission: CollaborationPermission = CollaborationPermission.EBOOK_READ,
) {
    const hasPermission = await hasEbookPermissionForUser({
        ebookId,
        userId,
        permission,
    })

    if (!hasPermission) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    const ebook = await prisma.ebook.findUnique({
        where: {
            id: ebookId,
        },
    })

    if (!ebook) {
        throw new ApiException(HTTP_ERRORS.NOT_FOUND)
    }

    return ebook
}

export function generateSlug(name: string): string {
    const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")

    return slug || "entity"
}

export async function generateUniqueEntitySlug(
    ebookId: string,
    name: string,
    preferredSlug?: string,
    excludeEntityId?: string,
): Promise<string> {
    const baseSlug = generateSlug(preferredSlug || name)
    let slug = baseSlug

    const existing = await prisma.ebookEntity.findFirst({
        where: {
            ebookId,
            slug,
            ...(excludeEntityId ? { NOT: { id: excludeEntityId } } : {}),
        },
    })

    if (existing) {
        slug = `${baseSlug}-${Date.now()}`
    }

    return slug
}
