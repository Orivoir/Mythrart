import { describe, expect, it } from "vitest"
import { DOMParser } from "@xmldom/xmldom"
import { createPackageDocument } from "../../document/package-document"
import { EpubError } from "../../errors"
import type { EpubBook } from "../../types"

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
      fileName: "cover [final] #1.svg",
      mimeType: "image/svg+xml",
      data: new Uint8Array([1, 2, 3]),
    },
    assets: [
      {
        id: "asset-1",
        fileName: "illustration 2.png",
        mimeType: "image/png",
        data: new Uint8Array([4, 5, 6]),
      },
    ],
    contributors: [{ name: "Editor Name", role: "edt" }],
    chapters: [
      {
        id: "chapter-b",
        title: "Second chapter",
        position: 2,
        content: { type: "doc", content: [] },
      },
      {
        id: "chapter-a",
        title: "First chapter",
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

describe("createPackageDocument", () => {
  it("creates a valid package manifest and spine with cover, assets, and ordered chapters", () => {
    const xml = createPackageDocument(makeBook())
    const doc = parseXml(xml)
    const packageElement = doc.documentElement

    expect(packageElement?.localName).toBe("package")
    expect(packageElement?.getAttribute("version")).toBe("3.0")
    expect(packageElement?.getAttribute("unique-identifier")).toBe("pub-id")

    const items = Array.from(doc.getElementsByTagName("item"))
    const itemRefs = Array.from(doc.getElementsByTagName("itemref"))

    const manifestIds = items.map((item) => item.getAttribute("id"))
    expect(manifestIds).toContain("nav")
    expect(manifestIds).toContain("cover")
    expect(manifestIds).toContain("cover-image")
    expect(manifestIds).toContain("chapter-chapter-a")
    expect(manifestIds).toContain("chapter-chapter-b")
    expect(manifestIds).toContain("asset-asset-1")

    const coverItem = items.find((item) => item.getAttribute("id") === "cover")
    const coverImageItem = items.find(
      (item) => item.getAttribute("id") === "cover-image",
    )

    expect(coverItem?.getAttribute("properties")).toBeNull()
    expect(coverImageItem?.getAttribute("properties")).toBe("cover-image")
    expect(coverImageItem?.getAttribute("href")).toBe(
      `images/${encodeURIComponent("cover [final] #1.svg")}`,
    )

    expect(itemRefs.map((itemref) => itemref.getAttribute("idref"))).toEqual([
      "cover",
      "chapter-chapter-a",
      "chapter-chapter-b",
    ])
  })

  it("throws when the cover image filename is invalid or a chapter is invalid", () => {
    expect(() =>
      createPackageDocument(
        makeBook({
          coverImage: {
            id: "cover",
            fileName: "   ",
            mimeType: "image/svg+xml",
            data: new Uint8Array([1]),
          },
        }),
      ),
    ).toThrow(EpubError)

    expect(() =>
      createPackageDocument(
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
  })
})
