import type { EpubBook } from "../types"
import { EpubError } from "../errors"
import { escapeXml } from "../utils/escape-xml"
import { getTocLabel } from "../utils/locale-nav"
import { createLandmarks } from "./landmarks"
import { XHTML_NAMESPACE, EPUB_NAMESPACE } from "../constants"
import { createChapterHref } from "../utils/chapter-href"

function normalizeText(value: string): string {
  return value.trim()
}

export function createNavigationXhtml(book: EpubBook): string {
  const title = normalizeText(book.title)
  const language = normalizeText(book.language)

  if (!title) {
    throw new EpubError(
      "Missing required EPUB navigation title",
      "INVALID_METADATA",
    )
  }

  if (!language) {
    throw new EpubError(
      "Missing required EPUB navigation language",
      "INVALID_METADATA",
    )
  }

  const chapters = [...book.chapters].sort(
    (a, b) => a.position - b.position,
  )

  const seenIds = new Set<string>()

  const chapterLinks = chapters.map((chapter, index) => {
    const id = normalizeText(chapter.id)
    const chapterTitle = normalizeText(chapter.title)

    if (!id || !chapterTitle) {
      throw new EpubError(
        `Invalid EPUB navigation chapter at index ${index}`,
        "INVALID_BOOK",
      )
    }

    if (seenIds.has(id)) {
      throw new EpubError(
        `Duplicate EPUB navigation chapter id: ${id}`,
        "INVALID_BOOK",
      )
    }

    seenIds.add(id)

    const href = createChapterHref(id)

    return `
      <li>
        <a href="${escapeXml(href)}">
          ${escapeXml(chapterTitle)}
        </a>
      </li>`
  })

  const tocLabel = getTocLabel(language)
  const firstChapterHref = chapters[0]
    ? createChapterHref(normalizeText(chapters[0].id))
    : undefined

  const landmarks = createLandmarks(book, firstChapterHref)

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
    <title>${escapeXml(title)} — ${escapeXml(tocLabel)}</title>
  </head>
  <body>
    <nav epub:type="toc" id="toc">
      <h1>${escapeXml(tocLabel)}</h1>

      <ol>
        ${chapterLinks.join("\n")}
      </ol>
    </nav>

    ${landmarks}
  </body>
</html>`
}