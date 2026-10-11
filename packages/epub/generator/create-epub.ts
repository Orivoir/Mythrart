import { readFile } from "node:fs/promises"

import { EpubError } from "../errors"
import { EPUB_MIMETYPE } from "../constants"

import type {
  CreateEpubOptions,
  EpubArchiveFile,
  EpubGenerationResult,
} from "../types"

import { createContainerXml } from "../document/container"
import { createCoverXhtml } from "../document/cover"
import { createNavigationXhtml } from "../document/navigation"
import { createPackageDocument } from "../document/package-document"

import { createEpubResources } from "../resources/assets"
import { renderChapter } from "../renderers/chapter"

import { buildEpubArchive } from "./build-archive"

import { createOutputFileName } from "../utils/create-output-filename"
import { createChapterHref } from "../utils/chapter-href"

/**
 * Generates a complete EPUB 3 archive from a book.
 */
export async function createEpub(
  book: CreateEpubOptions,
): Promise<EpubGenerationResult> {
  if (!book || typeof book !== "object") {
    throw new EpubError("Invalid EPUB book", "INVALID_BOOK")
  }

  if (!book.coverImage) {
    throw new EpubError(
      "An EPUB cover image is required",
      "INVALID_BOOK",
    )
  }

  if (!Array.isArray(book.chapters) || book.chapters.length === 0) {
    throw new EpubError(
      "An EPUB must contain at least one chapter",
      "INVALID_BOOK",
    )
  }

  const files: EpubArchiveFile[] = []

  // 1. OCF container
  files.push({
    path: "META-INF/container.xml",
    data: createContainerXml(),
  })

  // 2. EPUB package document and navigation
  files.push({
    path: "OEBPS/content.opf",
    data: createPackageDocument(book),
  })

  files.push({
    path: "OEBPS/nav.xhtml",
    data: createNavigationXhtml(book),
  })

  // 3. Cover
  files.push({
    path: "OEBPS/cover.xhtml",
    data: createCoverXhtml(book),
  })

  // 4. Chapters
  const chapters = [...book.chapters].sort(
    (a, b) => a.position - b.position,
  )

  for (const chapter of chapters) {
    files.push({
      path: `OEBPS/${createChapterHref(chapter.id)}`,
      data: renderChapter(chapter, book.language, book.assets),
    })
  }

  // 5. Images, including the cover
  const resources = createEpubResources(book)

  for (const resource of resources) {
    files.push({
      path: resource.path,
      data: resource.data,
    })
  }

  // 6. Stylesheet
  const styles = await readFile(
    new URL("../resources/styles.css", import.meta.url),
    "utf8",
  )

  files.push({
    path: "OEBPS/styles.css",
    data: styles,
  })

  // 7. Archive
  const data = await buildEpubArchive(files)

  return {
    data,
    fileName: createOutputFileName(book.title),
    mimeType: EPUB_MIMETYPE as "application/epub+zip",
  }
}
