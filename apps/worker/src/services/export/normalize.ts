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

interface ExportSourceAsset {
  id: string
  key: string
  bucket: string
}

// Shape shared by the database loader (`Requirements`) and the snapshot loader.
export interface ExportSource {
  id: string
  title: string
  subtitle: string | null
  shortDescription: string | null
  createdAt: Date
  coverAsset: ExportSourceAsset | null
  chapters: Array<{
    id: string
    title: string
    position: number
    createdAt: Date
    locales: Array<{
      locale: string
      title: string | null
      content: Prisma.JsonValue
    }>
    assetReferences: Array<{asset: ExportSourceAsset}>
  }>
}

// Exporters should only ever read this shape, never the raw source with its per-locale nesting.
export default function normalizeExportData(ebook: ExportSource, locale: string): NormalizedEbook {
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
    assets: uniqueAssets(ebook),
    chapters: ebook.chapters.map((chapter) => normalizeChapter(chapter, locale)),
  }
}

function uniqueAssets(ebook: ExportSource): NormalizedEbook["assets"] {
  const byId = new Map<string, NormalizedEbook["assets"][number]>()

  for (const chapter of ebook.chapters) {
    for (const { asset } of chapter.assetReferences) {
      if (!byId.has(asset.id)) {
        byId.set(asset.id, { id: asset.id, key: asset.key, bucket: asset.bucket })
      }
    }
  }

  return [...byId.values()]
}

function normalizeChapter(chapter: ExportSource["chapters"][number], locale: string): NormalizedChapter {
  const localized = chapter.locales.find((entry) => entry.locale === locale)

  if (!localized) {
    throw new Error(`Chapter ${chapter.id} has no translation for locale "${locale}"`)
  }

  return {
    id: chapter.id,
    title: localized.title ?? chapter.title,

    // Should validate chapter content against the TipTap document schema
    // const content = tipTapDocumentSchema.parse(localized?.content)
    content: localized.content ?? null,
    position: chapter.position,
    createdAt: chapter.createdAt,
  }
}
