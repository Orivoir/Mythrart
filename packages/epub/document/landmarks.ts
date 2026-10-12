import type { EpubBook } from "../types"
import { escapeXml } from "../utils/escape-xml"
import { getLandmarkLabels } from "../utils/locale-nav"
import { EPUB_NAMESPACE } from "../constants"

export function createLandmarks(
  book: EpubBook,
  firstChapterHref: string | undefined,
): string {
  const labels = getLandmarkLabels(book.language)
  const landmarks: string[] = []

  if (book.coverImage) {
    landmarks.push(`
      <li>
        <a epub:type="cover" href="cover.xhtml">
          ${escapeXml(labels.cover)}
        </a>
      </li>`)
  }

  if (firstChapterHref) {
    landmarks.push(`
      <li>
        <a epub:type="bodymatter" href="${escapeXml(firstChapterHref)}">
          ${escapeXml(labels.bodymatter)}
        </a>
      </li>`)
  }

  if (landmarks.length === 0) {
    return ""
  }

  return `
    <nav epub:type="landmarks" id="landmarks" hidden="hidden" xmlns:epub="${EPUB_NAMESPACE}">
      <h2>${escapeXml(labels.title)}</h2>
      <ol>
        ${landmarks.join("\n")}
      </ol>
    </nav>`
}
