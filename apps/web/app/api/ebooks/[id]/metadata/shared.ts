import { mapTypeToResponse } from "@/app/api/ebook-types/utils"
import { prisma } from "@mythrart/database"

import { mapThemeToResponse } from "../theme/utils"
import type { EbookMetadataResponseAPI } from "./types"

export async function getEbookMetadata(
    ebookId: string,
    userId: string,
): Promise<EbookMetadataResponseAPI> {
    const [
        ebook,
        chaptersCount,
        scenesCount,
        writingGoal,
        currentSnapshot,
        localeGroups,
        collaboratorsCount,
        chapterAssetReferencesCount,
    ] = await prisma.$transaction([
        prisma.ebook.findUniqueOrThrow({
            where: { id: ebookId },
            include: { ebookType: true, ebookTheme: true },
        }),
        prisma.chapter.count({ where: { ebookId } }),
        prisma.scene.count({ where: { chapter: { ebookId } } }),
        prisma.writingGoal.findFirst({ where: { ebookId, userId } }),
        prisma.snapshot.findFirst({ where: { ebookId, currentForEbook: { isNot: null } } }),
        prisma.chapterLocale.groupBy({
            by: ["locale"],
            where: { chapter: { ebookId } },
            orderBy: { locale: "asc" },
        }),
        prisma.ebookCollaborator.count({ where: { ebookId } }),
        prisma.chapterAssetReference.count({ where: { chapter: { ebookId } } }),
    ])

    const locales = localeGroups.map(({ locale }) => locale)

    return {
        type: mapTypeToResponse(ebook.ebookType),
        theme: mapThemeToResponse(ebook.ebookTheme),
        chaptersCount,
        scenesCount,
        writingGoal: writingGoal && {
            id: writingGoal.id,
            title: writingGoal.title,
            targetWords: writingGoal.targetWords,
            targetDate: writingGoal.targetDate?.getTime() ?? null,
        },
        currentSnapshot: currentSnapshot && {
            id: currentSnapshot.id,
            version: currentSnapshot.version,
            status: currentSnapshot.status,
            createdAt: currentSnapshot.createdAt.getTime(),
        },
        locales: { count: locales.length, items: locales },
        collaboratorsCount,
        chapterAssetReferencesCount,
    }
}
