import { describe, expect, it } from "vitest"
import { DOMParser } from "@xmldom/xmldom"
import { createCoverXhtml } from "../../document/cover"
import { EpubError } from "../../errors"
import type { EpubBook } from "../../types"


const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1">
    <rect width="1" height="1" fill="white"/>
  </svg>`
const svgBytes = new TextEncoder().encode(svg)

function makeBook(overrides: Partial<EpubBook> = {}): EpubBook {

  const baseBook: EpubBook = {
    id: "book-123",
    isbn: "9780306406157",
    title: "Example Title",
    subtitle: "Example Subtitle",
    description: "Example description",
    language: "en",
    createdAt: new Date("2024-01-15T00:00:00.000Z"),
    creator: "Jane Author",
    coverImage: {
      id: "cover",
      fileName: "cover.svg",
      mimeType: "image/svg+xml",
      data: svgBytes,
    },
    assets: [],
    contributors: [{ name: "Editor Name", role: "edt" }],
    chapters: [],
  }

  return {
    ...baseBook,
    ...overrides,
  } as EpubBook
}

function parseXml(xml: string) {
  const errors: string[] = []

  const document = new DOMParser({
    onError: (level, message) => {
      errors.push(`${level}: ${message}`)
    },
  }).parseFromString(xml, "application/xml")

  expect(errors).toEqual([])

  return document
}

describe("createCoverXhtml", () => {
  it("creates a valid XHTML cover document with the cover image", () => {
    const book = makeBook({
      title: "A Cover Title",
      language: "fr",
    })
    const xml = createCoverXhtml(book)
    const doc = parseXml(xml)
    const html = doc.documentElement
    const section = doc.getElementsByTagName("section")[0]
    const img = doc.getElementsByTagName("img")[0]

    expect(html?.localName).toBe("html")
    expect(html?.getAttribute("lang")).toBe("fr")
    expect(html?.getAttribute("xml:lang")).toBe("fr")
    expect(section.getAttribute("epub:type")).toBe("cover")
    expect(img.getAttribute("src")).toBe(
      `images/${encodeURIComponent(book.coverImage!.fileName)}`,
    )
    expect(img.getAttribute("alt")).toBe("A Cover Title")
  })

  it("encodes special characters in the cover filename", () => {
    const book = makeBook({
      coverImage: {
        id: "cover",
        fileName: "cover [final] #1.svg",
        mimeType: "image/svg+xml",
        data: svgBytes,
      },
    })

    const xml = createCoverXhtml(book)
    const doc = parseXml(xml)
    const img = doc.getElementsByTagName("img")[0]

    expect(img.getAttribute("src")).toBe(
      `images/${encodeURIComponent(book.coverImage!.fileName)}`,
    )
    expect(encodeURIComponent(book.coverImage!.fileName)).toBe(
      "cover%20%5Bfinal%5D%20%231.svg",
    )
  })

  it("throws when the book is missing required cover metadata", () => {
    expect(() => createCoverXhtml(makeBook({ title: "   " }))).toThrow(
      EpubError,
    )
    expect(() =>
      createCoverXhtml(makeBook({ title: "Example Title", language: "   " })),
    ).toThrow("Missing required EPUB cover language")
    expect(() => createCoverXhtml(makeBook({ coverImage: null }))).toThrow(
      "Cannot generate EPUB cover without a cover image",
    )
  })

  it("throws when the cover image filename is invalid", () => {
    expect(() =>
      createCoverXhtml(
        makeBook({
          coverImage: {
            id: "cover",
            fileName: "   ",
            mimeType: "image/svg+xml",
            data: new Uint8Array([1, 2, 3]),
          },
        }),
      ),
    ).toThrow("Invalid EPUB cover image filename")
  })
})
