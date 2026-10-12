import { describe, expect, it } from "vitest"
import { DOMParser } from "@xmldom/xmldom"
import { createLandmarks } from "../../../document/landmarks"
import type { EpubBook } from "../../../types"

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
    coverImage: null,
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

describe("createLandmarks", () => {
  it("creates a landmarks nav with cover and bodymatter links", () => {
    const book = makeBook({
      language: "fr",
      coverImage: {
        id: "cover",
        fileName: "cover.jpg",
        mimeType: "image/jpeg",
        data: new Uint8Array([1, 2, 3]),
      },
    })

    const xml = createLandmarks(book, "chapters/chapter-1.xhtml")
    const doc = parseXml(xml)
    const nav = doc.getElementsByTagName("nav")[0]

    expect(nav.getAttribute("epub:type")).toBe("landmarks")
    expect(nav.getAttribute("id")).toBe("landmarks")
    expect(nav.getAttribute("hidden")).toBe("hidden")

    const links = Array.from(doc.getElementsByTagName("a"))

    expect(
      links.some((link) => link.getAttribute("epub:type") === "cover"),
    ).toBe(true)
    expect(
      links.some((link) => link.getAttribute("href") === "cover.xhtml"),
    ).toBe(true)
    expect(
      links.some((link) => link.textContent?.trim() === "Couverture"),
    ).toBe(true)

    expect(
      links.some((link) => link.getAttribute("epub:type") === "bodymatter"),
    ).toBe(true)
    expect(
      links.some(
        (link) => link.getAttribute("href") === "chapters/chapter-1.xhtml",
      ),
    ).toBe(true)
    expect(
      links.some((link) => link.textContent?.trim() === "Début du contenu"),
    ).toBe(true)
  })

  it("returns an empty string when there are no landmark entries", () => {
    const book = makeBook({ language: "en", coverImage: null })

    expect(createLandmarks(book, undefined)).toBe("")
  })
})
