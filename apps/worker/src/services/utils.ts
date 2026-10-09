import { prisma } from "@mythrart/database"

export type Requirements = Awaited<ReturnType<typeof loadRequirements>>
export type RequirementsStrategy = "low-cost" | "with-content-assets"

type RequirementsLocale = string | "all"

async function loadChapterLocales(
  chapterId: string,
  locale: RequirementsLocale,
) {
  return prisma.chapterLocale.findMany({
    where: {
      chapterId,
      ...(locale !== "all" ? { locale } : {}),
    },
    orderBy: {
      locale: "asc",
    },
  })
}

async function loadChapterAssetReferences(chapterId: string) {
  return prisma.chapterAssetReference.findMany({
    where: {
      chapterId,
      type: "CONTENT_IMAGE",
    },
    include: {
      asset: true,
    },
  })
}

async function loadChapters(
  ebookId: string,
  strategy: RequirementsStrategy,
  locale: RequirementsLocale,
) {
  const chapters = await prisma.chapter.findMany({
    where: {
      ebookId,
    },
    orderBy: {
      position: "asc",
    },
  })

  return Promise.all(
    chapters.map(async (chapter) => {
      const [locales, assetReferences] = await Promise.all([
        loadChapterLocales(chapter.id, locale),
        strategy === "with-content-assets"
          ? loadChapterAssetReferences(chapter.id)
          : Promise.resolve([]),
      ])

      return {
        ...chapter,
        locales,
        assetReferences,
      }
    }),
  )
}

export async function loadRequirements(
  ebookId: string,
  strategy: RequirementsStrategy = "low-cost",
  locale: RequirementsLocale = "en",
) {
  const ebook = await prisma.ebook.findUnique({
    where: {id: ebookId},
    include: {
      currentSnapshot: true,
      coverAsset: true,
    },
  })

  if(!ebook) {
    throw new Error(`Ebook with id ${ebookId} not found`)
  }

  const chapters = await loadChapters(
    ebookId,
    strategy,
    locale,
  )

  return {
    ...ebook,
    chapters,
  }
}