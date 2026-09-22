import type { EbookTypeResponseAPI } from "@/app/types/api/ebook-type"
import { mapModelTimestamps } from "@/lib/map-date-fields-to-timestamps"
import type { EbookType } from "@mythrart/database"

export function mapTypeToResponse(type: EbookType): EbookTypeResponseAPI {
    const mapped = mapModelTimestamps(type)

    return {
        id: mapped.id,
        name: mapped.name,
        slug: mapped.slug,
        description: mapped.description,
        createdAt: mapped.createdAt,
        updatedAt: mapped.updatedAt,
    }
}
