import type { EpubChapter, EpubAsset } from "../types"

import { EpubError } from "../errors"
import { escapeXml } from "../utils/escape-xml"
import { normalizeText } from "../utils/normalize-text"
import { renderNode } from "./tiptap/render-node"

/**
 * Renders a complete EPUB chapter as an XHTML document.
 *
 * Chapter documents are expected to be stored in OEBPS/chapters/,
 * with the stylesheet at OEBPS/styles.css.
 *
 * @param chapter The chapter metadata and TipTap content.
 * @param language The language of the book, expressed as a BCP 47 tag.
 * @param assets The EPUB assets used to resolve image references.
 * @returns A complete XHTML document as a string.
 */
export function renderChapter(
  chapter: EpubChapter,
  language: string,
  assets: readonly EpubAsset[],
): string {
  const title = normalizeText(chapter.title)
  const normalizedLanguage = normalizeText(language)

  if (!title) {
    throw new EpubError(
      `Invalid title for EPUB chapter: ${chapter.id}`,
      "INVALID_METADATA",
    )
  }

  if (!normalizedLanguage) {
    throw new EpubError(
      `Invalid language for EPUB chapter: ${chapter.id}`,
      "INVALID_METADATA",
    )
  }

  const escapedTitle = escapeXml(title)
  const escapedLanguage = escapeXml(normalizedLanguage)
  const content = renderNode(chapter.content, assets)

  return `<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${escapedLanguage}" xml:lang="${escapedLanguage}">
  
    <head>
      <meta charset="utf-8" />
      <title>${escapedTitle}</title>
      <link rel="stylesheet" type="text/css" href="../styles.css" />
    </head>
  
    <body>
      <section>
        <h1>${escapedTitle}</h1>
        ${content}
      </section>
    </body>
  </html>`
}
