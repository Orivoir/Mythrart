import type { EbookTypeResponseAPI } from "@/app/types/api/ebook-type"
import type { EbookThemeResponseAPI } from "@/app/types/api/theme"
import type { Snapshot } from "@mythrart/database"

export interface EbookMetadataWritingGoalAPI {
    id: string
    title: string | null
    targetWords: number | null
    targetDate: number | null
}

export interface EbookMetadataSnapshotAPI {
    id: string
    version: number
    status: Snapshot["status"]
    createdAt: number
}

export interface EbookMetadataResponseAPI {
    type: EbookTypeResponseAPI
    theme: EbookThemeResponseAPI
    chaptersCount: number
    scenesCount: number
    writingGoal: EbookMetadataWritingGoalAPI | null
    currentSnapshot: EbookMetadataSnapshotAPI | null
    locales: {
        count: number
        items: string[]
    }
    collaboratorsCount: number
    chapterAssetReferencesCount: number
}
