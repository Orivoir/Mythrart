import type {Requirements} from "./../utils.js"
import type {Prisma} from "@mythrart/database"

export interface NormalizedChapter {
  id: string
  title: string

  // should be a TipTap JSON content object
  content: Prisma.JsonValue // JSONContent from (@mythrart/editor-extensions)
  position: number
  createdAt: Date
}

export interface NormalizedEbook {
  id: string
  title: string
  subtitle: string | null
  shortDescription: string | null
  createdAt: Date
  coverImage: {
    assetId: string
    key: string
    bucket: string
  } | null
  assets: Array<{
    id: string
    key: string
    bucket: string
  }>
  chapters: NormalizedChapter[]
}

type ChapterWithContentAssets = Requirements["chapters"][number] & {
  assetReferences: Array<{
    asset: {
      id: string
      key: string
      bucket: string
    }
  }>
}

type ContentAssetReference = ChapterWithContentAssets["assetReferences"][number]

// Exporters should only ever read this shape, never the raw Prisma result with its per-locale nesting.
export default function normalizeExportData(ebook: Requirements): NormalizedEbook {
  const {id, title, subtitle, shortDescription, createdAt} = ebook

  return {
    id,
    title,
    subtitle,
    shortDescription,
    createdAt,
    coverImage: ebook.coverAsset ? {
      assetId: ebook.coverAsset.id,
      key: ebook.coverAsset.key,
      bucket: ebook.coverAsset.bucket,
    } : null,
    assets: ebook.chapters.flatMap((chapter) => {
      if (!hasContentAssets(chapter)) {
        return []
      }

      const assetReferences = chapter.assetReferences as ContentAssetReference[]

      return assetReferences.map(({ asset }) => ({
        id: asset.id,
        key: asset.key,
        bucket: asset.bucket,
      }))
    }),
    chapters: ebook.chapters.map(normalizeChapter),
  }
}

function normalizeChapter(chapter: Requirements["chapters"][number]): NormalizedChapter {
  const localized = chapter.locales[0]

  return {
    id: chapter.id,
    title: localized?.title ?? chapter.title,

    // Should validate chapter content against the TipTap document schema
    // const content = tipTapDocumentSchema.parse(localized?.content)
    content: localized?.content ?? null,
    position: chapter.position,
    createdAt: chapter.createdAt,
  }
}

function hasContentAssets(
  chapter: Requirements["chapters"][number],
): chapter is ChapterWithContentAssets {
  return "assetReferences" in chapter && chapter.assetReferences.every((reference) => "asset" in reference)
}
