import type { CreateEbookResponseAPI, GetEbookResponseAPI } from "@/app/types/api/ebook"
import { mapModelTimestamps } from "@/lib/map-date-fields-to-timestamps"
import type { EbookTheme, EbookType } from "@mythrart/database"

import { mapTypeToResponse } from "../ebook-types/utils"
import { mapThemeToResponse } from "./[id]/theme/utils"

export interface EbookResponseSource {
    id: string;
    title: string;
    subtitle: string | null;
    shortDescription: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface EbookDetailResponseSource extends EbookResponseSource {
    ebookType: EbookType;
    ebookTheme: EbookTheme;
}

export function mapEbookDetailToResponse(ebook: EbookDetailResponseSource): GetEbookResponseAPI {
    return {
        ...mapEbookToResponse(ebook),
        type: mapTypeToResponse(ebook.ebookType),
        theme: mapThemeToResponse(ebook.ebookTheme),
    }
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