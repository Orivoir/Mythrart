import type { CreateEbookResponseAPI } from "@/app/types/api/ebook"
import { mapModelTimestamps } from "@/lib/map-date-fields-to-timestamps"

export interface EbookResponseSource {
    id: string;
    title: string;
    subtitle: string | null;
    shortDescription: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export function mapEbookToResponse(ebook: EbookResponseSource): CreateEbookResponseAPI {
    const mappedTimestamps = mapModelTimestamps(ebook)

    return {
        id: mappedTimestamps.id,
        title: mappedTimestamps.title,
        subtitle: mappedTimestamps.subtitle ?? undefined,
        shortDescription: mappedTimestamps.shortDescription ?? undefined,
        createdAt: mappedTimestamps.createdAt,
        updatedAt: mappedTimestamps.updatedAt,
    }
}