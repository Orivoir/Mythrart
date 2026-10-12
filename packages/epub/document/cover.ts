import type { EpubBook } from "../types"
import { EpubError } from "../errors"
import { escapeXml } from "../utils/escape-xml"
import { XHTML_NAMESPACE, EPUB_NAMESPACE } from "../constants"

function normalizeText(value: string): string {
  return value.trim()
}

function createCoverImageHref(fileName: string): string {
  return `images/${encodeURIComponent(fileName)}`
}

export function createCoverXhtml(book: EpubBook): string {
  const title = normalizeText(book.title)
  const language = normalizeText(book.language)
  const coverImage = book.coverImage

  if (!title) {
    throw new EpubError("Missing required EPUB cover title", "INVALID_METADATA")
  }

  if (!language) {
    throw new EpubError(
      "Missing required EPUB cover language",
      "INVALID_METADATA",
    )
  }

  if (!coverImage) {
    throw new EpubError(
      "Cannot generate EPUB cover without a cover image",
      "ASSET_NOT_FOUND",
    )
  }

  const fileName = normalizeText(coverImage.fileName)

  if (!fileName) {
    throw new EpubError("Invalid EPUB cover image filename", "INVALID_ASSET")
  }

  const imageHref = createCoverImageHref(fileName)

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html
  xmlns="${XHTML_NAMESPACE}"
  xmlns:epub="${EPUB_NAMESPACE}"
  lang="${escapeXml(language)}"
  xml:lang="${escapeXml(language)}"
>
  <head>
    <meta charset="UTF-8"/>
    <title>${escapeXml(title)}</title>
  </head>
  <body>
    <section epub:type="cover">
      <img
        src="${escapeXml(imageHref)}"
        alt="${escapeXml(title)}"
      />
    </section>
  </body>
</html>`
}
