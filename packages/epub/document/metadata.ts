import type { EpubBook } from "../types"
import { EpubError } from "../errors"
import { escapeXml } from "../utils/escape-xml"
import { normalizeIsbn13 } from "../utils/normalize-isbn13"
import { normalizeText } from "../utils/normalize-text"
import { toEpubDate } from "../utils/to-epub-date"
import {
  OPF_NAMESPACE,
  DC_NAMESPACE,
  DCTERMS_NAMESPACE,
  DC_IDENTIFIER,
  ISBN_ONIX_SCHEME,
  ISBN_13_CODE,
} from "../constants"

function requireText(value: string, field: string): string {
  const normalized = normalizeText(value)

  if (!normalized) {
    throw new EpubError(
      `Missing required EPUB metadata: ${field}`,
      "INVALID_METADATA",
    )
  }

  return escapeXml(normalized)
}

export function createMetadataXml(
  book: EpubBook,
  modifiedAt: Date = new Date(),
): string {
  const identifier = requireText(book.id, "identifier")
  const title = requireText(book.title, "title")
  const creator = requireText(book.creator, "creator")
  const language = requireText(book.language, "language")

  // Validate dates before constructing the document.
  const createdDate = toEpubDate(book.createdAt, "createdAt")
  const modifiedDate = toEpubDate(modifiedAt, "modifiedAt")

  const metadata: string[] = [
    `<dc:identifier id="${DC_IDENTIFIER}">${identifier}</dc:identifier>`,
    `<dc:title id="title">${title}</dc:title>`,
    `<meta refines="#title" property="title-type">main</meta>`,
    `<dc:creator id="creator">${creator}</dc:creator>`,
    `<meta refines="#creator" property="role" scheme="marc:relators">aut</meta>`,
    `<dc:language>${language}</dc:language>`,
  ]

  if (book.isbn?.trim()) {
    const isbn = normalizeIsbn13(book.isbn)

    metadata.push(
      `<dc:identifier id="isbn-id">urn:isbn:${isbn}</dc:identifier>`,
      `<meta refines="#isbn-id" property="identifier-type" scheme="${ISBN_ONIX_SCHEME}">${ISBN_13_CODE}</meta>`,
    )
  }

  if (book.subtitle !== null) {
    const subtitle = normalizeText(book.subtitle)

    if (subtitle) {
      metadata.push(
        `<dc:title id="subtitle">${escapeXml(subtitle)}</dc:title>`,
        `<meta refines="#subtitle" property="title-type">subtitle</meta>`,
      )
    }
  }

  if (book.description !== null) {
    const description = normalizeText(book.description)

    if (description) {
      metadata.push(
        `<dc:description>${escapeXml(description)}</dc:description>`,
      )
    }
  }

  book.contributors.forEach((contributor, index) => {
    const name = normalizeText(contributor.name)
    const role = normalizeText(contributor.role)

    if (!name || !role) {
      throw new EpubError(
        `Invalid EPUB contributor at index ${index}`,
        "INVALID_METADATA",
      )
    }

    const contributorId = `contributor-${index + 1}`

    metadata.push(
      `<dc:contributor id="${contributorId}">${escapeXml(name)}</dc:contributor>`,
      `<meta refines="#${contributorId}" property="role" scheme="marc:relators">${escapeXml(role)}</meta>`,
    )
  })

  if (book.coverImage) {
    metadata.push('<meta name="cover" content="cover-image" />')
  }

  metadata.push(
    `<dc:date>${createdDate}</dc:date>`,
    `<meta property="dcterms:modified">${modifiedDate}</meta>`,
  )

  return `<metadata xmlns="${OPF_NAMESPACE}" xmlns:dc="${DC_NAMESPACE}" xmlns:dcterms="${DCTERMS_NAMESPACE}">
    ${metadata.join("\n  ")}
  </metadata>`
}
