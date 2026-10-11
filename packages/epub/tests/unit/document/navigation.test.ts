import { describe, expect, it } from "vitest"
import { DOMParser } from "@xmldom/xmldom"
import { createNavigationXhtml } from "../../../document/navigation"
import { EpubError } from "../../../errors"
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
    chapters: [
      {
        id: "chapter-1",
        title: "Chapter One",
        position: 1,
        content: { type: "doc", content: [] },
      },
    ],
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

describe("createNavigationXhtml", () => {
  it("creates a valid TOC and landmarks nav from the book chapters", () => {
    const book = makeBook({
      title: "My Story",
      language: "en",
      coverImage: {
        id: "cover",
        fileName: "cover.jpg",
        mimeType: "image/jpeg",
        data: new Uint8Array([1, 2, 3]),
      },
      chapters: [
        {
          id: "chapter-b",
          title: "Second Chapter",
          position: 2,
          content: { type: "doc", content: [] },
        },
        {
          id: "chapter-a",
          title: "First Chapter",
          position: 1,
          content: { type: "doc", content: [] },
        },
      ],
    })

    const xml = createNavigationXhtml(book)
    const doc = parseXml(xml)
    const html = doc.documentElement
    const toc = doc.getElementsByTagName("nav")[0]
    const landmarkNav = doc.getElementsByTagName("nav")[1]

    expect(html?.localName).toBe("html")
    expect(html?.getAttribute("lang")).toBe("en")
    expect(html?.getAttribute("xml:lang")).toBe("en")
    expect(toc.getAttribute("epub:type")).toBe("toc")
    expect(toc.getAttribute("id")).toBe("toc")

    const links = Array.from(doc.getElementsByTagName("a"))
    const hrefs = links.map((link) => link.getAttribute("href"))

    expect(hrefs).toContain("chapters/chapter-a.xhtml")
    expect(hrefs).toContain("chapters/chapter-b.xhtml")
    expect(links.some((link) => link.textContent?.trim() === "First Chapter")).toBe(true)
    expect(links.some((link) => link.textContent?.trim() === "Second Chapter")).toBe(true)
    expect(landmarkNav.getAttribute("epub:type")).toBe("landmarks")
  })

  it("throws when the book title or language is missing", () => {
    expect(() => createNavigationXhtml(makeBook({ title: "   " }))).toThrow(EpubError)
    expect(() => createNavigationXhtml(makeBook({ language: "   " }))).toThrow(
      "Missing required EPUB navigation language",
    )
  })

  it("throws for invalid chapter entries", () => {
    expect(() =>
      createNavigationXhtml(
        makeBook({
          chapters: [
            {
              id: "",
              title: "Missing id",
              position: 1,
              content: { type: "doc", content: [] },
            },
          ],
        }),
      ),
    ).toThrow(EpubError)

    expect(() =>
      createNavigationXhtml(
        makeBook({
          chapters: [
            {
              id: "dup",
              title: "One",
              position: 1,
              content: { type: "doc", content: [] },
            },
            {
              id: "dup",
              title: "Two",
              position: 2,
              content: { type: "doc", content: [] },
            },
          ],
        }),
      ),
    ).toThrow("Duplicate EPUB navigation chapter id: dup")
  })
})
