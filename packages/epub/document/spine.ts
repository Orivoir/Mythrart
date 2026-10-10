import type { EpubBook } from "../types"
import { escapeXml } from "../utils/escape-xml"
import { normalizeText } from "../utils/normalize-text"

export function createSpine(book: EpubBook): string {
  const items: string[] = []

  if (book.coverImage) {
    items.push('<itemref idref="cover"/>')
  }

  const chapters = [...book.chapters].sort(
    (a, b) => a.position - b.position,
  )

  for (const chapter of chapters) {
    const id = normalizeText(chapter.id)

    items.push(
      `<itemref idref="${escapeXml(`chapter-${id}`)}"/>`,
    )
  }

  return items.join("\n")
}