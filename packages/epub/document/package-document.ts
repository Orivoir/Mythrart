import type { EpubBook } from "../types"
import { EpubError } from "../errors"
import { escapeXml } from "../utils/escape-xml"
import { createMetadataXml } from "./metadata"
import { createImageHref } from "../utils/image-href"
import { createSpine } from "./spine"
import { normalizeText } from "../utils/normalize-text"
import { OPF_NAMESPACE } from "../constants"

function createChapterHref(chapterId: string): string {
  return `chapters/${encodeURIComponent(chapterId)}.xhtml`
}

function createManifest(book: EpubBook): string {
  const items: string[] = []
  const ids = new Set<string>()

  function addItem(id: string, href: string, mediaType: string, properties?: string) {
    if (ids.has(id)) {
      throw new EpubError(
        `Duplicate EPUB manifest item id: ${id}`,
        "INVALID_BOOK",
      )
    }

    ids.add(id)

    const propertiesAttribute = properties
      ? ` properties="${escapeXml(properties)}"`
      : ""

    items.push(
      `    <item id="${escapeXml(id)}" href="${escapeXml(href)}" media-type="${escapeXml(mediaType)}"${propertiesAttribute}/>`
    )
  }

  // Document de navigation
  addItem("nav", "nav.xhtml", "application/xhtml+xml", "nav")

  // Couverture
  if (book.coverImage) {
    const fileName = normalizeText(book.coverImage.fileName)

    if (!fileName) {
      throw new EpubError(
        "Invalid EPUB cover image filename",
        "INVALID_ASSET",
      )
    }

    addItem(
      "cover",
      "cover.xhtml",
      "application/xhtml+xml",
    )

    addItem(
      "cover-image",
      createImageHref(fileName),
      book.coverImage.mimeType,
      "cover-image",
    )
  }

  // Autres ressources images
  const coverFileName = book.coverImage?.fileName
  const assets = book.assets.filter(
    (asset) => asset.fileName !== coverFileName,
  )

  for (const asset of assets) {
    const fileName = normalizeText(asset.fileName)

    if (!fileName) {
      throw new EpubError(
        "Invalid EPUB asset filename",
        "INVALID_ASSET",
      )
    }

    const id = `asset-${asset.id}`

    addItem(
      id,
      createImageHref(fileName),
      asset.mimeType,
    )
  }

  // Chapitres
  const chapters = [...book.chapters].sort(
    (a, b) => a.position - b.position,
  )

  for (let index = 0; index < chapters.length; index++) {
    const chapter = chapters[index]
    const id = normalizeText(chapter.id)
    const title = normalizeText(chapter.title)

    if (!id || !title) {
      throw new EpubError(
        `Invalid EPUB chapter at index ${index}`,
        "INVALID_BOOK",
      )
    }

    addItem(
      `chapter-${id}`,
      createChapterHref(id),
      "application/xhtml+xml",
    )
  }

  return items.join("\n")
}

export function createPackageDocument(book: EpubBook): string {
  const metadataXml = createMetadataXml(book)
  const manifest = createManifest(book)
  const spine = createSpine(book)

  return `<?xml version="1.0" encoding="UTF-8"?>
<package
  xmlns="${OPF_NAMESPACE}"
  version="3.0"
  unique-identifier="pub-id"
  xml:lang="${escapeXml(normalizeText(book.language))}"
>
  ${metadataXml}

  <manifest>
    ${manifest}
  </manifest>

  <spine>
    ${spine}
  </spine>
</package>`
}
