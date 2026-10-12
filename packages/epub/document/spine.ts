import type { EpubBook } from "../types"
import { escapeXml } from "../utils/escape-xml"
import { normalizeText } from "../utils/normalize-text"

/**
 * @description Creates the spine section of the EPUB document, listing the order of content items. \
 * Verify conformity with the [EPUB specification](https://www.w3.org/TR/epub-33/#sec-spine-plane)
 *
 * @param book The EPUB book object containing chapters and cover image.
 * @returns A string representing the spine section of the EPUB document.
 */
export function createSpine(book: EpubBook): string {
  const items: string[] = []

  if (book.coverImage) {
    items.push('<itemref idref="cover"/>')
  }

  const chapters = [...book.chapters].sort((a, b) => a.position - b.position)

  for (const chapter of chapters) {
    const id = normalizeText(chapter.id)

    items.push(`<itemref idref="${escapeXml(`chapter-${id}`)}"/>`)
  }

  return items.join("\n")
}
