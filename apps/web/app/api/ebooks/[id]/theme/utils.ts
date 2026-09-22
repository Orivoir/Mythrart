import type { EbookThemeResponseAPI } from "@/app/types/api/theme"
import { hasEbookPermissionForUser } from "@/lib/authorization"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { ApiException } from "@/lib/errors"
import { mapModelTimestamps } from "@/lib/map-date-fields-to-timestamps"
import { CollaborationPermission, prisma, type EbookTheme } from "@mythrart/database"

export function mapThemeToResponse(theme: EbookTheme): EbookThemeResponseAPI {
    const mapped = mapModelTimestamps(theme)

    return {
        id: mapped.id,
        name: mapped.name,
        slug: mapped.slug,
        description: mapped.description,
        backgroundColor: mapped.backgroundColor,
        textColor: mapped.textColor,
        textFont: mapped.textFont,
        titleFont: mapped.titleFont,
        subtitleFont: mapped.subtitleFont,
        headingColor: mapped.headingColor,
        fontSize: mapped.fontSize,
        lineHeight: mapped.lineHeight,
        paragraphSpacing: mapped.paragraphSpacing,
        headingSpacing: mapped.headingSpacing,
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
